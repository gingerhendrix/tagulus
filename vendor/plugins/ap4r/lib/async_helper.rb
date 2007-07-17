# Author:: Shunichi Shinohara
# Copyright:: Copyright (c) 2007 Future Architect Inc.
# Licence:: MIT Licence

require 'reliable-msg'
require 'ap4r/stored_message'
require 'message_builder'

module Ap4r

  # This +AsyncHelper+ is included to +Ap4rClient+ and works the Rails plugin
  # for asynchronous processing.
  #
  module AsyncHelper

    module Base
      Converters = {}

      DRUBY_HOST = ENV['AP4R_DRUBY_HOST'] || 'localhost'
      DRUBY_PORT = ENV['AP4R_DRUBY_PORT'] || '6438'
      DRUBY_URI = "druby://#{DRUBY_HOST}:#{DRUBY_PORT}"

      @@default_dispatch_mode = :HTTP
      @@default_rm_options = { :delivery => :once, :dispatch_mode => @@default_dispatch_mode }
      @@default_queue_prefix = "queue."

      mattr_accessor :default_dispatch_mode, :default_rm_options, :default_queue_prefix, :saf_delete_mode

      # This method is aliased as ::Ap4r::Client#transaction
      #
      def transaction_with_saf(active_record_class = ::Ap4r::StoredMessage, *objects, &block)

        Thread.current[:use_saf] = true
        Thread.current[:stored_messages] = {}

        # store
        active_record_class ||= ::Ap4r::StoredMessage
        active_record_class.transaction(*objects, &block)

        # forward
        forwarded_messages = {}
        begin

          # TODO: reconsider forwarding strategy, 2006/10/13 kato-k
          # Once some error occured, such as disconnect reliable-msg or server crush,
          # which is smart to keep to put a message or stop to do it?
          # In the case of being many async messages, the former strategy is not so good.
          #
          # TODO: add delayed forward mode 2007/05/02 by shino
          Thread.current[:stored_messages].each {|k,v|
            __queue_put(v[:queue_name], v[:queue_message], v[:queue_headers])
            forwarded_messages[k] = v
          }
        rescue Exception => err
          # Don't raise any Exception. Application logic has already completed and messages are saved.
          logger.warn("Failed to put a message into queue: #{err}")
        end

        begin
          StoredMessage.transaction do
            options = {:delete_mode => @@saf_delete_mode || :physical}
            forwarded_messages.keys.each {|id|
              ::Ap4r::StoredMessage.destroy_if_exists(id, options)
            }
          end
        rescue Exception => err
          # Don't raise any Exception. Application logic has already completed and messages are saved.
          logger.warn("Failed to put a message into queue: #{err}")
        end

      ensure
        Thread.current[:use_saf] = false
        Thread.current[:stored_messages] = nil
      end

      # This method is aliased as ::Ap4r::Client#async_to
      #
      def async_dispatch(url_options = {}, async_params = {}, rm_options = {}, &block)

        if logger.debug?
          logger.debug("url_options: ")
          logger.debug(url_options.inspect)
          logger.debug("async_params: ")
          logger.debug(async_params.inspect)
          logger.debug("rm_options: ")
          logger.debug(rm_options.inspect)
        end

        # TODO: clone it, 2006/10/16 shino
        url_options ||= {}
        url_options[:controller] ||= @controller.controller_path.gsub("/", ".")
        url_options[:url] ||= {:controller => url_options[:controller], :action => url_options[:action]}
        url_options[:url][:controller] ||= url_options[:controller] if url_options[:url].kind_of?(Hash)

        rm_options = @@default_rm_options.merge(rm_options || {})

        # Only async_params is not cloned. options and rm_options are cloned before now.
        # This is a current contract between this class and converter classes.
        converter = Converters[rm_options[:dispatch_mode]].new(url_options, async_params, rm_options, self)
        logger.debug{"druby uri for queue-manager : #{DRUBY_URI}"}

        queue_name = __get_queue_name(url_options, rm_options)
        queue_message = converter.make_params
        queue_headers = converter.make_rm_options

        message_builder = ::Ap4r::MessageBuilder.new(queue_name, queue_message, queue_headers)
        if block_given?
          message_builder.instance_eval(&block)
        end
        queue_name = message_builder.queue_name
        queue_message = message_builder.format_message_body
        queue_headers = message_builder.message_headers

        if Thread.current[:use_saf]
          stored_message = ::Ap4r::StoredMessage.store(queue_name, queue_message, queue_headers)

          Thread.current[:stored_messages].store(
                                                 stored_message.id,
                                                 {
                                                   :queue_message => queue_message,
                                                   :queue_name => queue_name,
                                                   :queue_headers => queue_headers
                                                 } )
          return stored_message.id
        end

        __queue_put(queue_name, queue_message, queue_headers)
      end

      private
      def __queue_put(queue_name, queue_message, queue_headers)
        # TODO: can use a Queue instance repeatedly? 2007/05/02 by shino
        q = ReliableMsg::Queue.new(queue_name, :drb_uri => DRUBY_URI)
        q.put(queue_message, queue_headers)
      end

      def __get_queue_name(options, rm_options)
        if options[:url].kind_of?(Hash)
          rm_options[:queue_name] ||=
            @@default_queue_prefix.clone.concat(options[:url][:controller].to_s).concat('.').concat(options[:url][:action].to_s)
        else
          rm_options[:queue_name] ||=
            @@default_queue_prefix.clone.chomp(".").concat(URI::parse(options[:url]).path.gsub("/", "."))
        end
        rm_options[:queue_name]
      end

    end

    module Converters #:nodoc:

      # A base class for converter classes.
      # Responsibilities of subclasses are as folows
      # * by +make_params+, convert async_params to appropriate object
      # * by +make_rm_options+, make appropriate +Hash+ passed by <tt>ReliableMsg::Queue#put</tt>
      class Base

        # Difine a constant +DISPATCH_MODE+ to value 'mode_symbol' and
        # add self to a Converters list.
        def self.dispatch_mode(mode_symbol)
          self.const_set(:DISPATCH_MODE, mode_symbol)
          ::Ap4r::AsyncHelper::Base::Converters[mode_symbol] = self
        end

        def initialize(url_options, async_params, rm_options, url_for_handler)
          @url_options = url_options
          @async_params = async_params
          @rm_options = rm_options
          @url_for_handler = url_for_handler
        end

        # Returns a object which passed to <tt>ReliableMsg::Queue.put(message, headers)</tt>'s
        # first argument +message+.
        # Should be implemented by subclasses.
        def make_params
          raise 'must be implemented in subclasses'
        end

        # Returns a object which passed to <tt>ReliableMsg::Queue.put(message, headers)</tt>'s
        # second argument +headers+.
        # Should be implemented by subclasses.
        def make_rm_options
          raise 'must be implemented in subclasses'
        end

        private
        # helper method for <tt>ActionController#url_for</tt>
        def url_for(url_for_options, *parameter_for_method_reference)
          return url_for_options if url_for_options.kind_of?(String)
          @url_for_handler.url_for(url_for_options, *parameter_for_method_reference)
        end

      end

      class Http < Base
        dispatch_mode :HTTP

        def make_params
          @async_params
        end

        def make_rm_options
          @rm_options[:target_url] ||= url_for(@url_options[:url])
          @rm_options[:target_method] ||= 'POST'
          #TODO: make option key to specify HTTP headers, 2006/10/16 shino
          @rm_options
        end
      end

      class WebService < Base
        def make_params
          message_obj = {}
          @async_params.each_pair{|k,v| message_obj[k.to_sym]=v}
          message_obj
        end

        def make_rm_options
          @rm_options[:target_url] ||= target_url_name
          @rm_options[:target_action] ||= action_api_name
          @rm_options
        end

        def action_api_name
          action_method_name = @url_options[:url][:action]
          action_method_name.camelcase
        end

        def options_without_action
          @url_options[:url].reject{ |k,v| k == :action }
        end

      end

      class XmlRpc < WebService
        dispatch_mode :XMLRPC

        def target_url_name
          url_for(options_without_action) + rails_api_url_suffix
        end

        private
        def rails_api_url_suffix
          '/api'
        end
      end

      class SOAP < WebService
        dispatch_mode :SOAP

        def target_url_name
          url_for(options_without_action) + rails_wsdl_url_suffix
        end

        private
        def rails_wsdl_url_suffix
          '/service.wsdl'
        end
      end

    end
  end
end

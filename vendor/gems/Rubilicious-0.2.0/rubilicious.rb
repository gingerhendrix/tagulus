#######################################################################
# Rubilicious - Delicious (http://del.icio.us/) bindings for Ruby.    #
# by Paul Duncan <pabs@pablotron.org>                                 #
#                                                                     #
#                                                                     #
# For the latest version of this software, Please see the Rubilicious #
# page at http://pablotron.org/software/rubilicious/.                 #
#                                                                     #
#                                                                     #
# Copyright (C) 2004-2006 Paul Duncan (pabs@pablotron.org).           #
#                                                                     #
# Permission is hereby granted, free of charge, to any person         #
# obtaining a copy of this software and associated documentation      #
# files (the "Software"), to deal in the Software without             #
# restriction, including without limitation the rights to use, copy,  #
# modify, merge, publish, distribute, sublicense, and/or sell copies  #
# of the Software, and to permit persons to whom the Software is      #
# furnished to do so, subject to the following conditions:            #
#                                                                     #
# The above copyright notice and this permission notice shall be      #
# included in all copies of the Software, its documentation and       #
# marketing & publicity materials, and acknowledgment shall be given  #
# in the documentation, materials and software packages that this     #
# Software was used.                                                  #
#                                                                     #
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,     #
# EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF  #
# MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND               #
# NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY    #
# CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF          #
# CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION  #
# WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.     #
#######################################################################

# load required libraries
require 'cgi'
require 'uri'
require 'time'
require 'net/http'
require 'rexml/document'

#
# Rubilicious - Delicious (http://del.icio.us/) bindings for Ruby.
#
# You'll need to create an account at Delicious (http://del.icio.us/) in
# order to use this API.
#
# Simple Examples: 
#   # load rubilicious
#   require 'rubilicious'
#
#   # connect to delicious and get a list of your recent posts
#   r = Rubilicious.new('user', 'password')
#   r.recent.each do |post|
#     puts "#{post['description']}: #{post['href']}"
#   end
#
#   # add a new link to delicious
#   r.add('http://pablotron.org/', 'Pablotron.org')
#
#   # save recent funny posts to an XBEL file
#   File.open('funny_links.xbel', 'w') do |file|
#     file.puts Rubilicious.xbel(r.recent('funny'))
#   end
#
class Rubilicious
  #
  # Base Rubilicious Error class.
  #
  class Error < StandardError; end

  #
  # Wrapper for HTTP-related Rubilicious errors.
  #
  class HTTPError < Error; end

  #
  # Raised if an application attempts to connect to an https resource
  # without OpenSSL support. 
  #
  class NoSSLError < Error; end

  # 
  # Module containing methods to maintain compatability with methods
  # from Rubilicious 0.1.x.
  # 
  # Note: These methods are deprecated and may be removed from a future
  # version of Rubilicious.
  # 
  # If you have an application that depends on the old 0.1-style
  # methods added by Rubilicious -- String#uri_escape,
  # Array#to_xbel, etc -- you can do one of the following:
  #
  # 1.  Add a call to Rubilicious::Extras.include_extras before calling
  #     any of the old-style methods.
  # 2.  Include one of the Extra classes piecemeal.  For example, if
  #     your application depends on Array#to_xbel, the following code
  #     will add Array#to_xbel:
  #     
  #       class Array
  #         include Rubilicious::Extras::Array
  #       end
  #     
  # 3.  Fix your code.  Each of the old-style calls maps to either a new
  #     non-toplevel method or a Ruby built-in method.  For example,
  #     Array#to_xbel can be replaced by Rubilicious.xbel(ary), and
  #     String#xml_escape can be replaced by CGI.escapeHTML(str).
  #
  module Extras
    # 
    # Module containing methods to maintain compatability with methods
    # added to the top-level String class in Rubilicious 0.1.x.
    # 
    # Note: These methods are deprecated and may be removed from a future
    # version of Rubilicious.
    # 
    module String
      #
      # Escape XML-special characters in string.
      #
      # Note: this method is deprecated and may be removed from a future
      # version of Rubilicious.
      #
      def xml_escape
        CGI.escapeHTML(self)
      end
    
      #
      # XML escape elements, including spaces, ?, and +
      #
      def uri_escape
        CGI.escape(self)
      end
    end
  
    # 
    # Module containing methods to maintain compatability with methods
    # added to the top-level Array class in Rubilicious 0.1.x.
    # 
    # Note: These methods are deprecated and may be removed from a future
    # version of Rubilicious.
    # 
    module Array
      def to_xbel(tag = nil)
        Rubilicious.xbel(self, tag)
      end
    end

    # 
    # Module containing methods to maintain compatability with methods
    # added to the top-level Time class in Rubilicious 0.1.x.
    # 
    # Note: These methods are deprecated and may be removed from a future
    # version of Rubilicious.
    # 
    module Time
      def self.from_iso8601(str)
        ::Time.iso8601(str)
      end

      def to_iso8601
        gmtime.iso8601
      end
    end

    module Rubilicious
      #
      # Returns a array of inbox entries, optionally filtered by date.
      #
      # Raises an exception on error.
      # 
      # Example:
      #   # print a list of posts and who posted them
      #   r.inbox.each { |post| puts "#{post['user']},#{post['href']}" }
      #
      def inbox(date = nil)
        time_prefix = "#{date || Time.now.strftime('%Y-%m-%d')}T"
        ret = get('inbox/get?' << (date ? "dt=#{date}" : ''), 'post').map do |post|
          post['time'] = Time.iso8601("#{time_prefix}#{post['time']}Z")
          post
        end
        ret
      end

      #
      # Returns a hash of dates containing inbox entries.
      # 
      # Raises an exception on error.
      #
      # Example:
      #   # print out a list of the 10 busiest inbox dates
      #   dates = r.inbox_dates
      #   puts dates.keys.sort { |a, b| dates[b] <=> dates[a] }.slice(0, 10)
      #
      def inbox_dates
        get('inbox/dates?', 'date').inject({}) do  |ret, e|
          ret[e['date']] = e['count'].to_i
          ret
        end
      end

      #
      # Returns a hash of your subscriptions.
      # 
      # Raises an exception on error.
      #
      # Example:
      #   # print out a list of subscriptions
      #   subs = r.subs
      #   puts "user:tags"
      #   subs.keys.sort.each do |sub| 
      #     puts "#{sub}:#{subs[sub].join(' ')}"
      #   end
      #
      def subs
        get('inbox/subs?', 'sub').inject({}) do |ret, e|
          ret[e['user']] = [] unless ret[e['user']]
          ret[e['user']] += e['tag'].split(' ')
          ret
        end
      end

      #
      # Add a subscription, optionally to a specific tag.
      #
      # Raises an exception on error.
      #
      # Example:
      #   # subscribe to 'humor' links from solarce
      #   r.sub('solarce', 'humor')
      #
      def sub(user, tag = nil)
        raise Error, "Missing user" unless user
        args = ["user=#{u(user)}", (tag ? "tag=#{u(tag)}" : nil)]
        get('inbox/sub?' << args.compact.join('&amp;'), 'post')
        nil
      end

      #
      # Removes a subscription, optionally only a specific tag.
      #
      # Raises an exception on error.
      #
      # Example:
      #   # unsubscribe from all links from giblet
      #   r.unsub('giblet')
      #
      def unsub(user, tag = nil)
        raise Error, "Missing user" unless user
        args = ["user=#{user}", (tag ? "tag=#{tag}" : nil)]
        get('inbox/unsub?' << args.compact.join('&amp;'))
        nil
      end

      #
      # Return all of a user's posts, optionally filtered by tag.
      #
      # WARNING: This method can generate a large number of requests to 
      # Delicious, and could be construed as abuse.  Use sparingly, and at
      # your own risk.
      #
      # Raises an exception on error.
      #
      # Example:
      #   # save all posts every by 'delineator' to XBEL format to file
      #   # "delineator.xbel"
      #   File.open('delineator.xbel', 'w') do |file|
      #     file.puts Rubilicious.xbel(r.user_posts('delineator'))
      #   end
      #
      def user_posts(user, tag = nil)
        was_subscribed = true
        ret = []

        # unless we already subscribed, subscribe to user
        unless subs.keys.include?(user)
          sub(user)
          was_subscribed = false
        end
        
        # grab list of user's posts
        inbox_dates.keys.each do |date|
          ret += inbox(date).find_all do |post| 
            post['user'] == user && (tag == nil || post['tags'].include?(tag))
          end
        end

        # unsubscribe from user unless we were already subscribed
        unsub(user) unless was_subscribed

        # return list of user's posts
        ret
      end

    end

    #
    # Add the old inbox methods back to Rubilicious.
    #
    # Note: The inbox functions (Rubilicious#inbox, Rubilicious#sub,
    # Rubilicious#unsub, etc) do _not_ work with the current Delicious
    # API (v1).  They are included for compatability with non-Delicious
    # that use the old Delicious API.  
    #
    # If you want to include all the old Rubilicious methods (including
    # the changes to String, Array, and Time), see the include_extras
    # method.
    #
    def self.include_inbox
      ::Rubilicious.class_eval { 
        include Extras::Rubilicious

        # handy aliases
        alias :subscriptions :subs
        alias :subscribe :sub
        alias :unsubscribe :unsub
      }
    end

    #
    # Add old Rubilicious 0.1.x-style String, Array, and Time methods to
    # the environment.  This method also adds the old inbox methods back
    # in to Rubilicious.  If you just want the old inbox methods without
    # the other methods, see the include_inbox method.
    #
    # Note: This method is only to maintain source compatability with
    # Rubilicious 0.1.x-style applications and should not be used in
    # newer code.
    #
    def self.include_extras
      self.constants.each do |c|
        Kernel.const_get(c).class_eval { include Extras.const_get(c) }
      end

      # include inbox changes
      include_inbox
    end
  end
      
  #
  # Convert an array of posts (bookmarks) to an XBEL string.
  # 
  # Note: This method is significantly less taxing on Delicious than 
  # Rubilicious#to_xbel, since it acts on an array of posts in memory 
  # rather than a series of remote calls like it's counterpart.
  #
  # Raises an exception on error.
  #
  # Example:
  #   File.open('output.xbel', 'w') do |file|
  #     # grab all recent posts
  #     results = r.recent
  #
  #     # save results to file
  #     file.puts Rubilicous.xbel(results)
  #   end
  #
  def self.xbel(src_ary, tag = nil)
    ret = [ "<?xml version='1.0' encoding='utf-8'?>",
            "<xbel version='1.0' added='#{Time.now.iso8601}'>",
            "  <title>#{@user}'s Delicious Bookmarks</title>" ]
  
    # find all bookmarks in list with given tag and sort tag
    tags = src_ary.find_all { |e| 
      !tag || e['tags'].include?(tag) 
    }.inject({}) do |tags, bm|
      if bm['tags'] && bm['tags'].size > 0
        bm['tags'] = bm['tags'] ? bm['tags'].split(' ').sort : []
        # TODO: alias support
        bm['tags'].each { |tag| tags[tag] ||= []; tags[tag] << bm }
      else 
        tags['uncategorized'] ||= []
        tags['uncategorized'] << bm
      end

      tags
    end
    
    # print the folders out in order
    tags.keys.sort.each do |tag|
      ary = tags[tag]
      ret <<  [ 
        "  <folder id='#{tag}' added='#{Time.now.iso8601}'>",
        # "  <folder id='#{tag}'>",
        "    <title>#{tag.capitalize}</title>",

        ary.sort { |a, b| a['description'] <=> b['description'] }.map do |bm|
          href, bm_id = CGI.escape(bm['href']), "#{tag}-#{bm['hash']}", 
          time = bm['time'].iso8601
          title = CGI.escapeHTML(bm['description'] || '')
          desc = CGI.escapeHTML(bm['extended'] || '')

          [ "    <bookmark href='#{href}' id='#{bm_id}' added='#{time}'>",
          # [ "    <bookmark href='#{href}' id='#{bm_id}'>",
            "      <title>#{title}</title>",
            "      <desc>#{desc}</desc>",
            "    </bookmark>" ,
          ].join("\n")
        end.join("\n"),

        '  </folder>',
      ].join("\n")
    end

    # attach closing tag and return string
    ret << '</xbel>'
    ret.join("\n")
  end

  attr_reader :user
  attr_accessor :use_proxy, :base_uri

  VERSION = '0.2.0'
  
  protected

  # check for https support (requires OpenSSL)
  HAVE_SSL = begin
    require 'net/https'

    #
    # Initialize SSL for this Rubilicious instance.
    #
    # NOTE: SSL certificate verification is disabled by default. See
    # Rubilicious#initialize for information on enabling SSL certificate
    # verification.
    #
    def init_ssl(opt)
      @ssl_init_http = opt['ssl_init_http']
      @ssl_verify = opt['ssl_verify']

      if cb = opt['ssl_init']
        cb.call(self, opt)
      elsif @verify_ssl
        # set verify mode, create cert store
        @ssl_verify_mode = OpenSSL::SSL::VERIFY_PEER
        @ssl_store = OpenSSL::X509::Store.new

        # add path to certificate store
        # TODO: documentation, at least in method definition
        cert_path = opt['ssl_cert_path'] ||
                    ENV['RUBILICIOUS_SSL_CERT_DIR'] ||
                    ENV['SSL_CERT_DIR'] ||
                    OpenSSL::X509::DEFAULT_CERT_DIR
        @ssl_store.add_path(cert_path)
      else
        # disable SSL verification by default
        @ssl_verify_mode = OpenSSL::SSL::VERIFY_NONE
      end
    end

    #
    # Initialize SSL for a particular HTTP connection
    #
    def init_http_ssl(http)
      if @ssl_init_http
        @ssl_init_http.call(self, http)
      else
        # enable SSL for this HTTP connection
        http.use_ssl = true

        if @ssl_verify
          # set the verify mode and the cert store
          http.verify_mode = @ssl_verify_mode
          http.cert_store = @ssl_store
        end
      end
    end

    # return true (we have SSL support)
    true
  rescue LoadError
    # return false (no SSL support)
    false
  end

  # list of environment variables to check for HTTP proxy
  PROXY_ENV_VARS = %w{RUBILICIOUS_HTTP_PROXY HTTP_PROXY http_proxy}


  #
  # get the HTTP proxy server and port from the environment
  # Returns [nil, nil] if a proxy is not set
  #
  # This method is private
  #
  def find_http_proxy
    ret = [nil, nil]

    # check the platform.  If we're running in windows then we need to 
    # check the registry
    if @use_proxy
      if RUBY_PLATFORM =~ /win32/i
        # Find a proxy in Windows by checking the registry.
        # this code shamelessly copied from Raggle :D

        require 'win32/registry'

        Win32::Registry::open(
          Win32::Registry::HKEY_CURRENT_USER,
          'Software\Microsoft\Windows\CurrentVersion\Internet Settings'
        ) do |reg|
          # check and see if proxy is enabled
          if reg.read('ProxyEnable')[1] != 0
            # get server, port, and no_proxy (overrides)
            server = reg.read('ProxyServer')[1]
            np = reg.read('ProxyOverride')[1]

            server =~ /^([^:]+):(.+)$/
            ret = [$1, $2]

            # don't bother with no_proxy support
            # ret['no_proxy'] = np.gsub(/;/, ',') if np && np.length > 0
          end
        end
      else
        # handle UNIX systems
        PROXY_ENV_VARS.each do |env_var|
          if ENV[env_var]
            # if we found a proxy, then parse it
            ret = ENV[env_var].sub(/^http:\/\/([^\/]+)\/?$/, '\1').split(':')
            ret[1] = ret[1].to_i if ret[1]
            break
          end
        end
        # $stderr.puts "DEBUG: http_proxy = #{ENV['http_proxy']}, ret = [#{ret.join(',')}]"
      end
    else 
      # proxy is disabled
      ret = [nil, nil]
    end

    # return host and port
    ret
  end

  #
  # Low-level HTTP GET.
  #
  # This method is private.
  #
  def http_get(url)
    # get proxy info
    proxy_host, proxy_port = find_http_proxy
    # $stderr.puts "DEBUG: proxy: host = #{proxy_host}, port = #{proxy_port}"

    # get host, port, and base URI for API queries
    uri = URI.parse(@base_uri)
    base = uri.request_uri

    # prepend base to url
    url = "#{base}/#{url}"

    # connect to delicious
    http = Net::HTTP.Proxy(proxy_host, proxy_port).new(uri.host, uri.port)

    if uri.scheme == 'https'
      # check to make sure we have SSL support
      raise NoSSLError, "Unsupported URI scheme 'https'" unless HAVE_SSL
      init_http_ssl(http)
    end

    # start HTTP connection
    http = http.start

    # get URL, check for error
    resp = http.get(url, @headers)
    raise HTTPError, "HTTP #{resp.code}: #{resp.message}" unless resp.code =~ /2\d{2}/

    # close HTTP connection, return response
    http.finish
    resp.body
  end

  #
  # Get url from Delicious, and optionally parse result and return as
  # an array of hashes as well.
  #
  # This method is private.
  #
  def get(url, elem = nil)
    # check last request time, if it was too recent, then wait
    sleep 1.0 if @last_request && (Time.now.to_i - @last_request) < 1
    @last_request = Time.now.to_i
    
    # get result and parse it
    ret = REXML::Document.new(http_get(url))
    
    # if we got something, then parse it
    if elem
      ary = []
      ret.root.elements.each("//#{elem}") do |e|
        hash = {}
        e.attributes.each { |key, val| hash[key] = val }
        ary << hash
      end
      ret = ary
    end

    # return result
    ret
  end

  #
  # URI-escape a string.
  #
  def u(str)
    CGI.escape(str)
  end

  #
  # Escape a string to make it XML-friendly.
  #
  def h(str)
    CGI.escapeHTML(str)
  end

  public

  #
  # Connect to Delicious with username 'user' and password 'pass'.
  #
  # Note: if the username or password is incorrect, Rubilicious will not
  # raise an exception until you make an actual call.
  # 
  # Examples:
  #   # connect to delicious with as 'pabs' with the password 'password'
  #   r = Rubilicious.new('pabs', 'password')
  # 
  #   # connect to delicious, but never check for an HTTP proxy
  #   r = Rubilicious.new('pabs', 'password', {'use_proxy' => false})
  # 
  # Options: 
  # Rubilicious also accepts several optional parameters in the opt
  # Hash.  Here's a list of the supported keys:
  #
  # * use_proxy: Check for HTTP proxy environment variables, and use
  #   HTTP proxy if any are set. (default: true)
  # * base_uri: URI to Delicious API.  Best not to touch this one unless
  #   you know what you're doing. (default: 'https://api.del.icio.us/v1')
  # * user_agent: User Agent string to pass to Delicious in each HTTP
  #   request. (default: 'Rubilicious/VERSION Ruby/VERSION')
  # * ssl_verify: Enable SSL certificate validation/verification.
  #   Rubilicious will verify the issuer of the server-side certificate
  #   against the list of trusted certificates.  You can customize this
  #   behavior; see below for more information.
  # * ssl_cert_path: Override the default SSL certificate directory.
  #   If this isn't set, Rubilicious checks the environment variables
  #   RUBILICIOUS_SSL_CERT_DIR and SSL_CERT_DIR.  If neither of those
  #   are set, Rubilicious uses OpenSSL's built-in default.
  # * ssl_init: Callback proc to use for SSL initialization.  See "SSL
  #   Options" below for more information.
  # * ssl_init_http: Callback proc to use for initializing each HTTPS
  #   connection.  See "SSL Options" below for more information.
  #
  # SSL Options:
  # By default, Rubilicious does no server-side certificate validation.
  # This is deliberate; I'm not sure how reasonable each platform's
  # OpenSSL configuration is, and I'm also not sure how complete each
  # platform's root certificate list is.  If you're sure your platform
  # is configured properly, you can enable server-side certificate
  # verification using the 'ssl_verify' option, like so:
  #    
  #   # enable SSL certificate verification
  #   r = Rubilicious.new(user, pass, 'ssl_verify' => true)
  #
  # If you keep your list of root certificates in a directory other than
  # the OpenSSL default, you can override the path by setting the
  # 'ssl_cert_path' option, or the RUBILICIOUS_SSL_CERT_DIR or
  # SSL_CERT_DIR environment variables (they're checked in that order).
  # If none of those are set, Rubilicious falls back to OpenSSL's
  # built-in certificate directory.
  #
  # If you need more elaborate SSL verification -- to use OSCP or
  # check a CRL, for example --  you can use the 'ssl_init' and
  # 'ssl_init_http' callbacks.  The former is called once when an
  # instance of Rubilicious is initialized, and the latter is called for
  # each HTTPS connection.  Here's an example of using the 'ssl_init'
  # and 'ssl_init_http' callbacks:
  # 
  # # create certificate store, set verify mode
  # x509_store = OpenSSL::X509::Store.new 
  # x509_store.add_path(OpenSSL::X509::DEFAULT_CERT_DIR)
  # verify_mode = OpenSSL::SSL::VERIFY_PEER
  #
  #   # define rubilicious callbacks
  #   rb_opts = {
  #     # ssl init callback (called once per instance)
  #     'ssl_init' => proc { |rb, opt|
  #       cert_path = opt['ssl_cert_path'] ||
  #                   ENV['RUBILICIOUS_SSL_CERT_DIR'] ||
  #                   ENV['SSL_CERT_DIR'] ||
  #                   OpenSSL::X509::DEFAULT_CERT_DIR
  #       x509_store.add_path(cert_path)
  #       
  #     },
  #   
  #     # http init callback (called once per HTTPS connection)
  #     'ssl_init_http' => proc { |rb, http|
  #       http.use_ssl = true
  #       http.verify_mode = verify_mode
  #       http.cert_store = x509_store
  #     },
  #   }
  #  
  #   # create rubilicious object
  #   rb = Rubilicious.new(user, pass, rb_opts)
  #
  def initialize(user, pass, opt = {})
    @user, @use_proxy = user, true

    # set use proxy
    @use_proxy = opt['use_proxy'] if opt.key?('use_proxy')

    # set API URL (note that this can be changed by the user later)
    @base_uri = opt['base_uri'] || 
                ENV['RUBILICIOUS_BASE_URI'] || 
                'https://api.del.icio.us/v1'

    # if we have SSL support, then set the SSL verify mode
    # (defaults to VERIFY_NONE, which is horribly insecure)
    if HAVE_SSL
      init_ssl(opt)
    end

    # set user agent string
    user_agent = opt['user_agent'] ||
                 "Rubilicious/#{Rubilicious::VERSION} Ruby/#{RUBY_VERSION}"

    # build default HTTP headers
    @headers = {
      'Authorization'   => 'Basic ' << ["#{user}:#{pass}"].pack('m').strip,
      'User-Agent'      => user_agent,
    }
  end

  #
  # Returns a list of dates with the number of posts at each date.  If a
  # tag is given, return a list of dates with the number of posts with
  # the specified tag at each date.
  #
  # Raises an exception on error.
  #
  # Examples:
  #   dates = r.dates
  #   puts "date,count"
  #   dates.keys.sort.each do |date| 
  #     puts "#{date},#{dates[date]}"
  #   end
  #
  #   # same as above, but only display 'politics' tags
  #   dates = r.dates('politics')
  #   puts "date,count",
  #        dates.map { |args| args.join(',') }.join("\n")
  #
  def dates(tag = nil)
    get('posts/dates?' << (tag ? "tag=#{tag}" : ''), 'date').inject({}) do  |ret, e|
      ret[e['date']] = e['count'].to_i
      ret
    end
  end

  #
  # Returns a hash of tags and the number of times they've been used.
  #
  # Raises an exception on error.
  #
  # Example:
  #   tags = r.tags
  #   puts tags.keys.sort.map { |tag| "#{tag},#{tags[tag]}" }.join("\n")
  #
  def tags
    get('tags/get?', 'tag').inject({}) do |ret, e|
      ret[e['tag']] = e['count'].to_i
      ret
    end
  end

  #
  # Returns an array of posts on a given date, filtered by tag. If no 
  # date is supplied, most recent date will be used.
  #
  # Raises an exception on error.
  #
  # Examples:
  #   # print out a list of recent links from oldest to newest.
  #   posts = r.posts
  #   posts.sort { |a, b| a['time'] <=> b['time'] }.each do |post|
  #     puts post['href']
  #   end
  # 
  #   # print out a list of link descriptions from the date '2004-09-22'
  #   posts = r.posts('2004-09-22')
  #   posts.sort { |a, b| a['description'] <=> b['description'] }
  #   posts.each { |post| puts post['description'] }
  #
  def posts(date = nil, tag = nil)
    args = [(date ? "dt=#{date}" : nil), (tag ? "tag=#{u(tag)}" : nil)]
    get('posts/get?' << args.compact.join('&amp;'), 'post').map do |e|
      e['tags'] = e['tag'].split(' ')
      e.delete 'tag'
      e['time'] = Time.iso8601(e['time'])
      e
    end
  end

  #
  # Returns an array of the most recent posts, optionally filtered by tag.
  #
  # Raises an exception on error.
  #
  # Example:
  #   # get the most recent links
  #   recent_links = r.recent.map { |post| post['href'] }
  #
  #   # get the 10 most recent 'music' links
  #   recent_links = r.recent('music', 10).map { |post| post['href'] }
  #
  def recent(tag = nil, count = nil)
    args = [(count ? "count=#{count}" : nil), (tag ? "tag=#{u(tag)}" : nil)]
    get('posts/recent?' << args.compact.join('&amp;'), 'post').map do |e|
      e['tags'] = e['tag'].split(' ')
      e.delete 'tag'
      e['time'] = Time.iso8601(e['time'])
      e
    end
  end

  #
  # Return the last update time for this user.
  #
  # Note: this method _must_ be called before you call Rubilicious#all.
  #
  # Raises an exception on error.
  # 
  # Example:
  #   # get the last update time for this user
  #   update_time = r.update
  #   
  def update
    e = get('posts/update')
    Time.iso8601(e['time'])
  end

  #
  # Post a link to delicious, along with an optional extended
  # description, tags (as a space-delimited list), and a timestamp.
  #
  # Raises an exception on error.
  #
  # Example:
  #   # add a link to pablotron to delicious
  #   r.add('http://pablotron.org/', 
  #         'Pablotron.org : The most popular site on Internet?')
  #
  #   # add a link to paulduncan.org to delicious with an extended 
  #   # description
  #   r.add('http://paulduncan.org/', "Paul Duncan", "Damn he's smooth!")
  #
  #   # add a link with an extended description and some tags
  #   r.add('http://raggle.org/', 
  #         'Raggle', 'Console RSS Aggregator, written in Ruby.',
  #         'rss programming ruby console xml')
  #
  def add(url, desc, ext = '', tags = '', time = Time.now, 
          replace = false, is_private = false)
    raise Error, "Missing URL" unless url
    raise Error, "Missing Description" unless desc
    args = [
      ("url=#{u(url)}"), ("description=#{u(desc)}"),
      ("dt=#{time.gmtime.iso8601}"),
      (ext ? "extended=#{u(ext)}" : nil),
      (tags ? "tags=#{u(tags)}" : nil), 
      (replace ? 'replace=yes' : nil),
      (is_private ? 'shared=no' : nil),
    ]
    get('posts/add?' << args.compact.join('&amp;'))
    nil
  end

  #
  # Delete a link from Delicious.
  #
  # Raises an exception on error.
  #
  # Example:
  #   # delete a link to example.com from delicious
  #   r.delete('http://example.com/')
  #
  def delete(url)
    raise Error, "Missing URL" unless url
    get('posts/delete?uri=' << u(url))
    nil
  end

  #
  # Renames tags across all posts.
  #
  # Note: Delicious has currently disabled this feature, so it will not
  # work until they reenable it.
  #
  # Raises an exception on error.
  #
  # Example:
  #   # rename tag "rss" to "xml"
  #   r.rename('rss', 'xml')
  #
  def rename(old_tag, new_tag)
    args = ["old=#{u(old_tag)}", "new=#{u(new_tag)}"]
    get('tags/rename?' << args.join('&amp;'))
    nil
  end

  #
  # Return the last update time.
  #
  # Note: this method should be used before calling methods like .posts
  # or .all to conserve on bandwidth.
  # 
  # Example:
  #  t = r.update  #=> "Fri Mar 11 02:45:51 EST 2005"
  #
  def update
    Time.xmlschema(get('posts/update', 'update')[0]['time'])
  end

  #
  # Return an array of all your posts ever, optionally filtered by tag.
  #
  # Note: you should check the last update time with Rubilicious#update
  # to see when the last post was made (ie, if calling this is even
  # necessary).
  #
  # WARNING: This method can generate a large request to Delicious,
  # and should be used sparingly, and at your own risk.
  #
  # Raises an exception on error.
  #
  # Example:
  #   # save all 'art' posts to file "art_posts.txt"
  #   art_posts = r.all('art')
  #   File.open('art_posts.txt', 'w') do |file|
  #     file.puts art_posts.sort do |a, b| 
  #       a['time'] <=> b['time'] 
  #     end.map { |post| post['href'] }
  #   end
  #
  def all(tag = nil)
    args = [(tag ? "tag=#{u(tag)}" : nil)]
    get('posts/all?' << args.compact.join('&amp;'), 'post').map do |e|
      e.merge({
        'time' => Time.iso8601(e['time']),
        'tag'  => e['tag'].split(/\s+/),
      })
    end
  end

  #
  # Return an array of tag bundles.
  #
  # Raises an exception on error.
  #
  # Example:
  #   # get a list of tag bundles
  #   bundles = r.bundles
  #
  def bundles
    get('tags/bundles/all', 'bundle')
    get('tags/bundles/all', 'bundle').inject({}) do |ret, e|
      ret[e['name']] = e['tags'].split(/\s/)
      ret
    end
  end

  #
  # Set (create or replace) a tag bundle.
  #
  # Raises an exception on error.
  #
  # Example:
  #   # set the tags for the tag bundle 'testbundle' to 'ruby programming'.
  #   r.set_bundle('testbundle', 'ruby programming)
  #
  def set_bundle(bundle, tags)
    args = ["bundle=#{u(bundle)}", "tags=#{u(tags)}"]
    get('tags/bundles/set?' << args.join('&amp;'))
    nil
  end

  #
  # Delete a tag bundle.
  #
  # Raises an exception on error.
  #
  # Example:
  #   # delete the tag bundle 'testbundle'
  #   r.delete_bundle('testbundle')
  #
  def delete_bundle(bundle)
    args = ["bundle=#{u(bundle)}"]
    get('tags/bundles/delete?' << args.join('&amp;'))
    nil
  end

  #
  # Return an XBEL string of all your posts, optionally filtered by tag.
  #
  # Note: This is _not_ the same as calling Rubilicious.xbel.  Please
  # see the documentation for Rubilicious.xbel for more information.
  #
  # WARNING: This method can generate a large number of requests to 
  # Delicious, and could be construed as abuse.  Use sparingly, and at
  # your own risk.
  #
  # Raises an exception on error.
  #
  # Example:
  #   # save all posts ever in XBEL format to file "delicious.xbel"
  #   File.open('delicious.xbel', 'w') do |file|
  #     file.puts r.to_xbel
  #   end
  #
  def to_xbel(tag = nil)
    now = Time.now.gmtime.iso8601

    ret = [ "<?xml version='1.0' encoding='utf-8'?>",
            "<xbel version='1.0' added='#{now}'>",
            "  <title>#@user's Delicious Bookmarks</title>" ]
  
    tags = all(tag).inject({}) do |tags, bm|
      if bm['tags'] && bm['tags'].size > 0
        bm['tags'].sort!
        # TODO: alias support
        bm['tags'].each { |tag| tags[tag] ||= []; tags[tag] << bm }
      else 
        tags['unsorted'] ||= []
        tags['unsorted'] << bm
      end

      tags
    end
    
    tags.keys.sort.each do |tag|
      ary = tags[tag]
      ret <<  [ 
        "  <folder id='#{tag}' added='#{now}'>",
        # "  <folder id='#{tag}'>",
        "    <title>#{tag.capitalize}</title>",

        ary.sort { |a, b| a['description'] <=> b['description'] }.map do |bm|
          href, bm_id = u(bm['href']), "#{tag}-#{bm['hash']}", 
          time = bm['time'].iso8601
          title = h(bm['description'] || '')
          desc = h(bm['extended'] || '')

          [ "    <bookmark href='#{href}' id='#{bm_id}' added='#{time}'>",
          # [ "    <bookmark href='#{href}' id='#{bm_id}'>",
            "      <title>#{title}</title>",
            "      <desc>#{desc}</desc>",
            "    </bookmark>" ,
          ].join("\n")
        end.join("\n"),

        '  </folder>',
      ].join("\n")
    end

    ret << '</xbel>'
    ret.join("\n")
  end

  # convenience aliases
  alias :rename_tag :rename
  alias :all_posts :all
  alias :all_bundles :bundles
end

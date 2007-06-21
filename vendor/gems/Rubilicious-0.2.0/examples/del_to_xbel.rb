#!/usr/bin/env ruby

# load bindings
require 'rubilicious'

class XBELDump
  def initialize(*args)
    @user, @pass, @io = *args

    @is_file = @io && @io != '-'
    @io = @is_file ? File.open(out_io) : $stdout
  end

  def run
    r = Rubilicious.new(@user, @pass)
    @io.write(Rubilicious.xbel(r.recent))
    @io.close if @is_file
  end

  def self.run(*args)
    # check args
    unless args.size > 1
      $stderr.puts "Usage: $0 [user] [pass] <output_file>"
      exit -1
    end

    # create new instance and run
    new(*args).run
  end
end
      
XBELDump.run(*ARGV) if __FILE__ == $0

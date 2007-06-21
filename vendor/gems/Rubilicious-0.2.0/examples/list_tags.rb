#!/usr/bin/env ruby

require 'rubilicious'

# check command-line args
unless ARGV.size == 2
  $stderr.puts "Usage: $0 [user] [pass]"
  exit -1
end

# get command-line args
user, pass = ARGV

# connect to delicious
r = Rubilicious.new(user, pass)

# get a list of tags
tags = r.tags

# print out sorted list of tags
puts 'tag,count', tags.keys.sort.map { |key| "#{key},#{tags[key]}" }.join("\n")

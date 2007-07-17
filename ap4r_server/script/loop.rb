load_path = "-Ilib/"

loop{
  puts; puts '=== queue manager starting ==='
  system "ruby #{load_path} script/queues.rb #{ARGV.join(' ')}"
  puts; puts '=== queue manager stopped ==='
}


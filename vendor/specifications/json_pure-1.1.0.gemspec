Gem::Specification.new do |s|
  s.name = %q{json_pure}
  s.version = "1.1.0"
  s.date = %q{2007-06-03}
  s.summary = %q{A JSON implementation in Ruby}
  s.email = %q{flori@ping.de}
  s.homepage = %q{http://json.rubyforge.org}
  s.rubyforge_project = %q{json}
  s.description = %q{}
  s.default_executable = %q{edit_json.rb}
  s.has_rdoc = true
  s.authors = ["Florian Frank"]
  s.files = ["bin", "VERSION", "TODO", "tests", "RUBY", "GPL", "install.rb", "ext", "diagrams", "benchmarks", "Rakefile", "data", "lib", "README", "tools", "CHANGES", "bin/edit_json.rb", "bin/prettify_json.rb", "tests/test_json_fixtures.rb", "tests/runner.rb", "tests/test_json.rb", "tests/fixtures", "tests/test_json_unicode.rb", "tests/test_json_generate.rb", "tests/test_json_addition.rb", "tests/fixtures/fail27.json", "tests/fixtures/pass26.json", "tests/fixtures/fail22.json", "tests/fixtures/pass17.json", "tests/fixtures/fail28.json", "tests/fixtures/fail25.json", "tests/fixtures/fail9.json", "tests/fixtures/fail20.json", "tests/fixtures/fail24.json", "tests/fixtures/fail14.json", "tests/fixtures/fail4.json", "tests/fixtures/fail7.json", "tests/fixtures/fail10.json", "tests/fixtures/pass15.json", "tests/fixtures/fail18.json", "tests/fixtures/fail13.json", "tests/fixtures/fail6.json", "tests/fixtures/fail21.json", "tests/fixtures/fail23.json", "tests/fixtures/fail3.json", "tests/fixtures/fail1.json", "tests/fixtures/fail11.json", "tests/fixtures/fail5.json", "tests/fixtures/pass1.json", "tests/fixtures/fail12.json", "tests/fixtures/pass3.json", "tests/fixtures/fail8.json", "tests/fixtures/fail19.json", "tests/fixtures/pass16.json", "tests/fixtures/pass2.json", "tests/fixtures/fail2.json", "ext/json", "ext/json/ext", "ext/json/ext/generator", "ext/json/ext/parser", "ext/json/ext/generator/unicode.c", "ext/json/ext/generator/unicode.h", "ext/json/ext/generator/extconf.rb", "ext/json/ext/generator/generator.c", "ext/json/ext/parser/parser.c", "ext/json/ext/parser/unicode.c", "ext/json/ext/parser/parser.rl", "ext/json/ext/parser/unicode.h", "ext/json/ext/parser/extconf.rb", "benchmarks/benchmark_generator.rb", "benchmarks/benchmark.txt", "benchmarks/benchmark_parser.rb", "benchmarks/benchmark_rails.rb", "data/example.json", "data/prototype.js", "data/index.html", "lib/json", "lib/json.rb", "lib/json/FalseClass.xpm", "lib/json/TrueClass.xpm", "lib/json/ext.rb", "lib/json/common.rb", "lib/json/Hash.xpm", "lib/json/pure", "lib/json/Key.xpm", "lib/json/Numeric.xpm", "lib/json/Array.xpm", "lib/json/editor.rb", "lib/json/String.xpm", "lib/json/pure.rb", "lib/json/NilClass.xpm", "lib/json/version.rb", "lib/json/json.xpm", "lib/json/pure/parser.rb", "lib/json/pure/generator.rb", "tools/server.rb", "tools/fuzz.rb"]
  s.test_files = ["tests/runner.rb"]
  s.rdoc_options = ["--title", "JSON -- A JSON implemention", "--main", "JSON", "--line-numbers"]
  s.executables = ["edit_json.rb"]
end

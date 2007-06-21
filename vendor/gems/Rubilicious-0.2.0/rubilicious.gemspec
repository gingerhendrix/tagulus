require 'rubygems'

spec = Gem::Specification.new do |s|

  #### Basic information.

  s.name = 'Rubilicious'
  s.version = '0.2.0'
  s.summary = <<-EOF
    Delicious (http://del.icio.us/) bindings for Ruby.
  EOF
  s.description = <<-EOF
    Delicious (http://del.icio.us/) bindings for Ruby.
  EOF

  s.requirements << 'Ruby, version 1.8.0 (or newer)'

  #### Which files are to be included in this gem?  Everything!  (Except CVS directories.)

  s.files = Dir.glob("**/*").delete_if { |item| item.include?("CVS") }

  #### C code extensions.

  s.require_path = '.' # is this correct?
  # s.extensions << "extconf.rb"

  #### Load-time details: library and application (you will need one or both).
  s.autorequire = 'rubilicious'
  s.has_rdoc = true
  s.rdoc_options = ['--webcvs',
  'http://cvs.pablotron.org/cgi-bin/viewcvs.cgi/rubilicious/', '--title',
  'Rubilicious API Documentation', 'rubilicious.rb', 'README', 'ChangeLog',
  'COPYING', 'examples/add_link.rb', 'examples/del_to_xbel.rb', 
  'examples/list_tags.rb']

  #### Author and project details.

  s.author = 'Paul Duncan'
  s.email = 'pabs@pablotron.org'
  s.homepage = 'http://pablotron.org/software/rubilicious/'
  s.rubyforge_project = 'rubilicious'



  # Add this shit to teh bottom of gem files for signing:
  # TODO: move ~/.rubygems to ~/.gem/sign or something

  s.cert_chain = %w{ca rubygems}.map { |f|
    File.expand_path("~/.rubygems/#{f}.crt")
  }
  s.signing_key = File.expand_path('~/.rubygems/rubygems.key')
end

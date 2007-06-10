# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
 def automatic_stylesheets 
    candidates = []    
    controller.class.controller_path.split("/").each do |candidate|
          candidates << (candidates.last ? File.join(candidates.last, candidate) : candidate) 
    end
    candidates.insert(0, controller.active_layout) if controller.active_layout
    candidates << File.join(candidates.last, controller.action_name)
    puts "Candidates : #{candidates.join ' : '}"
    stylesheets_dir = (defined?(RAILS_ROOT) ? "#{RAILS_ROOT}/public" : "public") + "/stylesheets"
    out = ""
    candidates.each do |source|
        out = out + "\n" + stylesheet_link_tag(source) if File.exists?(File.join(stylesheets_dir, source + '.css'))
    end
    "<!-- Automatic Stylesheets -->\n" + out + "\n<!-- -->\n"
   end
end

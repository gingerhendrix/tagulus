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
   
   def render_javascript(file)
     "<script>" + (render :file => file) + "</script>"
   end
   
     
  def link_to_cloud_json(cloud)
     jsonUrl = url_for :controller => 'cloud', :action => 'json', :id => cloud.id, :callback => "cloudLoaded"
     script = "<script>var cloud; function cloudLoaded(c){ cloud = c; };</script><script src=\"#{jsonUrl}\"></script>"
     return script
  end
  
  def link_to_items_json(cloud)
     jsonUrl = url_for :controller => 'cloud', :action => 'items_json', :id => cloud.id, :callback => "cloudLoaded"
     script = "<script>var cloud_items; function cloudLoaded(c){ cloud_items = c; };</script><script src=\"#{jsonUrl}\"></script>"
     return script
  end
end

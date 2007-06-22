module CloudHelper
  def link_to_cloud_json(cloud)
     jsonUrl = url_for :action => 'json', :id => cloud.id
     script = "<script src=\"#{jsonUrl}\"></script>"
     return script
  end
end

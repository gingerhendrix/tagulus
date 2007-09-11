module CloudHelper
  def link_to_cloud_json(cloud)
     jsonUrl = url_for :action => 'json', :id => cloud.id, :callback => "cloudLoaded"
     script = "<script>var cloud; function cloudLoaded(c){ cloud = c; };</script><script src=\"#{jsonUrl}\"></script>"
     return script
  end
end

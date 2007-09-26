ActionController::Routing::Routes.draw do |map|
  # The priority is based upon order of creation: first created -> highest priority.
  
  # Sample of regular route:
  # map.connect 'products/:id', :controller => 'catalog', :action => 'view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  # map.purchase 'products/:id/purchase', :controller => 'catalog', :action => 'purchase'
  # This route can be invoked with purchase_url(:id => product.id)

  # You can have the root of your site routed by hooking up '' 
  # -- just remember to delete public/index.html.
  # map.connect '', :controller => "welcome"


  
  #We don't need the cloud_id in the url (since we look it up from Chart)
  #but it's nice to have it in anyway
  map.connect "cloud/:cloud_id/chart/create/:chart_type", :controller => "chart", :action => "create"
  map.connect "cloud/:cloud_id/chart/:id", :controller => "chart", :action => "show"
  #But we'll also leave in the cloud_id free versions at lower priority
  map.connect "cloud/chart/create/:chart_type", :controller => "chart", :action => "create"
  map.connect "cloud/chart/:id", :controller => "chart", :action => "show"
  
  map.connect "cloud/new/:cloud_type", :controller => "cloud", :action => "new"
  map.connect "cloud/create", :controller => "cloud", :action => "create"
  map.connect "cloud/:id", :controller => "cloud", :action => "show"
  map.connect "cloud/:id/:action", :controller => "cloud"


  # Allow downloading Web Service WSDL as a file with an extension
  # instead of a file named 'wsdl'
  map.connect ':controller/service.wsdl', :action => 'wsdl'

  # Install the default route as the lowest priority.
  map.connect ':controller/:action/:id.:format'
  map.connect ':controller/:action/:id'
  
  
  
  map.connect '', :controller => "cloud", :action => "index"
end

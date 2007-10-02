
class DataController < ApplicationController
  layout "cloud"
  
  def show_tags
     @cloud = Cloud.find(params[:cloud_id])
    
  end
end
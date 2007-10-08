class LensController < ApplicationController
  layout "cloud"
  
  def director
    @cloud = Cloud.find params[:cloud_id]
  end
end
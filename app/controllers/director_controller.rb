class DirectorController < ApplicationController
  layout "director"
  
  def show
    @cloud = Cloud.find params[:cloud_id]
  end
  
  def new
    
  end
  
  def create
    #Copied from CloudController (should refactor to be DRY)
    
    factory = CloudFactory.instance
    @cloud = factory.newCloud params[:cloud_type], params[:cloud]
    if @cloud.save
      flash[:notice] = 'Director Ready To Go'
      redirect_to :action => 'show', :cloud_id => @cloud
    else
      render :action => 'new'
    end
  end
end
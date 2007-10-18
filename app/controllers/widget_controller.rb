class WidgetController < ApplicationController
  layout "cloud"
  helper CloudHelper
  
  def show
    @chart = Chart.find params[:id]
    @cloud = @chart.cloud
    render :action => "show_"+@chart.chart_type.sub("_chart", "")
  end
  
  def new
    
  end
  
  def create
    @cloud = Cloud.find params[:cloud_id]
    @chart = Chart.new_with_type params[:chart_type]
    @chart.cloud = @cloud
    @chart.save
    redirect_to :action => :show, :cloud_id => @cloud.id, :id => @chart.id
  end
  
end
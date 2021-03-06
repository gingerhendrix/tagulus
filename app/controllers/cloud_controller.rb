require 'json'

class CloudController < ApplicationController
  def index
    @random = Cloud.find :first, :order => "RAND()"
    @recent = Cloud.find :all, :order => "id DESC", :limit => 5
  end

  # GETs should be safe (see http://www.w3.org/2001/tag/doc/whenToUseGet.html)
  verify :method => :post, :only => [ :create ],
         :redirect_to => { :action => :list }

  def list
    @cloud_pages, @clouds = paginate :clouds, :per_page => 10
  end

  def show
    @cloud = Cloud.find(params[:id])
    #@tag_frequencies = @cloud.tag_frequencys.find :all, :order => "frequency DESC"
  end
  
  def items_json
    cloud = Cloud.find(params[:id])
    items = cloud.tagged_items.find :all
    json_items = []
    items.each do |i|
      json_item = {}
      json_item[:id] = i.id
      json_item[:tags] = i.taggings.find(:all).map do |tagging| 
          tagging.tag.tag 
      end
      json_item[:data] = i.data
      json_items.push json_item 
    end 
    json = {:name => cloud.name, :items => json_items}
    #TODO: prepend with "var cloud = " or similar via a JSONP argument
    if(callback = params[:callback])
      render :text =>  callback + "(" + JSON.pretty_generate(json) + ");"
    else
      render :text => JSON.generate(json)
    end
    
  end
  
  def json
    cloud = Cloud.find(params[:id])
    tags = cloud.tags.find :all, :order => "tag_frequencies.frequency DESC", :include => :tag_frequency
    json_frequencies = []
    tags.each do |t|
      json_frequencies.push({:tag => t.tag, :frequency => t.tag_frequency.frequency})
    end 
    json_cloud = {:name => cloud.name, :tag_frequencies => json_frequencies}
    #TODO: prepend with "var cloud = " or similar via a JSONP argument
    if(callback = params[:callback])
      render :text => callback + "(" + JSON.generate(json_cloud) + ")";
    else
      render :text => JSON.generate(json_cloud)
    end
  end
  
  def new
    factory = CloudFactory.instance
    @cloud_type = params[:cloud_type]
    @cloud = factory.newCloud @cloud_type, {}
  end
    
  def create
    factory = CloudFactory.instance
    @cloud = factory.newCloud params[:cloud_type], params[:cloud]
    if @cloud.save
      flash[:notice] = 'Cloud was successfully created.'
      redirect_to :action => 'show', :id => @cloud
    else
      render :action => 'new'
    end
  end

  
end

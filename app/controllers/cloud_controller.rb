require 'json'

class CloudController < ApplicationController
  def index
    @random = Cloud.find :first, :order => "RAND()"
    @recent = Cloud.find :all, :order => "id DESC", :limit => 5
  end

  # GETs should be safe (see http://www.w3.org/2001/tag/doc/whenToUseGet.html)
  verify :method => :post, :only => [ :destroy, :create, :update ],
         :redirect_to => { :action => :list }

  def list
    @cloud_pages, @clouds = paginate :clouds, :per_page => 10
  end

  def show
    @cloud = Cloud.find(params[:id])
    @tag_frequencies = @cloud.tag_frequencys.find :all, :order => "frequency DESC"
    
    if @cloud[:type] == "TextCloud"
      if @cloud.content.length > 400  
        @content = @cloud.content[0..400] + "..."
      else
        @content = @cloud.content    
      end
    end
  end
  
  def json
    cloud = Cloud.find(params[:id])
    tag_frequencies = cloud.tag_frequencys.find :all, :order => "frequency DESC"
    json_frequencies = []
    tag_frequencies.each do |tf|
      json_frequencies.push({:tag => tf.tag, :frequency => tf.frequency})
    end 
    json_cloud = {:name => cloud.name, :tag_frequencies => json_frequencies}
    render :text => "var cloud = " + JSON.generate(json_cloud)
  end
  
  def new
  
  end
  
  def new_delicious_cloud
    
  end
  
  def new_lastfm_artist_cloud
    
  end

  def new_text_cloud
    @cloud = TextCloud.new
  end

  def create_text_cloud
    @cloud = TextCloud.new(params[:cloud])
    if @cloud.save
      flash[:notice] = 'Cloud was successfully created.'
      redirect_to :action => 'show', :id => @cloud
    else
      render :action => 'new'
    end
  end
  
  def create_delicious_cloud
    @cloud = DeliciousCloud.new(params[:cloud])
    if @cloud.save
      flash[:notice] = 'Cloud was successfully created.'
      redirect_to :action => 'show', :id => @cloud
    else
      render :action => 'new'
    end
  end
  
  def create_delicious_url_cloud
    @cloud = DeliciousUrlCloud.new(params[:cloud])
    if @cloud.save
      flash[:notice] = 'Cloud was successfully created.'
      redirect_to :action => 'show', :id => @cloud
    else
      render :action => 'new'
    end
  end
  
  def create_lastfm_artist_cloud
    @cloud = LastfmArtistCloud.new(params[:cloud])
    if @cloud.save
      flash[:notice] = 'Cloud was successfully created.'
      redirect_to :action => 'show', :id => @cloud
    else
      render :action => 'new'
    end
  end
  
  def create_blogger_cloud
    @cloud = BloggerCloud.new(params[:cloud])
    if @cloud.save
      flash[:notice] = 'Cloud was successfully created.'
      redirect_to :action => 'show', :id => @cloud
    else
      render :action => 'new'
    end
  end

  def edit
    @cloud = Cloud.find(params[:id])
  end

  def update
    @cloud = Cloud.find(params[:id])
    if @cloud.update_attributes(params[:cloud])
      flash[:notice] = 'Cloud was successfully updated.'
      redirect_to :action => 'show', :id => @cloud
    else
      render :action => 'edit'
    end
  end

  def destroy
    Cloud.find(params[:id]).destroy
    redirect_to :action => 'list'
  end
end

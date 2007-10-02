
class TagsController < ApplicationController
  layout "cloud"
  
  def show
    @cloud = Cloud.find params[:cloud_id];
    @tag = @cloud.tags.find :first, :conditions => ["tag = :tag", params], :include => [:tag_frequency, :taggings] 
    @similar = @tag.similar_tags
  end
end
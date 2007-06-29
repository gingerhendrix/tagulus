class CopyBloggerData < ActiveRecord::Migration
  def self.up
    BloggerCloud.find(:all).each do |cloud|
      id = cloud.data_id
      data = BloggerCloudData.find id
      cloud.url = data.url
      cloud.save!
    end
  end

  def self.down
  end
  
  class BloggerCloudData < ActiveRecord::Base
    set_table_name "blogger_cloud_data"
  end
end

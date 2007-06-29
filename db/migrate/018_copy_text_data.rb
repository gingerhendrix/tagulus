class CopyTextData < ActiveRecord::Migration
  def self.up
    TextCloud.find(:all).each do |cloud|
      id = cloud.data_id
      data = TextCloudData.find id
      cloud.content = data.content
      cloud.save!
    end
  end

  def self.down
  end
  
  class TextCloudData < ActiveRecord::Base
    set_table_name "text_cloud_data"
  end
end

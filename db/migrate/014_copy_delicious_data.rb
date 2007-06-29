class CopyDeliciousData < ActiveRecord::Migration
  def self.up
    DeliciousCloud.find(:all).each do |cloud|
      id = cloud.data_id
      data = DeliciousCloudData.find id
      cloud.username = data.username
      cloud.save!
    end
  end

  def self.down
  end
  
  class DeliciousCloudData < ActiveRecord::Base
    set_table_name "delicious_cloud_data"
  end
end

class CopyDeliciousUrlData < ActiveRecord::Migration
  def self.up
    DeliciousUrlCloud.find(:all).each do |cloud|
      id = cloud.data_id
      data = DeliciousUrlCloudData.find id
      cloud.url = data.url
      cloud.save!
    end
  end

  def self.down
  end
  
  class DeliciousUrlCloudData < ActiveRecord::Base
    set_table_name "delicious_url_cloud_data"
  end
end

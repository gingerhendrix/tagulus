class RemoveDeliciousUrlCloudData < ActiveRecord::Migration
  def self.up
    drop_table :delicious_url_cloud_data
  end

  def self.down
  end
end

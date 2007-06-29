class RemoveDeliciousCloudData < ActiveRecord::Migration
  def self.up
    drop_table :delicious_cloud_data
  end

  def self.down
  end
end

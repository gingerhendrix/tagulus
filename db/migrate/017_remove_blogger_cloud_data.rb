class RemoveBloggerCloudData < ActiveRecord::Migration
  def self.up
    drop_table :blogger_cloud_data
  end

  def self.down
  end
end

class RemoveTextCloudData < ActiveRecord::Migration
  def self.up
    drop_table :text_cloud_data
  end

  def self.down
  end
end

class RemoveDataIdFromClouds < ActiveRecord::Migration
  def self.up
    remove_column :clouds, :data_id
  end

  def self.down
    add_column :clouds, :data_id, :integer
  end
end

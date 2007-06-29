class AddYmlDataToClouds < ActiveRecord::Migration
  def self.up
    add_column :clouds, :data, :text
  end

  def self.down
    remove_column :clouds, :data
  end
end

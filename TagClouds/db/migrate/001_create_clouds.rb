class CreateClouds < ActiveRecord::Migration
  def self.up
    create_table :clouds do |t|
      t.column :name, :string
      t.column :content, :string
    end
  end

  def self.down
    drop_table :clouds
  end
end

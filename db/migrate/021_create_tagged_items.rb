class CreateTaggedItems < ActiveRecord::Migration
  def self.up
    create_table :tagged_items do |t|
      t.column :cloud_id, :integer
      t.column :data, :text
    end
  end

  def self.down
    drop_table :tagged_items
  end
end

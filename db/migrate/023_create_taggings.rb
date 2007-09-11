class CreateTaggings < ActiveRecord::Migration
  def self.up
    create_table :taggings do |t|
      t.column :tag_id, :integer
      t.column :tagged_item_id, :integer
      t.column :data, :text
    end
  end

  def self.down
    drop_table :taggings
  end
end

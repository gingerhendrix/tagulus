
class ConnectTagFrequencyToTag < ActiveRecord::Migration
  def self.up
    remove_column :tag_frequencies, :cloud_id
    remove_column :tag_frequencies, :tag
    add_column :tag_frequencies, :tag_id, :integer
    add_column :tags, :cloud_id, :integer
  end
  
  def self.down
    add_column :tag_frequencies, :cloud_id, :integer
    add_column :tag_frequencies, :tag, :string
    remove_column :tag_frequencies, :tag_id
    remove_column :tags, :cloud_id
  end
end
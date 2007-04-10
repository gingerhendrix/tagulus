class CreateTagFrequencies < ActiveRecord::Migration
  def self.up
    create_table :tag_frequencies do |t|
      t.column :cloud_id, :integer
      t.column :tag, :string
      t.column :frequency, :integer
    end
  end

  def self.down
    drop_table :tag_frequencies
  end
end

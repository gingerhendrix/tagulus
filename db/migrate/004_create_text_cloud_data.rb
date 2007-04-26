class CreateTextCloudData < ActiveRecord::Migration
  def self.up
    create_table :text_cloud_data do |t|
      t.column :content, :text
    end
    add_column :clouds, :data_id, :integer
    TextCloud.find(:all).each do |c|
      c.data = TextCloudData.new
      c.data.content = c.content
      c.data.save!
      c.save!
    end
    remove_column :clouds, :content
  end

  def self.down
    add_column :clouds, :content, :text
    TextCloud.find(:all).each do |c|
      c.content = c.data.content;
      c.save!
    end
    remove_column :clouds, :data_id
    drop_table :text_cloud_data
  end
end

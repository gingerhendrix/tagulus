class CreateBloggerCloudData < ActiveRecord::Migration
  def self.up
    create_table :blogger_cloud_data do |t|
      t.column :url, :string
    end
  end

  def self.down
    drop_table :blogger_cloud_data
  end
end

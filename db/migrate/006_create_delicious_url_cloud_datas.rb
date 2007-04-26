class CreateDeliciousUrlCloudDatas < ActiveRecord::Migration
  def self.up
    create_table :delicious_url_cloud_data do |t|
      t.column :url, :string
    end
  end

  def self.down
    drop_table :delicious_url_cloud_data
  end
end

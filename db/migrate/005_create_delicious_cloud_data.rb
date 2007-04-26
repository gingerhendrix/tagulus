class CreateDeliciousCloudData < ActiveRecord::Migration
  def self.up
    create_table :delicious_cloud_data do |t|
      t.column :username, :string
    end
  end

  def self.down
    drop_table :delicious_cloud_data
  end
end

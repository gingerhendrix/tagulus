class CreateCharts < ActiveRecord::Migration
  def self.up
    create_table :charts do |t|
      t.column :cloud_id, :integer
      t.column :type, :string
      t.column :data, :text
    end
  end

  def self.down
    drop_table :charts
  end
end

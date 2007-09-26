class RenameChartType < ActiveRecord::Migration
  def self.up
    remove_column :charts, :type
    add_column :charts, :chart_type, :string
  end

  def self.down
    remove_column :charts, :chart_type
    add_column :charts, :type, :string
  end
end

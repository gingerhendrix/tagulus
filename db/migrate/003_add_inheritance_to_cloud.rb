class AddInheritanceToCloud < ActiveRecord::Migration
  def self.up
    add_column :clouds, :type, :string
    Cloud.find(:all).each do |c|
      c[:type] = "TextCloud"
      c.save!
    end
  end

  def self.down
    remove_column :clouds, :type
  end
end

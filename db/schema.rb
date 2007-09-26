# This file is autogenerated. Instead of editing this file, please use the
# migrations feature of ActiveRecord to incrementally modify your database, and
# then regenerate this schema definition.

ActiveRecord::Schema.define(:version => 25) do

  create_table "charts", :force => true do |t|
    t.column "cloud_id",   :integer
    t.column "data",       :text
    t.column "chart_type", :string
  end

  create_table "clouds", :force => true do |t|
    t.column "name",   :string
    t.column "type",   :string
    t.column "data",   :text
    t.column "status", :integer, :default => 0
  end

  create_table "tag_frequencies", :force => true do |t|
    t.column "cloud_id",  :integer
    t.column "tag",       :string
    t.column "frequency", :integer
  end

  create_table "tagged_items", :force => true do |t|
    t.column "cloud_id", :integer
    t.column "data",     :text
  end

  create_table "taggings", :force => true do |t|
    t.column "tag_id",         :integer
    t.column "tagged_item_id", :integer
    t.column "data",           :text
  end

  create_table "tags", :force => true do |t|
    t.column "tag", :string
  end

end

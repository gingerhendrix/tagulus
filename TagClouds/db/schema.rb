# This file is autogenerated. Instead of editing this file, please use the
# migrations feature of ActiveRecord to incrementally modify your database, and
# then regenerate this schema definition.

ActiveRecord::Schema.define(:version => 2) do

  create_table "clouds", :force => true do |t|
    t.column "name",    :string
    t.column "content", :string
  end

  create_table "tag_frequencies", :force => true do |t|
    t.column "cloud_id",  :integer
    t.column "tag",       :string
    t.column "frequency", :integer
  end

end

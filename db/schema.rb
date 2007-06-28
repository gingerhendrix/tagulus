# This file is autogenerated. Instead of editing this file, please use the
# migrations feature of ActiveRecord to incrementally modify your database, and
# then regenerate this schema definition.

ActiveRecord::Schema.define(:version => 8) do

  create_table "blogger_cloud_data", :force => true do |t|
    t.column "url", :string
  end

  create_table "clouds", :force => true do |t|
    t.column "name",    :string
    t.column "type",    :string
    t.column "data_id", :integer
  end

  create_table "delicious_cloud_data", :force => true do |t|
    t.column "username", :string
  end

  create_table "delicious_url_cloud_data", :force => true do |t|
    t.column "url", :string
  end

  create_table "lastfm_artist_cloud_data", :force => true do |t|
    t.column "username", :string
  end

  create_table "tag_frequencies", :force => true do |t|
    t.column "cloud_id",  :integer
    t.column "tag",       :string
    t.column "frequency", :integer
  end

  create_table "text_cloud_data", :force => true do |t|
    t.column "content", :text
  end

end

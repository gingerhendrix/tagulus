class TextCloudData < ActiveRecord::Base
  set_table_name "text_cloud_data"
  has_one :text_cloud, :dependent => true
  
end

class BloggerCloudData < ActiveRecord::Base
  set_table_name "blogger_cloud_data"
  has_one :blogger_cloud, :dependent => true
end

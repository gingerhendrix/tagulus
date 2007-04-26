class DeliciousCloudData < ActiveRecord::Base
  set_table_name "delicious_cloud_data"
  has_one :delicious_cloud, :dependent => true
end

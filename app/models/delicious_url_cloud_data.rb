class DeliciousUrlCloudData < ActiveRecord::Base
  set_table_name "delicious_url_cloud_data"
  has_one :delicious_url_cloud, :dependent => true
end

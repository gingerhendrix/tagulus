class LastfmArtistCloudData < ActiveRecord::Base
  set_table_name "lastfm_artist_cloud_data"
  has_one :lastfm_artist_cloud, :dependent => true
end

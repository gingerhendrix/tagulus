class CopyLastfmArtistData < ActiveRecord::Migration
  def self.up
    LastfmArtistCloud.find(:all).each do |cloud|
      id = cloud.data_id
      data = LastfmArtistCloudData.find id
      cloud.username = data.username
      cloud.save!
    end
  end

  def self.down
  end
  
  class LastfmArtistCloudData < ActiveRecord::Base
    set_table_name "lastfm_artist_cloud_data"
  end
end

class RemoveLastfmArtistCloudData < ActiveRecord::Migration
  def self.up
    drop_table :lastfm_artist_cloud_data
  end

  def self.down
  end
end

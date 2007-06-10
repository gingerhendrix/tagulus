class CreateLastfmArtistCloudData < ActiveRecord::Migration
  def self.up
    create_table :lastfm_artist_cloud_data do |t|
      t.column :username, :string
    end
  end

  def self.down
    drop_table :lastfm_artist_cloud_data
  end
end

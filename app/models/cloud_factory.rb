class CloudFactory
  private_class_method :new
  @@instance = nil
 
  def self.instance
    @@instance = new unless @@instance
    @@instance
  end
  
  def initialize#
    #ugly initializer - move this responsibility elsewhere 
    @clouds = {:lastfm_artist_cloud => LastfmArtistCloud,
               :blogger_cloud => BloggerCloud,
               :delicious_user_cloud => DeliciousUserCloud,
               :delicious_url_cloud => DeliciousUrlCloud,
               :technorati_cloud => TechnoratiCloud}
  end
  
  def newCloud type, params 
    cloud = @clouds[type.intern]
    raise "Cloud not found - #{type}" if cloud.nil?
      
    cloud.new params
  end
end
require 'rexml/document'

class LastfmArtistCloud < Cloud
  belongs_to :data, :class_name => "LastfmArtistCloudData", :foreign_key => "data_id"
  after_save :update_frequencies
  before_save :save_data
  
  def initialize(p={})
    self.data = LastfmArtistCloudData.new
    super p
  end
  
  def update_frequencies
    uri = URI.parse("http://ws.audioscrobbler.com/1.0/user/#{self.username}/topartists.xml");
    response = Net::HTTP.get_response(uri);
    xml = REXML::Document.new(response.body);
    tags = {}
    xml.elements.each("//artist") do |e|
      name = ""
      playCount = 0;
      e.elements.each("name") {|n| name = n.text}
      e.elements.each("playcount"){ |pc| playCount = pc.text}
      puts "#{name} - #{playCount} \n"
      tags[name] = playCount
    end
    tags.keys.each do |t|
      tag = self.tag_frequencys.create :tag=>t, :frequency => tags[t]
      tag.save
    end
  end
  
  def username
    self.data.username
  end
  
  def username=(u)
    self.data.username=u    
  end
  
  def name
    "Last.fm Top Artists for #{username}"
  end
  
  def save_data
    self.data.save!
  end
  
end
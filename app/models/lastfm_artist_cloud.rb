require 'rexml/document'
require 'yaml'

class LastfmArtistCloud < Cloud
  
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
    @data[:username]
  end
  
  def username=(u)
    @data[:username]=u    
  end
  
  def name
    "Last.fm Top Artists for #{username}"
  end
  
    
end
require 'digest/md5'

class DeliciousUrlCloud < Cloud
  belongs_to :data, :class_name => "DeliciousUrlCloudData", :foreign_key => "data_id"
  after_save :update_frequencies
  before_save :save_data
  
  def initialize(p={})
    self.data = DeliciousUrlCloudData.new
    super p
  end
  
  def update_frequencies
    #get json document from http://badges.del.icio.us/feeds/json/url/data?hash=
    #see http://del.icio.us/help/json/url
    hash = Digest::MD5.hexdigest(self.url)
    uri = URI.parse("http://badges.del.icio.us/feeds/json/url/data?hash=#{hash}");
    response = Net::HTTP.get_response(uri);
    json = response.body;
    puts "json #{json}"
    obj = (JSON.parse json)
    puts "obj #{obj}"
    obj = obj[0]
    puts "obj #{obj}"
    tags = obj["top_tags"]
    puts "top_tags #{tags}"
    tags.keys.each do |t|
      tag = self.tag_frequencys.create :tag=>t, :frequency => tags[t]
      tag.save
    end
  end
  
  def url
    self.data.url
  end
  
  def url=(u)
    self.data.url=u    
  end
  
  def name
    "Tags for #{url}"
  end
  
  def save_data
    self.data.save!
  end
  
end
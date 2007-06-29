class BloggerCloud < Cloud

  def update_frequencies
    uri = URI.parse("http://#{url}/feeds/posts/default");
    response = Net::HTTP.get_response(uri);
    xml = REXML::Document.new(response.body);
    tags = {}
    xml.elements.each("//category") do |e|
      name = e.attribute("term").to_s
      if !(tags.key? name)
        tags[name] = 1
      else
        tags[name] += 1
      end
      puts "Processing #{name} - #{tags[name]}" 
    end
    
    tags.keys.each do |t|
      tag = self.tag_frequencys.create :tag=>t, :frequency => tags[t]
      tag.save
    end
  end
  
  def url=(u)
   @data[:url] = u
  end
  
  def url
   @data[:url]
  end 
  
  def name
    "Tags for #{url}"
  end
  
end

class TechnoratiCloud < Cloud
  @@api_key = '097760b7f106c0426826418dfa69dc21';
  
  def update_frequencies
    uri = URI.parse "http://api.technorati.com/blogposttags?key=#{@@api_key}&url=#{self.url}&limit=100"
    puts "Retrieving #{uri.to_s}\n"
    response = Net::HTTP.get_response(uri);
    puts "Response #{response.body}\n"
    xml = REXML::Document.new(response.body);
    tags = {}
    xml.elements.each("//item") do |e|
      name = ""
      weight = 0;
      e.elements.each("tag") {|n| name = n.text}
      e.elements.each("posts"){ |w| weight = w.text}
      puts "#{name} - #{weight} \n"
      tags[name] = weight
    end
    puts "#{tags.keys.length} tags found"
    tags.keys.each do |t|
      tag = self.tag_frequencys.create :tag=>t, :frequency => tags[t]
      tag.save
    end
  end
  
  def url
    @data[:url]
  end
  
  def url=(u)
    @data[:url] =u
  end
end
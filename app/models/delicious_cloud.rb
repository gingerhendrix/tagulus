require 'rubilicious'

#TODO: Rename to DeliciousUserCloud or DeliciousPersonalCloud for less ambiguity
class DeliciousCloud < Cloud
  attr_accessor :password
  
  def update_frequencies
    r = Rubilicious.new(self.username, self.password)
    tags = r.tags
    tags.keys.each do |t|
      tag = self.tag_frequencys.create :tag=>t, :frequency => tags[t]
      tag.save
    end
  end

  def username=(u)
    @data[:username] = u
  end
  
  def username
    @data[:username]
  end 
  
  def name
    "#{self.username}'s bookmarks'"
  end
    
end

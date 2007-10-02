 require 'rubilicious'

class DeliciousUserCloud < Cloud
  attr_accessor :password
  
  def update_frequencies
    r = Rubilicious.new(self.username, self.password , {'base_uri' => "http://localhost/eclipse/DeliciousMock"})
    posts = r.all
    posts.each do |p|
      item = TaggedItem.create :cloud => self, :data => {:href => p['href'],
                                                         :description => p['description'],
                                                         :hash => p['hash'],
                                                         :time => p['time']}
      tags = p['tag']
      tags.each do |t|
        tag = self.tags.find :first, :conditions => "tag = '#{t}'"
        if tag.nil?
          tag = Tag.create :tag => t
          self.tags.push tag
        end
        Tagging.create :tagged_item => item, :tag =>tag
        if tag.tag_frequency.nil?  
          tag.tag_frequency = TagFrequency.new(:tag_id=>tag.id, :frequency => 1)
          tag.tag_frequency.save!
        else
          tag.tag_frequency.frequency += 1;
          tag.tag_frequency.save!
        end
      end
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

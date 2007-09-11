 require 'rubilicious'

class DeliciousUserCloud < Cloud
  attr_accessor :password
  
  def update_frequencies
    r = Rubilicious.new(self.username, self.password, {'base_uri' => "http://localhost/eclipse/DeliciousMock"})
    tag_frequency_array = self.tag_frequencys.find :all
    tag_frequencies = {}
    tag_frequency_array.map do |tf|
      tag_frequencies[tf.tag] = tf  
    end
    posts = r.all
    posts.each do |p|
      item = TaggedItem.create :cloud => self, :data => {:href => p['href'],
                                                         :description => p['description'],
                                                         :hash => p['hash'],
                                                         :time => p['time']}
      tags = p['tag']
      tags.each do |t|
        tag = Tag.find_or_create :tag => t
        Tagging.create :tagged_item => item, :tag =>tag
        #frequency should be property of tag not model object
        tagf = tag_frequencies[t] 
        if tagf.nil?  
          tagf = TagFrequency.new(:tag=>t, :frequency => 0, :cloud => self)
          tag_frequency_array.push(tagf)
          tag_frequencies[t] = tagf
        end
        tagf[:frequency] += 1
      end
    end
    tag_frequency_array.each do |tf|
      tf.save!
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

require 'rubilicious'

class DeliciousCloud < Cloud
  belongs_to :data, :class_name => "DeliciousCloudData", :foreign_key => "data_id"
  after_save :update_frequencies
  before_save :save_data
  
  attr_accessor :password
  
  def initialize(p={})
    self.data = DeliciousCloudData.new
    super p
  end
  
  def update_frequencies
    r = Rubilicious.new(self.username, self.password)
    tags = r.tags
    tags.keys.each do |t|
      tag = self.tag_frequencys.create :tag=>t, :frequency => tags[t]
      tag.save
    end
  end
  
  def save_data
    self.data.save!
  end
  
  def username=(u)
    self.data.username = u
  end
  
  def username
    self.data.username
  end 
  
  def name
    self.data.username + "'s bookmarks"
  end
    
end

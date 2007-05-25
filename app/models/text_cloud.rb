
class TextCloud < Cloud
  belongs_to :data, :class_name => "TextCloudData", :foreign_key => "data_id"
  after_save :update_frequencies
  before_save :save_data
  
  def save_data
    self.data.save
  end
  
  def initialize(p={})
    self.data = TextCloudData.new
    super p
  end
  
  def update_frequencies
      self.data.content.split.each do |word|
      tag = self.tag_frequencys.find :first, :conditions => ["tag= ?, cloud_id=?", word, self.id]
      if !tag
        tag = self.tag_frequencys.create :tag=>word, :frequency => 1
      else
        tag.frequency += 1
        tag.save
      end
    end
  end
  
  def content
    self.data.content
  end

  def content=(c)
    self.data.content=c
  end
  
end
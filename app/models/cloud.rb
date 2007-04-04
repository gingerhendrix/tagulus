class Cloud < ActiveRecord::Base
  has_many :tag_frequencys
  
  after_save :update_frequencies
  
  def update_frequencies
    self.content.split.each do |word|
      tag = self.tag_frequencys.find :first, :conditions => ["tag= ?", word]
      if !tag
        tag = self.tag_frequencys.create :tag=>word, :frequency => 1
      else
        tag.frequency += 1
        tag.save
      end
    end
  end
  
  
end

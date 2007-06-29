
class TextCloud < Cloud
   
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
    @data[:content]
  end

  def content=(c)
    @data[:content] = c
  end
  
end
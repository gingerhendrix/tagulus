class Cloud < ActiveRecord::Base
  has_many :tag_frequencys
  
  def title
    ""    
  end
end

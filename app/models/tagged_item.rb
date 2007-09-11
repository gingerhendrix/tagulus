class TaggedItem < ActiveRecord::Base
  belongs_to :cloud
  has_many :taggings
  before_save :save_data
  
  def after_find
    if  read_attribute("data").nil?
      @data = Hash.new 
    else
      @data = YAML::load(read_attribute("data"))
    end
  end
  
  def save_data
    write_attribute("data", YAML::dump(@data));
  end
  
  def data
    @data
  end
  
  def data=d
    @data = d
  end
  
end

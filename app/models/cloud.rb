class Cloud < ActiveRecord::Base
  has_many :tag_frequencys
  has_many :tagged_items
  has_many :charts
  
  after_create :update_frequencies
  before_save :save_data
  
  def initialize(p={})
    @data = Hash.new
    super p
  end
  
  def tags_per_item
    return ((self.tag_frequencys.count*1.0)/self.tagged_items.count) unless (self.tagged_items.count == 0)
    return 0
  end
  
  def update_fequencies
  end
  
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
  
  def title
    ""    
  end
  
  #@TODO: unused and untested
  def self.new_with_type(type)
    cloud = (type+"_cloud").classify.constantize
    cloud.new
  end
end

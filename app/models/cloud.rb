class Cloud < ActiveRecord::Base
  has_many :tag_frequencys
  has_many :tagged_items
  
  after_create :update_frequencies
  before_save :save_data
  
  def initialize(p={})
    @data = Hash.new
    super p
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
end

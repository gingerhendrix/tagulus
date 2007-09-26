class Chart < ActiveRecord::Base
  belongs_to :cloud
  
  def after_find
    if  read_attribute("data").nil?
      @data = Hash.new 
    else
      @data = YAML::load(read_attribute("data"))
    end
  end
  
  def before_save
    write_attribute("data", YAML::dump(@data));
  end
  
  def self.new_with_type(type)
    #cloud = (type+"_cloud").classify.constantize
    #cloud.new
    self.new :chart_type => type
  end
end

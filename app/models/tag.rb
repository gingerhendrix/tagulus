class Tag < ActiveRecord::Base
  has_many :taggings
  attr_accessible :tag
  
  def self.find_or_create opt
    tag = self.find(:first, :conditions => "tag = '#{opt[:tag]}'") || self.create(opt)
  end
end

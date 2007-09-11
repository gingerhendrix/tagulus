class Tagging < ActiveRecord::Base
  belongs_to :tagged_item
  belongs_to :tag
end

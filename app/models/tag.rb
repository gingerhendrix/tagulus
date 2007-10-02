class Tag < ActiveRecord::Base
  has_many :taggings
  has_one :tag_frequency
  belongs_to :cloud
  
  attr_accessible :tag
  
  def cotags
    Tag.find_by_sql "SELECT DISTINCT t2.* " + 
                          " FROM tags t " + 
                          "  JOIN taggings AS ts1 ON ts1.tag_id=t.id " +
                          "  JOIN tagged_items AS ti ON ti.id = ts1.tagged_item_id " +
                          "  JOIN taggings AS ts2 ON ts2.tagged_item_id = ti.id " + 
                          "  JOIN tags AS t2 ON t2.id = ts2.tag_id " +
                          " WHERE t.id = #{self.id}"
  end
  
  def similar_tags
    Tag.find_by_sql <<-ENDSQL
        SELECT *, 
              (co_occurrence/taggings) AS similarity, 
              (co_occurrence/similar_taggings) AS reverse_similarity
        FROM
          (SELECT cotags.*, 
                  count(*) AS co_occurrence, 
                 (SELECT COUNT(*) FROM tags AS t JOIN taggings AS ts ON ts.tag_id = t.id WHERE t.id = cotags.id) AS similar_taggings,
                 (SELECT COUNT(*) FROM tags AS t JOIN taggings AS ts ON ts.tag_id = t.id WHERE t.id = cotags.root_tag) AS taggings
          FROM 
            (SELECT t2.*, t.id AS root_tag
              FROM tags t
               JOIN taggings AS ts1 ON ts1.tag_id=t.id 
               JOIN tagged_items AS ti ON ti.id = ts1.tagged_item_id 
               JOIN taggings AS ts2 ON ts2.tagged_item_id = ti.id 
               JOIN tags AS t2 ON t2.id = ts2.tag_id 
              WHERE t.id = #{self.id})
            AS cotags
         GROUP BY cotags.tag
         ORDER BY co_occurrence DESC) AS co_occurrences
         WHERE id <> #{self.id}
      ENDSQL
  end
  
  
  def self.find_or_create opt
     self.find(:first, :conditions => ["tag = :tag and cloud_id = :cloud", opt]) || self.create(opt)
  end 
end

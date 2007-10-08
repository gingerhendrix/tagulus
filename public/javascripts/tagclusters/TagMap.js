/**
 * A TagMap
 * @classDescription  A TagMap
 * 
 */
function TagMap(){
  
  //Firefox only (toSource is a non-ecma extension)
	var clone = function(obj){
		return eval(obj.toSource());
	};
	
  //All the items
  var items = [];
  //A map connecting items to their index in items
  var tagMap = {};
  
  //All the tags
  var tags = [];

  //A map connecting item idxs to their tags (needed by intersection)
  //Using an array since we indexes are integers
  var itemMap = [];

  this.allItems = function(){
    return items;
  }
  
  this.tagNames = function(){
    return tags;
  }
  
  this.itemsForTag = function(tag){
    return tagMap[tag].map(function(idx){
       return items[idx];
    });
  } 
  
  this.intersection = function(tag){
    var intersection = new TagMap();
    tagMap[tag].forEach(function(idx){
      var itemTags = itemMap[idx];
      itemTags = itemTags.filter(function(t){
        return t!=tag;
      });
      intersection.add(items[idx], itemTags);
    });
    return intersection;
  }
  
	/**
	 * Add an item and its tags
	 * @param item a tagged resource (any object)
	 * @param ts an array of tags
	 */
	this.add = function(item, ts){
		items.push(item);
    var idx = items.length -1;
    itemMap[idx] = ts;
    for(var i=0; i<ts.length; i++){
		  var tag = ts[i];
      if(!tagMap[tag] ){
	    			tagMap[tag] = [];
    				tags.push(tag);
			 }
			 tagMap[tag].push(idx);
     }
	};
		
}
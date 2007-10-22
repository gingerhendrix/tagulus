
app.datasource.TagMapView = function(datasource, options){
   var superClass = app.datasource.TagMapView.prototype;
   
   var default_options = {
      classifiers: [],
      filters: []   
   }
      
  //All the items
  var items = [];
  //A map connecting items to their index in items
  var tagMap = {};
  
  //All the tags
  var tags = [];

  //A map connecting item idxs to their tags (needed by intersection)
  //Using an array since indexes are integers
  var itemMap = [];
 
  this.options = updatetree({}, default_options, options);

  this.init = function(){
     Utils.log.info("TagMapView.init");
     superClass.init.call(this);
     Utils.signals.connect(datasource, "update", bind(this.update, this));
     this.update();
  }
  
  this.update = function(){
    Utils.log.info("TagMapView.update");
     
     var is = datasource.getItems();
     is = Utils.clone(is);
     var filterNames = this.getFilters();
       for(var i=0; i<filterNames.length; i++){
         var filter = this.getFilter(filterNames[i])
         is = filter.filter(is);
     }

      items = [];
      tagMap = {};
      tags = [];
      itemMap = [];
     
     for(var i=0; i<is.length; i++){
        this.add(is[i]);
     }
     
     Utils.signals.signal(this, "update")
  }
  

  this.getItems = function(){
    return items;
  }
  
  this.getTags = function(){
    return tags.map(this.getTag);
  }
  
  this.getTagNames = function(){
    return tags.map
  }
  
  this.getTag = function(tag){
    return {label : tag, frequency : tagMap[tag].length}
  }
  
  this.itemsForTag = function(tag){
    return tagMap[tag].map(function(idx){
       return items[idx];
    });
  } 
  

  
	/**
	 * Add an item and its tags
	 * @param item a tagged resource (any object)
	 * @param ts an array of tags
	 */
	this.add = function(item){
		items.push(item);
    var ts = item.tags;
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
  
  this.toString = function(){
    return "[TagMapView object]"
  }
   
  this.init();
}

app.datasource.TagMapView.prototype = new app.datasource.DataView();


app.datasource.IntersectionFilter = function(dataview, options){
  var default_options = {
    tag : false  
  }
  this.options = updatetree({}, default_options, options);
  
  this.filter = function(items){
    var tag = this.options.tag;
    if(tag){
     return items.filter(function(item){
       var idx = item.tags.indexOf(tag);
       if(idx >=0){
         item.tags = item.tags.slice(0, idx).concat(item.tags.slice(idx+1));
         return true; 
       }else{
         return false;  
       }
       
     });
   }else{
     return items;
   }
  }
}
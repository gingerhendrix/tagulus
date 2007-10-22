/**
 * This is a list view of tag data, suitable for tagclouds and many types of chart. 
 * 
 * @param {Object} datasource
 * @param {Object} options
 */
app.datasource.TagListView = function(datasource, options){
   var id = app.datasource.TagListView.count++;
   var default_options = {
      classifiers: [],
      filters: []   
   };
   
   var superClass = app.datasource.TagListView.prototype; 
  
   var tags = [];
   var tagMap = {}
   
   this.options = updatetree({}, default_options, options);
   
   this.init = function(){
     Utils.log.info("TagListView.init");
     superClass.init.call(this);
     Utils.signals.connect(datasource, "update", bind(this.update, this));
     this.update();
   }
   
   this.getProperties = function(){
     return ["frequency"]
   }
   
   this.update = function(){
     
     tags = [];
     tagMap = {};
     var ts = datasource.getTags();
    Utils.log.info("TagListView.update " + ts.length);
    
     for(var i=0; i<ts.length; i++){
       tags.push(ts[i]);
     }     
     var filterNames = this.getFilters();
     for(var i=0; i<filterNames.length; i++){
       var filter = this.getFilter(filterNames[i])
       tags = filter.filter(tags);
     }

     for(var i=0; i<tags.length; i++){
        tagMap[tags[i].label] = tags[i]; 
     } 
        
     var classifierNames = this.getClassifiers();
     for(var i=0; i<classifierNames.length; i++){
       var classifier = this.getClassifier(classifierNames[i])
       Utils.log.info(this + " Recalculating classifier " + classifier);
       classifier.calculate();
     }
     
     
     Utils.signals.signal(this, "update")
   }
   
   /**
    * Returns a list of all tagnames, after filters have been applied
    */
   this.getTagNames = function(){
     return tags.map(function(tag){
       return tag.label;
     });
   }
   
   /**
    * Returns an array of all tags after filters have been applied
    */
   this.getTags = function(){
     return tags;
   }
   
   /**
    * Return information about a tag with given name, 
    * including frequency and classifications
    * 
    * @param {Object} tag
    */
   this.getTag = function(name){
      return tagMap[name];
   }
   
   this.toString = function(){
     return "[TagListView #"+id + " " + tags.length + "]";
   }
   
   this.init();
}

app.datasource.TagListView.count = 0;

app.datasource.TagListView.prototype = new app.datasource.DataView();


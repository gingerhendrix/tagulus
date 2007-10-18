Utils.namespace("app.datasource");
/**
 * Class encapsulating cloud data.  Widgets and lenses are dependant on this class for their data.
 * CloudDataSources can be manipulated via
 *   * Filters - E.g. limiting filters, minimum spanning sets, intersection etc.
 *   * Classifiers - These chunk the data into classes e.g. weight classifier, date classifier, cluster classifier
 *   * Transformations - these provide transformations of the data set e.g. sorting
 *   * Views - These add extra properties to the model eg. logarithms, etc
 * 
 * @param {Object} cloud_id
 */
app.datasource.CloudDataSource = function(cloud_id, options){
   var default_options = {
     classifiers : [],
     filters : []
   }
   
   var tagNames = [];
   var tags = {}
   
   var filteredTagNames = [];
   
   var filters = {};
   var filterNames = [];
   
   var classifiers = {};
   var classifierNames = [];
   
   var views = {};
   var transformations = {};
   
   this.options = updatetree({}, default_options, options);
   
   this.init = function(){
     Utils.log.info("CloudDataSource.init");
     //Get weighted list json (for now)
     //In future refactor to get weightedlist/items as necessary
     var dataSource = this;
     
     Utils.http.get("/cloud/"+cloud_id+"/json", function(req){
        var json_text = req.responseText;
        var data = eval("("+json_text+")");
        var tfs = data.tag_frequencies
        for(var i=0; i<tfs.length; i++){
          var tf = tfs[i];
          var tagName = tf.tag;
          tagNames.push(tagName);
          tags[tagName] = { label : tagName, frequency : tf.frequency}
        }
        dataSource.update();
     });  
     
     var fs = this.options.filters;
     for(var i=0; i<fs.length; i++){
       filter = new fs[i].filter(this, fs[i]);
       filterNames.push(fs[i].name);
       filters[fs[i].name] = filter;
     }
     
     var cs = this.options.classifiers;
     for(var i=0; i<cs.length; i++){
       classifier = new cs[i].classifier(this, cs[i])
       classifierNames.push(cs[i].name);
       classifiers[cs[i].name] = classifier;
     }
   }
   
   this.getProperties = function(){
     return ["frequency"]
   }
   
   this.update = function(){
     filteredTagNames = tagNames;
     for(var i=0; i<filterNames.length; i++){
       var filter = filters[filterNames[i]]
       filteredTagNames = filter.filter(filteredTagNames);
     }
     for(var i=0; i<classifierNames.length; i++){
       classifiers[classifierNames[i]].calculate();
     }
     Utils.signals.signal(this, "update")
   }
   
   this.getFilters =function(){
     return filterNames;
   } 
   
   this.getFilter = function(name){
       return filters[name];
   }
   
   this.getClassifier = function(name){
     if(classifiers[name]){
       return classifiers[name]
     }else{
       Utils.log.error("Classifier not found " + name)
       throw new Error("Classifier not found " + name);
     }
   }
   
   this.getClassifiers = function(){
     return classifierNames;
   }
   /**
    * Returns a list of all tags, after filters have been applied
    */
   this.getTags = function(){
     return filteredTagNames;
   }
   
   /**
    * Return information about a tag, 
    * including frequency and classifications
    * 
    * @param {Object} tag
    */
   this.getTag = function(tag){
      return tags[tag];
   }
   
   this.init();
}

/**
 * Abstract interface definition for classifiers
 * 
 */
app.datasource.Classifier = function(){
  
  this.getClass = function(tagOrItem){
    return 0;
  }
}


/**
 * Linear-weight classifier, groups tags into classes based on groups of equal weight interval
 * 
 * 
 * @param {DatSource} dataSource
 * @param {Object} options
 */
app.datasource.WeightedClassifier = function(dataSource, options){
   var default_options = {
      classes : 6,
      classification_term : "frequency"   
   }
  var min = false
  var max = false;
  this.options = updatetree({}, default_options, options);
  
  this.init = function(){  
    this.calculate();
  }
  
  /**
   * Classes begin at 0, with the smallest element in the lowest class
   * 
   * @param {Object} tag
   */
  this.getClass = function(tag){
    if(min !== false && max !== false){
      var tag = dataSource.getTag(tag);
      var weight = tag[this.options.classification_term]*1.0;
      var classes = this.options.classes * 1.0;
      var group =  Math.ceil(((classes-1.0)*(weight-min))/(max-min));
      return group;    
    }else{
      throw new Exception("Classifier not initialised");
    }
  }
  
  this.calculate = function(){
    var tags = dataSource.getTags();
    min = false;
    max = false;

    for(var i=0; i<tags.length; i++){
        var tag = tags[i];
        var freq = dataSource.getTag(tag)[this.options.classification_term] ;
       // Utils.log.info(this.options.classification_term  + " : " + freq);
        min = (!min || freq < min) ? freq : min;
        max = (!max || freq > max) ? freq : max;
    }
    Utils.log.info("WeightedClassifier.calculate : " + min + ", " + max)
  }
  
  this.init();
}

app.datasource.filter = function(dataSource, options){
  this.filter = function(tags){
    return tags;
  }
}

app.datasource.LimitingFilter = function(dataSource, options){
  var default_options = {
      limit : 50,
   }
  this.options = updatetree({}, default_options, options);
  
  this.filter = function(tags){
    return tags.slice(0, this.options.limit);
  }
}
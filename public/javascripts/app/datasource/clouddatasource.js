Utils.namespace("app.datasource");
/**
 * Class encapsulating access to remote cloud data. This data can then be accesed through DataViews, there may be many
 * dataviews per datasource.
 * 
 * @param {Object} cloud_id
 */
app.datasource.CloudDataSource = function(cloud_id, options){
   var default_options = {
   
   }
   
   var tags = [];
   var items = [];
   
   this.getTags = function(){
      return tags;     
   }
   
   this.getItems = function(){
     return items;
   }
   
   function getTags(){
     var datasource = this;
     Utils.http.get("/cloud/"+cloud_id+"/json", function(req){
        tags = [];
        
        var json_text = req.responseText;
        var data = eval("("+json_text+")");
        var tfs = data.tag_frequencies
        for(var i=0; i<tfs.length; i++){
          var tf = tfs[i];
          var tagName = tf.tag;
          var tag = { label : tagName, frequency : tf.frequency}
          tags.push(tag); 
        }
        Utils.signals.signal(datasource, "update")
     });
   }
   getTags = bind(getTags, this);
   
   function getItems(){
     var datasource = this;
     Utils.http.get("/cloud/"+cloud_id+"/items_json", function(req){
        items = [];
        var json_text = req.responseText;
        var data = eval("("+json_text+")");
        var is = data.items
        for(var i=0; i<is.length; i++){
          var item = is[i];
          items.push(item); 
        }
        Utils.signals.signal(datasource, "update")
     });
   }
   getItems = bind(getItems, this);
   
   this.init = function(){
     //Should control with options
     getTags();
     getItems();
   }
   
   this.init();
}


/**
 *  DataViews provide access to cloud data, and an api for data manipulation
 *   * Transformaers - E.g. filters, minimum spanning sets, intersection, sorting, logarithms etc.
 *   * Classifiers - These chunk the data into classes e.g. weight classifier, date classifier, cluster classifier
 *   
 * @param {Object} datasource
 * @param {Object} options
 */
app.datasource.DataView = function(){


   this.init = function(){
     Utils.log.info(this + " DataView.init");
     this.filters = {};
     this.filterNames = [];
   
     this.classifiers = {};
     this.classifierNames = [];
   
     var fs = this.options.filters;
     for(var i=0; i<fs.length; i++){
       filter = new fs[i].filter(this, fs[i]);
       this.filterNames.push(fs[i].name);
       this.filters[fs[i].name] = filter;
     }
     
     var cs = this.options.classifiers;
     for(var i=0; i<cs.length; i++){
       classifier = new cs[i].classifier(this, cs[i])
       this.classifierNames.push(cs[i].name);
       this.classifiers[cs[i].name] = classifier;
     }
   }

   this.getFilters =function(){
     return this.filterNames;
   } 
   
   this.getFilter = function(name){
       return this.filters[name];
   }
   
   this.getClassifier = function(name){
     if(this.classifiers[name]){
       return this.classifiers[name]
     }else{
       Utils.log.error("Classifier not found " + name)
       throw new Error("Classifier not found " + name);
     }
   }
   
   this.getClassifiers = function(){
     return this.classifierNames;
   }
   
   this.toString = function(){
     return "[DataView object]";
   }
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
  this.getClass = function(tagName){
    if(min !== false && max !== false){
      var tag = dataSource.getTag(tagName);
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
    Utils.log.info("> WeightedClassifier.calculate " + dataSource + " : " + tags.length);
    min = false;
    max = false;

    for(var i=0; i<tags.length; i++){
        var tag = tags[i];
        var freq = tag[this.options.classification_term] ;
       // Utils.log.info(this.options.classification_term  + " : " + freq);
        min = (!min || freq < min) ? freq : min;
        max = (!max || freq > max) ? freq : max;
    }
    Utils.log.info("< WeightedClassifier.calculate : " + min + ", " + max)
  }
  
  this.init();
}

app.datasource.filter = function(dataView, options){
  this.filter = function(tags){
    return tags;
  }
}

app.datasource.LimitingFilter = function(dataView, options){
  var default_options = {
      limit : 50,
   }
  this.options = updatetree({}, default_options, options);
  
  this.filter = function(tags){
    return tags.slice(0, this.options.limit);
  }
}
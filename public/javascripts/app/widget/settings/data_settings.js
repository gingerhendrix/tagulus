
Utils.namespace("app.chart");

app.chart.data_settings = function(dataSource){
  return {  
    name: "Data",
    settings: [
    {
      name: "Info", 
      control : function(name, options){
        this.element = "Info control not implemented"  
      }, 
      controlOptions : {
                
      }         
    }],
    groups : [
    {
      name : "Classifiers",
      settings : [
        {
          name : "New Classifier",
          control : function(name, options){
            var addButton = INPUT({type: "button", value: "New Classifier"});
            this.element = addButton;
          }
        }
      ],
      groups : function(){
        var classifierNames = dataSource.getClassifiers();
        return classifierNames.map(function(cName){
          var classifier = dataSource.getClassifier(cName);
          return classifier.settings(dataSource, cName, classifier);
        })
      }
    },
    {
      name : "Filters",
      settings :[
        {
          name : "New Filter",
          control : function(name, options){
            var addButton = INPUT({type: "button", value: "New Filter"});
            this.element = addButton;
          }  
        }
      ],
      groups : function(){
        var filterNames = dataSource.getFilters();
        return filterNames.map(function(fName){
          var filter = dataSource.getFilter(fName);
          return filter.settings(dataSource, fName, filter);
        })
      }
    }
    ]
  }
}


Utils.namespace("app.chart.classifier_settings");
app.chart.classifier_settings.WeightedClassifer = function(dataSource, cName,  classifier){
  return {
    name : cName + " Classifier",
    settings : [
      {
        name : "Classification Term",
        control : app.ui.controls.selectChoice,
        controlOptions : {
              options : function(){return dataSource.getProperties().map(function(prop){
                return {name : prop, value : prop}
              })},
              initial : function(){ return dataSource.getProperties()[0]},
              update : function(val){ classifier.options.classification_term = val; classifier.update()} 
        }
      },
      {
        name : "Classes",
        control : app.ui.controls.slider,
        controlOptions : {
            min : 0,
            max: 10,
            initial : function(){ return classifier.options.classes},
            update : function(val){ classifier.options.classes = val; dataSource.update(); },
        }         
      }
    ] 
  }
}
app.datasource.WeightedClassifier.prototype.settings = app.chart.classifier_settings.WeightedClassifer;

Utils.namespace("app.chart.filter_settings");
app.chart.filter_settings.LimitingFilter = function(dataSource, fName, filter){
  return {
    name : fName + " Filter",
    settings : [
      {
        name : "Limit",
        control : app.ui.controls.slider,
        controlOptions : {
            min : 0,
            max: 100, /*function(){ return dataSource.getTags().length },*/
            initial : function(){ return filter.options.limit},
            update : function(val){ filter.options.limit = val; dataSource.update(); },
        }
      }      
    ]
  }
}
app.datasource.LimitingFilter.prototype.settings = app.chart.filter_settings.LimitingFilter
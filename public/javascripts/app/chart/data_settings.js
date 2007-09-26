
Utils.namespace("app.chart.data_settings");

app.chart.data_settings = function(data, chart, updateHandler){
  return {  
    name: "Data Settings",
    settings: [{
      name: "Limit", 
      control : "slider", 
      controlOptions : {
         min : 2, 
         max : function(){ return data.tag_frequencies.length; },
         initial : function(){ return chart.options.data.limit; },
         update : function(val){ chart.options.data.limit = val; updateHandler();}
      }          
    }]
  }
}
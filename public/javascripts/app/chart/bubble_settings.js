
Utils.namespace("app.chart.bubble_settings");

app.chart.bubble_settings =  function(data, chart){
  return [
    app.chart.data_settings(data, chart, function(){chart.reload()}),
    {name : "Display",
     settings : [
       {
           name : "Background Color",
           control : "colorPicker",
       }
     ],
     groups : [
       { 
         name : "Bubbles",
         settings : [
            
         ],
         groups : [
           {
             name : "Stroke",
             settings : [
               { name : "Stroke",
                 control : "checkbox",
                 controlOptions : {
                   label : "Show Stroke",
                   initial : function(){ return chart.options.stroke;},
                   update : function(value){ chart.options.stroke = value; chart.redisplay(); }
                 }
               },
               {
                 name : "Width",
                 control : "slider",
                 controlOptions : {
                   min : 1,
                   max : 5,
                   snap : 1,
                   initial : function() {return chart.options.strokeWidth; },
                   update : function(value){ chart.options.strokeWidth = value; chart.redisplay();}                   
                 } 
               },
               {
                name : "Color",
                control : "text",
                controlOptions : {
                  initial : function() {return chart.options.strokeColor; },
                  update : function(value){ chart.options.strokeColor = value; chart.redisplay();}
                } 
               }
             ]
           },
           {
             name : "Fill",
             settings : [
               {
                 name : "Fill",
                 control : "checkbox",
                 controlOptions : {
                   label : "Fill",
                   initial : function(){ return chart.options.fill; },
                   update : function(value){ chart.options.fill = value; chart.redisplay()},
                 },
               },
               {
                 name : "Color",
                 control : "text",
                 controlOptions : {
                   initial : function() {return chart.options.fillColor; },
                   update : function(value){ chart.options.fillColor = value; chart.redisplay();}
                 }
               }    
             ]             
           },
         ]
       },
       {
         name : "Labels",
         settings : [
           {
             name: "Overflow",
             control: "radioChoice",
             controlOptions : {
               options : [{name : "Show Overflow", value :"overflow"},
                          {name : "Truncate", value : "truncate"},
                          {name : "Hide Label", value : "hide"}],
               initial : function(){ return chart.options.labels.overflow; },
               update : function(value){ chart.options.labels.overflow = value; chart.redisplay()}
             }
            },
         ],
         groups : [
           {
             name : "Font",
             settings : 
             [
               { name : "Font Size",
                  control : ""
               },
               {
                 name : "Color",
                 control : ""
               },
               {
                 name : "Font"
               }
             ]
           }  
         ],
       }
     ]
   }
 ]
}

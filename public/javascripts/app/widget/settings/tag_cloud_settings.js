Utils.namespace("app.chart.tag_cloud_settings");

app.chart.tag_cloud_settings =  function(cloud){
  return [
    { name : "Sort",
      settings: [
        { name: "Sort Function",
          control: "selectChoice",
          controlOptions : {
            options : [
                {name : "Random", value: "random"},
                {name : "Alphabetical", value : "alpha"},
                {name : "Weighted", value : "weighted"}
                ],
            initial : function(){return cloud.options.sort;},
            update : function(value){ cloud.options.sort=value; cloud.update()}
          }
        },
        {name : "Sort Order",
         control : "selectChoice",
         controlOptions : {
           options : [
                {name : "Normal", value: "normal"},
                {name : "Reverse", value : "reverse"},
                {name : "Centered", value : "center"}
                ],
            initial : function(){return cloud.options.sort_order;},
            update : function(value){ cloud.options.sort_order=value; cloud.update()}
         }
          
        }
      ]
    },
    {name : "Weight Classifier",
     settings : [
       {name : "Classification Function",
        control : "selectChoice",
        controlOptions : {
          options : [
            {name : "Linear", value: "linear"},
            {name : "Logarithmic", value : "log"}
          ],
          initial : function(){ return cloud.options.weight },
          update : function(value){ cloud.options.weight = value; cloud.update();}
        }
       },
       {name : "Classes",
        control : "slider",
        controlOptions : {
           min : 1,
           max : 10,
           initial :  function(){ return cloud.options.classes },
           update : function(value){ cloud.options.classes = value; cloud.update();}
        }
       }
     ]
    },
    {name : "Display",
     settings : [
       {name : "Width",
        control : "slider",
        controlOptions : {
           min : 0,
           max : 1600,
           initial :  function(){ return cloud.display.options.width },
           update : function(value){ cloud.display.options.width = value; cloud.display.redisplay();}
        }
       
       }
     ]
    },
    {
       name : "Tag Styles",
       groups : 
         [
           {
             name : "Size",
             settings : 
             [
              { 
                name : "min",
                control : "slider",
                controlOptions : {
                  min : 1,
                  max : 36,
                  initial : function(){ return cloud.display.options.font_min} ,
                  update : function(value){ cloud.display.options.font_min= value; cloud.display.redisplay()}
                }
              },
              {
                name : "max",
                control : "slider",
                controlOptions : {
                  min : 1,
                  max : 36,
                  initial : function(){ return cloud.display.options.font_max} ,
                  update : function(value){ cloud.display.options.font_max= value; cloud.display.redisplay()}
                }
              }
            ]
          },
          {
            name : "Opacity",
            settings :
            [
              {
                name : "min",
                control : "slider",
                controlOptions : {
                  min : 0,
                  max : 100,
                  initial : function(){ return cloud.display.options.opacity_min },
                  update : function(value){ cloud.display.options.opacity_min = value; cloud.display.redisplay()}
                }
              },
            {
                name : "max",
                control : "slider",
                controlOptions : {
                  min : 0,
                  max : 100,
                  initial : function(){ return cloud.display.options.opacity_max },
                  update : function(value){ cloud.display.options.opacity_max = value; cloud.display.redisplay()}
                }
              }
            ]
          }
      ]
    }
    
    
  ];
}

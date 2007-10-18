
Utils.namespace("app.chart.chart_settings");

app.chart.chart_settings = function(chart){ 

return {  
    name: "Display Settings",
    groups: [{
        name : "Basic Options",
        settings: [{
          name: "Color Scheme",
          control : "selectChoice",
          controlOptions : {
              options : [{name : "Bright Primary Colors", value : "colorScheme"},
                         {name : "Primary Colors", value : "basePrimaryColors"},
                         {value : "baseBlueColors", name : "3-Color Blue"},
                         {value : "officeBlue", name : "Blue"},
                         {value : "officeRed", name : "Red"},
                         {value : "officeGreen", name : "Green"},
                         {value : "officePurple", name : "Purple"},
                         {value : "officeCyan", name : "Cyan"},
                         {value : "officeOrange", name : "Orange"},
                         {value : "officeBlack", name : "Black"}],
              initial : function(){ return chart.options.renderer.colorScheme; },
              update : function(scheme){  
                            var colors = PlotKit.Base[scheme]();
                            if(colors.colorScheme){
                              MochiKit.Base.update(chart.options.renderer, colors);
                            }else{
                              chart.options.renderer.colorScheme = colors;
                              chart.options.renderer.backgroundColor = MochiKit.Color.Color.fromHexString("#ffffff");
                            }
                            chart.rerender();
                            chart.reload(); 
                        }
          }
        },
        {
          name: "Fill",
          control: "checkbox",
          controlOptions : {
                label : "Fill",
                initial : function(){ return chart.options.renderer.shouldFill;},
                update : function(val){  chart.options.renderer.shouldFill=val;  chart.rerender();  chart.reload();}
          }
        },
        {
          name: "Stroke",
          control: "checkbox",
          controlOptions : {
                label : "Stroke",
                initial : function(){ return chart.options.renderer.shouldStroke;},
                update : function(val){  chart.options.renderer.shouldStroke=val;  chart.rerender();  chart.reload();}
          }
        },//Stroke
        {
          name: "Background",
          control: "checkbox",
          controlOptions : {
                label : "Show Background",
                initial : function(){ return chart.options.renderer.drawBackground;},
                update : function(val){  chart.options.renderer.drawBackground=val;  chart.rerender();  chart.reload();}
          }
        }//Background

      ]//settings
    },//Basic Options
    {
      name: "Axes",
       settings: [{
          name : "Show X-Axis",
          control : "checkbox",
          controlOptions : {
            label : "Show X-Axis",
            initial : function(){ return chart.options.renderer.drawXAxis; },
            update : function(val){ chart.options.renderer.drawXAxis = val; chart.rerender(); chart.reload(); },
          },
        },
        {
          name : "Show Y-Axis",
          control : "checkbox",
          controlOptions : {
            label : "Show Y-Axis",
            initial : function(){ return chart.options.renderer.drawYAxis; },
            update : function(val){ chart.options.renderer.drawYAxis = val; chart.rerender(); chart.reload(); },
          },
        },
        {
          name : "Line Width",
          control : "slider",
          controlOptions : {
            min : 0,
            max : 5.0,
            initial : function(){ return chart.options.renderer.axisLineWidth},
            update : function(val){ chart.options.renderer.axisLineWidth = val; chart.rerender(); chart.reload(); },
          },
        },
        {
          name : "Tick Size",
          control : "slider",
          controlOptions : {
            min : 0,
            max: 20,
            initial : function(){ return chart.options.renderer.axisTickSize},
            update : function(val){ chart.options.renderer.axisTickSize = val; chart.rerender(); chart.reload() },
          }
        },
        {
          name : "Label Width",
          control : "slider",
          controlOptions : {
            min : 0,
            max : 200,
            initial : function(){ return chart.options.renderer.axisLabelWidth},
            update : function(val){ chart.options.renderer.axisLabelWidth = val; chart.rerender(); chart.reload() }
          }
        },
        {
          name : "Label - Font Size",
          control : "slider",
          controlOptions : {
            min : 0,
            max : 20,
            initial : function(){ return chart.options.renderer.axisLabelFontSize},
            update : function(val){ chart.options.renderer.axisLabelFontSize = val; chart.rerender(); chart.reload() }
          }
        }
        ]//Settings
    }//Axes
    ]//groups
  }
}
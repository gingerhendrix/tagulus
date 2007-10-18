
Utils.namespace("app.chart.pie_settings");

app.chart.bar_settings = function(data, chart){
  return [  
    app.chart.data_settings(data, chart, function(){chart.reload()}),
    {
        name: "Bar Chart Settings",
        settings : [{
              name: "Orientation",
              control : "radioChoice",
              controlOptions : {
                options : [{name : "Horizontal", value: "horizontal"},
                           {name: "Vertical", value: "vertical"}],
                initial : function(){ return chart.options.layout.barOrientation; },
                update : function(val){  chart.options.layout.barOrientation = val;  chart.relayout();  chart.reload();}
              }
          },{
              name : "Bar Width",
              control : "slider",
              controlOptions : {
                min : 0,
                max : 100,
                initial : function(){ return chart.options.layout.barWidthFillFraction*100;},
                update : function(val){  chart.options.layout.barWidthFillFraction = val/100;  chart.relayout();  chart.reload();}  
              }
          }
        ]
    },
    app.chart.chart_settings(chart)
  ]
} 
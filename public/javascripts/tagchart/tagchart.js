function TagChart(options){
    var layout;
    var renderer;
    var data = [];
    var labels = [];
    var default_options = {
      data : {
          limit: 5,
          showOther: false   
      },
      layout : {
          style : "pie",
         "IECanvasHTC": "/javascripts/PlotKit/iecanvas.htc",
         "colorScheme": PlotKit.Base.palette(PlotKit.Base.baseColors()[0]),
         "padding": {left: 0, right: 0, top: 10, bottom: 30},
      },
      renderer : {
          
      }            
    }
    
    function init(){
      this.options = merge(default_options, options);
      prepData();
      MochiKit.DOM.addLoadEvent(initChart);
    }
    
    this.reload = function(){
      prepData();
      
      layout.addDataset("frequency", data);
      layout.options.xTicks = labels;
      layout.evaluate();
      
      renderer.clear();
      renderer.render();
    }
    
    function prepData(){
        data = [];
        labels = [];
        
        for(var i=0; i<cloud.tag_frequencies.length && i < this.options.data.limit; i++){
            var tag = cloud.tag_frequencies[i];
            data.push([i, tag.frequency]);
            labels.push({v: i, label: tag.tag});
        }
    }
    
    function initChart(){
       layout = new PlotKit.Layout("pie", this.options.layout);
       layout.addDataset("frequency", data);
       layout.options.xTicks = labels;
       layout.evaluate();
       
       var canvas = MochiKit.DOM.getElement("tag_graph");
       renderer = new PlotKit.SweetCanvasRenderer(canvas, layout, this.options.renderer);
       renderer.render();
    }
    
    init = bind(init, this);
    initChart = bind(initChart, this);
    prepData = bind(prepData, this);
    init();
};
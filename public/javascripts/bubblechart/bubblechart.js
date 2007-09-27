
function BubbleChart(tagCloud, canvas, options){
  var default_options = {
        data : {
          limit : 10  
        },
        labels : {
          overflow : "overflow",  // or "truncate" or "hide"
        },
        incrementalRender : true,
        stroke : false,
        strokeWidth : 1,
        strokeColor : "#0000ff",
        fill : true,
        fillColor : "#BFE8FF",
        shadow : false, //Shadow only supported in Safari
        shadowWidth : 2,
        shadowColor : "#aaaaaa",
        shadowOffsetX : 1,
        shadowOffsetY : 1
  }
 this.options = merge(default_options, options);
 
  var ctx = canvas.getContext('2d');
  var data;
  
  var circles = [];
  var labels;
  var bounds = {min : {x: 0, y:0}, max : {x : 0, y:0}};
  
  
  this.reload = function(){
    prepareData();
    computeBubbles();
  }
  
  this.redisplay = function(){
    clear();
    draw();
  }
  
  function clear(){
   if(labels && labels.parentNode){
     labels.parentNode.removeChild(labels);
   }
  }
  
  function prepareData(){
    console.log("Prepare data " + this);
    var freqs = tagCloud.tag_frequencies.slice(0, this.options.data.limit);
    data = freqs.map(function(tf){
                    return {radius : tf.frequency, label : tf.tag};
    });
    data = data.sort( function(a,b){ return b.radius-a.radius; } );
    //Normalize data
    data = data.map( function(a){ return {radius: a.radius/(data[0].radius)*canvas.width, label : a.label } });
                
  }
  
  function computeBubbles(){
    circles = [];
    bounds = {min : {x: 0, y:0}, max : {x : 0, y:0}};
    var spacing = data[0].radius * 0.05;
    var k = 0;
    
    var loop = function(){
      findSpace(data[k], spacing);
      k++;
      if(this.options.incrementalRender){
        this.redisplay();
      }
      if(k<data.length){
        window.setTimeout(loop, 10);
      }else{
       if(!this.options.incrementalRender){
        this.redisplay();
       } 
      } 
    };
    loop = bind(loop, this);
    loop();
  }   
  
  function findSpace(dataPoint, spacing){
    var radius = dataPoint.radius;
    var label = dataPoint.label;
    found = false;
    thetaInterval = Math.PI/36; //5 degree intervals
    var spacedRadius = (1.0 * radius) + (1.0 * spacing);
    radiusInterval = spacedRadius * 0.5;
    
    for(var r= 0; !found; r+=radiusInterval){
      for(var theta = 0.5*Math.PI; theta > 0 && !found; theta-=thetaInterval){
        var x =  r*Math.sin(theta);
        var y =  r*Math.cos(theta);
        
        if(!intersects(x, y, spacedRadius)){
          console.log("Found space " + r + "," + theta);
          circles.push({x: x, y: y, radius: radius, label: label})
          bounds.max.x = Math.max(bounds.max.x, x+spacedRadius);
          bounds.max.y = Math.max(bounds.max.y, y+spacedRadius);
          bounds.min.x = Math.min(bounds.min.x, x-spacedRadius);
          bounds.min.y = Math.min(bounds.min.y, y-spacedRadius);
          found = true;
        }
      }
    }
  }
  
  function intersects(x, y, radius){
    return circles.some(function(circle){
      var d = Math.sqrt(Math.pow(circle.x - x, 2) + Math.pow(circle.y - y, 2))  
      return (d<(circle.radius+radius))
    });
  }
 
  function draw(){
    if(circles.length == 0){
      return;
    }
    var scale = Math.min(canvas.height/(bounds.max.y-bounds.min.y), canvas.width/(bounds.max.x - bounds.min.x));
    //console.log("Bounds " + bounds.toSource());
    console.log("Drawing at " + scale + ":1");
    ctx.clearRect(0,0, canvas.width, canvas.height)
    ctx.save();
    ctx.scale(scale, scale);
    ctx.lineWidth = 1/scale;
    
    //ctx.strokeRect(0, 0, bounds.max.x - bounds.min.x, bounds.max.y - bounds.min.y);
    ctx.translate(-bounds.min.x, -bounds.min.y);
    
    labels = document.createElement("div");
    labels.style.position = "absolute";
    labels.style.left = canvas.offsetLeft + "px";
    labels.style.top = canvas.offsetTop + "px";
    canvas.parentNode.insertBefore(labels, canvas)
    circles.forEach(bind(function(c){
      ctx.save();
      
      ctx.lineWidth = this.options.strokeWidth/scale;
      ctx.strokeStyle = this.options.strokeColor;
      ctx.fillStyle = this.options.fillColor;
      
      if(this.options.shadow){
        ctx.shadowBlur = this.options.shadowWidth/scale;
        ctx.shadowColor = this.options.shadowColor;
        ctx.shadowOffsetX = this.options.shadowOffsetX/scale;  
        ctx.shadowOffsetY = this.options.shadowOffsetY/scale;
      }
      
      ctx.beginPath();
      
      ctx.arc(c.x,
              c.y,
              c.radius, 
              0,
              2*Math.PI,
              false);
       if(this.options.stroke){              
         ctx.stroke();
       }
       if(this.options.fill){
         ctx.fill();
       }
       
       ctx.restore();
       
       
       var label = document.createElement("span");
       label.innerHTML = c.label;
       label.title = c.label;
       label.style.cursor = "pointer";
       label.style.visibility = "hidden";
       label.style.whiteSpace = "pre"  
       label.style.textAlign = "center";                   
       labels.appendChild(label);
       window.setTimeout(bind(function(){
         
         label.style.position = "absolute";
         
         
         if(this.options.labels.overflow=="truncate"){
          label.style.width = (c.radius*2)*scale + "px";
          label.style.overflow = "hidden";
         }else if(this.options.labels.overflow=="hide"){
           if(label.offsetWidth > ((c.radius*2)*scale)){
             label.style.opacity = 0.0;  
           }
           label.style.width = (c.radius*2)*scale + "px";
           label.style.overflow = "hidden";
         }else{// overflow = "overflow"
           label.style.overflow = "visible";
         } 
         var left = Math.round( 0.0
                            + (((c.x-bounds.min.x)*1.0)*scale)
                            - label.offsetWidth/2) + "px"; 
         label.style.left = left;
         
         label.style.top = Math.round( 0.0 
                           + (((c.y-bounds.min.y)*1.0)*scale)
                           - label.offsetHeight/2) + "px";
       
         label.style.visibility = "visible";                    
       },this), 1);
       
       
    },this));    
    ctx.restore();
    
  }
  
  prepareData = bind(prepareData, this);
  draw = bind(draw, this);
  computeBubbles = bind(computeBubbles, this);
  this.reload();
}

















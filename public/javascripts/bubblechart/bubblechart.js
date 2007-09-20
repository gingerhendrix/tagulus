
function BubbleChart(data, canvas){
  var ctx = canvas.getContext('2d');
 
  data = data.sort( function(a,b){ return b.radius-a.radius; } );
  data = data.map( function(a){ return {radius: a.radius/(data[0].radius)*canvas.width, label : a.label } });//Normalize data
  console.log("Data: " + data.toSource());
  var circles = [];
  var bounds = {min : {x: 0, y:0}, max : {x : 0, y:0}};
  
  var spacing = data[0].radius * 0.05;
  
  computeBubbles();
  draw();

  function computeBubbles(){
    for(var k=0; k<data.length; k++){
      var radius = data[k].radius;
      var label = data[k].label;
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
  }   
  
  function intersects(x, y, radius){
    return circles.some(function(circle){
      var d = Math.sqrt(Math.pow(circle.x - x, 2) + Math.pow(circle.y - y, 2))  
      return (d<(circle.radius+radius))
    });
  }
 
  function draw(){
    
    var scale = Math.min(canvas.height/(bounds.max.y-bounds.min.y), canvas.width/(bounds.max.x - bounds.min.x));
    console.log("Bounds " + bounds.toSource());
    console.log("Drawing at " + scale + ":1");
    
    ctx.save();
    ctx.scale(scale, scale);
    ctx.lineWidth = 1/scale;
    
    ctx.strokeRect(0, 0, bounds.max.x - bounds.min.x, bounds.max.y - bounds.min.y);
    ctx.translate(-bounds.min.x, -bounds.min.y);
    
    var labels = document.createElement("div");
    labels.style.position = "absolute";
    labels.style.left = canvas.offsetLeft + "px";
    labels.style.top = canvas.offsetTop + "px";
    canvas.parentNode.insertBefore(labels, canvas)
    
    circles.forEach(function(c){
      ctx.save();
      ctx.strokeStyle = c.color || "#0000ff";
      ctx.beginPath();
      
      ctx.arc(c.x,
              c.y,
              c.radius, 
              0,
              2*Math.PI,
              false);
       ctx.stroke();
       
       ctx.restore();
       
       
       var label = document.createElement("span");
       label.innerHTML = c.label;
       label.title = c.label;
       label.style.cursor = "pointer";
       label.style.visibility = "hidden";
                          
       labels.appendChild(label);
       window.setTimeout(function(){
         label.style.position = "absolute";
         
         if(label.offsetWidth > ((c.radius*2)*scale)){
             label.style.opacity = 0.0;  
             label.style.width = (c.radius*2)*scale + "px";
             //label.style.maxHeight = (c.radius*2)*scale + "px";
             label.style.overflow = "hidden";
         }
         var left = Math.round( 0.0
                            + (((c.x-bounds.min.x)*1.0)*scale)
                            - label.offsetWidth/2) + "px"; 
         label.style.left = left;
         
         label.style.top = Math.round( 0.0 
                           + (((c.y-bounds.min.y)*1.0)*scale)
                           - label.offsetHeight/2) + "px";
       
         label.style.visibility = "visible";                    
       }, 1);
       
       
    });    
    ctx.restore();
    
  }
}

















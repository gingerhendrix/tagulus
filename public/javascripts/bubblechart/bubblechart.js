
function BubbleChart(data, canvas){
  var ctx = canvas.getContext('2d');
 
  data = data.sort( function(a,b){ return b-a; } );
  data = data.map( function(a){ return a/[data[0]]*canvas.width; });//Normalize data
  console.log("Data: " + data.toSource());
  var circles = [];
  var bounds = {min : {x: 0, y:0}, max : {x : 0, y:0}};
  
  var spacing = data[0] * 0.05;
  
  computeBubbles();
  draw();

  function computeBubbles(){
    for(var k=0; k<data.length; k++){
      var radius = data[k];
      found = false;
      thetaInterval = Math.PI/36; //5 degree intervals
      radiusInterval = radius * 0.5;
      for(var r= 0; !found; r+=radiusInterval){
        for(var theta = 0.5*Math.PI; theta > 0 && !found; theta-=thetaInterval){
            var x =  r*Math.sin(theta);
            var y =  r*Math.cos(theta);
            var spacedRadius = (1.0 * radius) + (1.0 * spacing);
            if(!intersects(x, y, spacedRadius)){
              console.log("Found space " + r + "," + theta);
              circles.push({x: x, y: y, radius: radius})
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
    });    
    ctx.restore();
    
  }
}

















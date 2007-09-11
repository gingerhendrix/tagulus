

function BubbleChart(data, canvas){
  var ctx = canvas.getContext('2d');
  
  data = data.sort( function(a,b){ return b-a; } );
  data = data.map( function(a){ return a/[data[0]]*canvas.width; });//Normalize data
  console.log("Data: " + data.toSource());
  var circles = [];
  var bounds = {x: 0, y:0}
  computeBubbles();
  draw();
  
  function computeBubbles(){
    //Algoritn, draw center circle then rotate around exterior
    var value =  data[0];
    var radius = value;
    circles.push({x: 0, y: 0, radius: radius, color : "#000000"});
    bounds.x = 2*radius;
    bounds.y = 2*radius;
    
    var thetaAcc = 0;
    var radiusAcc = radius;
    var radiusAdj = 0;
    var dir = 1;
    for(var i=1; i<data.length; i++){
        var value =  data[i];
        var radius = value;
        var theta = Math.atan2(radius, radiusAcc+radius);
        var gamma = thetaAcc + (theta*dir);
        var x = (radiusAcc+radius)*Math.sin(gamma);
        var y = (radiusAcc+radius)*Math.cos(gamma);
        
        console.log("radius: " + radius + " theta: " + theta + "thetaAcc: " + thetaAcc + " gamma: " + gamma + " x: " + x + "y: " + y);
        
        circles.push({x: x, y: y, color: "#0000ff", radius: radius});
        
        bounds.x = Math.max(bounds.x, (x+radius)*2);
        bounds.y = Math.max(bounds.y, (y+radius)*2);
        
        thetaAcc += (2*theta)*dir;
        radiusAdj = Math.max(radiusAdj, 2*radius);
        
        if(thetaAcc >= 2*Math.PI){
          thetaAcc = 0;
          radiusAcc += radiusAdj;
          
          radiusAdj = 0; 
        }
    }
  } 
  
  
  function draw(){
    var scale = Math.min(canvas.height/bounds.y, canvas.width/bounds.x);
    console.log("Bounds " + bounds.toSource());
    console.log("Drawing at " + scale + ":1");
    
    ctx.save();
    ctx.scale(scale, scale)
    ctx.lineWidth = 6*scale;
    ctx.strokeRect(0,0,bounds.x, bounds.y);
    ctx.translate(bounds.x/2, bounds.y/2);
    
    
    circles.forEach(function(c){
      ctx.save();
      ctx.strokeStyle = c.color;
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

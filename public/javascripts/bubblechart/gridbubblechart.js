
function BubbleChart(data, canvas){
  var ctx = canvas.getContext('2d');
 
  data = data.sort( function(a,b){ return b-a; } );
  data = data.map( function(a){ return a/[data[0]]*canvas.width; });//Normalize data
  console.log("Data: " + data.toSource());
  var circles = [];
  var bounds = {x: 10, y:10}
  computeBubbles();
  draw();


  function computeBubbles(){
//    var value =  data[0];
//    var radius = value;
//    circles.push({x: radius, y: radius, radius: radius, color : "#000000"});
//    bounds.x = radius*2;
//    bounds.y = radius*2;
    
    for(var k=0; k<data.length; k++){
      var value =  data[k];
      var radius = value;
      var gridSize = radius *1.0;
      var cols = Math.ceil(bounds.x/gridSize); 
      var rows = Math.ceil(bounds.y/gridSize);
      console.log("Trying grid "+gridSize + ":" + cols + "x" + rows);
      found = false;
      for(var i=1; i<cols && !found; i++){
        for(var j=1; j<rows && !found; j++){
            var x = (i+1)*gridSize;
            var y = (j+1)*gridSize;
            if(!intersects(x, y, radius)){
              console.log("Found space " + i + "," + j);
              circles.push({x: x, y: y, radius: radius})
              bounds.x = Math.max(bounds.x, x+radius);
              bounds.y = Math.max(bounds.y, y+radius);
              found = true;
            }
        }
     }
     if(!found){
       console.log("Can't find hole for "+ k);
       circles.push({x: bounds.x+radius, y: bounds.y+radius, radius: radius})
       bounds.x = Math.max(bounds.x, bounds.x+(radius*2));
       bounds.y = Math.max(bounds.y, bounds.y+(radius*2));
       
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
    var scale = Math.min(canvas.height/bounds.y, canvas.width/bounds.x);
    console.log("Bounds " + bounds.toSource());
    console.log("Drawing at " + scale + ":1");
    
    ctx.save();
    ctx.scale(scale, scale)
    ctx.lineWidth = 1/scale;
    ctx.strokeRect(0,0,bounds.x, bounds.y);
    //ctx.translate(bounds.x/2, bounds.y/2);
    
    
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

















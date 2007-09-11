

function UglyBubbleChart(data, canvas){
  var ctx = canvas.getContext('2d');
  
  data = data.sort( function(a,b){ return b-a; } );
  console.log("Data: " + data.toSource());
  var circles = [];
  var bounds = {x: 0, y: 0};
  var rightSpace;
  var bottomSpace;
  

  
  data.forEach(function(value){
    var radius = value;
    var x,y;
    var color = "#000000";
    function addToRightSpace(){
      console.log("Rightspace")
      x = rightSpace.origin.x + radius;
      y = rightSpace.origin.y + radius;
      color = "#0000ff";
      rightSpace.origin.y += (2*radius);
      rightSpace.limit.x = Math.max(rightSpace.limit.x, x);
    
    }
  
    function addToBottomSpace(){
      console.log("Bottomspace");
      //put in bottomspace
      x = bottomSpace.origin.x + radius;
      y = bottomSpace.origin.y + radius;
      color = "#ff0000";
      bottomSpace.origin.x += (2*radius);
      bottomSpace.limit.y = Math.max(bottomSpace.limit.y, y);  

    }
    
    function isRightSpace(){
      return   (bounds.x - rightSpace.origin.x) >= (2*radius) 
            && (bottomSpace.origin.y - rightSpace.origin.y) >= (2*radius)
    }
    
    function isLeftSpace(){
      return   (bounds.y - bottomSpace.origin.y) >= (2*radius) 
            && (rightSpace.origin.x - bottomSpace.origin.x) >= (2*radius) 
    }
    
    if(bounds.x==0){//Get started
      bounds.x += (2*radius);
      bounds.y += (2*radius);
      rightSpace = {origin : {x: bounds.x, y: 0}, limit:  {x: bounds.x} };
      bottomSpace = {origin : {x: 0, y: bounds.y}, limit : {y: bounds.y}  };
      x = radius;
      y = radius;
    }else if(isRightSpace()){
      addToRightSpace();
    }else if( isLeftSpace() ){
      addToBottomSpace()
    }else if (bounds.x > bounds.y){
      //expand down and put in downspace
      console.log("Expand down");
      bounds.y += 2*radius;
      addToBottomSpace();
    
      if(rightSpace.origin.x < bottomSpace.origin.x){
        //Reset right space to new column
        console.log("New right column");
        rightSpace.origin.x = bounds.x;
        rightSpace.origin.y = 0
      }
      
    }else{
      console.log("Expand right");
      bounds.x += 2*radius;
      addToRightSpace();
      
      if(bottomSpace.origin.y < rightSpace.origin.y){
        console.log("New bottom row");
        bottomSpace.origin.y = bounds.y;
        bottomSpace.origin.x = 0;
      }  
    }
    circles.push({x: x, y:y, radius : radius, color: color});
  });
  draw();
  
  function draw(){
    var scale = Math.min(canvas.height/bounds.y, canvas.width/bounds.x);
    
    ctx.strokeRect(0,0,bounds.x*scale, bounds.y*scale);
    
    circles.forEach(function(c){
      ctx.save();
      ctx.strokeStyle = c.color;
      ctx.beginPath();
      
      console.log("Drawing at " + scale + ":1" + "  " + c.toSource());
      ctx.arc(c.x*scale,
              c.y*scale,
              c.radius*scale, 
              0,
              2*Math.PI,
              false);
       ctx.stroke();
       
       ctx.restore();
    });    
    
  }
  
}
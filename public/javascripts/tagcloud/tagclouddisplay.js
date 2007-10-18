

function TagCloudDisplay(tagcloud, element, options){
    this.tagcloud = tagcloud;
    var default_options = {
        width : 600,
        font_family: "verdana, arial, helvetica, sans-serif",
        font_size: {
           classifier : false,
           distribution: "linear",
           max: 24,
           min: 8,
          unit: "px",   
        },
        opacity: {
           classifier : false,
           distribution: "linear",
           max: 100,
           min: 10,
           unit: "pc",
        },
        color: {
          classifier : false,
          distribution : "linear",
          colors : [[255,0,0],[0,0,255]] 
        } 
    };
    this.element = element;
    this.options = updatetree({}, default_options, options);
    
    this.init = function(){
        this.setWidth(this.options.width);
        this.element.style.fontFamily = this.options.font_family;
        this.recalculate(true);
    }
    
    this.recalculate = function(force){
        if(force || this.tagcloud.options.visible){
            if(this.options.font_size.distribution == "linear"){
                this.fontDistribution = partial(linearDistribution, this.options.font_size.min, this.options.font_size.max);
            }else{
                this.fontDistribution = partial(constantDistribution, this.options.font_size.max);
            }
            this.opacityDistribution = partial(linearDistribution, this.options.opacity.min, this.options.opacity.max);
            this.colorDistribution = function(d){
                return map(function(arg){
                    return linearDistribution(arg[0], arg[1], arg[2]);
                }, izip(this.options.color.colors[0], this.options.color.colors[1], [d,d,d]));
            }
        }
        signal(this, "recalculate");
    }
    
    
    
    this.redisplay = function(){
        this.recalculate();
        
        if(this.tagcloud.options.visible){
            this.setWidth(this.options.width);
            console.log("Tagcloud redisplaying")
            
            var tags = this.tagcloud.tags;
            for(var i=0; i<tags.length; i++){
               var tagName = tags[i]
               var tag = this.tagcloud.source.getTag(tagName);
               
               var classes = ["font_size", "opacity", "color"].map(bind(function(attribute){
                 if(this.options[attribute].classifier){
                   var classifier = this.tagcloud.source.getClassifier([this.options[attribute].classifier]);
                   var clazz = classifier.getClass(tagName);
                   var numClazzes = classifier.options.classes - 1.0;
                   var d = (clazz*1.0)/numClazzes;
                 }else{
                   var d = 1.0;
                 }
                 return d;
               }, this));
               
               
               var fontSize = this.fontDistribution(classes[0]);
               var opacity = this.opacityDistribution(classes[1]);
               var color = this.colorDistribution(classes[2]);
               
               var el = this.tagcloud.elements[tagName];
               if(!el){
                 Utils.log.error("Tag Element not found for " + tagName);
                 throw new Error("Tag Element not found for " + tagName);
               }
               el.style.fontSize = "" + fontSize + "" + this.options.font_size.unit;
               el.style.opacity = "" + opacity/100 + "";
               el.style.color = "rgb(" + color[0] + ", " + color[1] + "," +  color[2] +")";
            }
       } 
    }

    function linearDistribution(min, max, progress){
        return ((max-min)*progress)+min;
    }
    
    function colorDistribution(min, max, progress){
            return map(function(arg){
                return linearDistribution(arg[0], arg[1], arg[2]);
            }, izip(min, max, [d,d,d]));
    }
    
    this.setWidth = function(width){
        this.options.width = width;
        this.element.style.width = width + "px";
    }    
}



function TagCloudDisplay(tagcloud, element, options){
    this.tagcloud = tagcloud;
    var default_options = {
        width : 600,
        font_family: "verdana, arial, helvetica, sans-serif",
        font_distribution: "linear",
        font_max: 24,
        font_min: 8,
        font_unit: "px",
        opacity_min : 10,
        opacity_max : 100,
        color: [0,255,100],
        color_distribution : "linear",
        colors : [[255,0,0],[0,0,255]]
    };
    this.element = element;
    this.options = merge(default_options, options);
    
    this.init = function(){
        this.setWidth(this.options.width);
        this.element.style.fontFamily = this.options.font_family;
        this.recalculate(true);
    }
    
    this.recalculate = function(force){
        if(force || this.tagcloud.options.visible){
            if(this.options.font_distribution == "linear"){
                this.fontDistribution = partial(linearDistribution, this.options.font_min, this.options.font_max);
            }else{
                 this.fontDistribution = partial(constantDistribution, this.options.font_min);
            }
            this.opacityDistribution = partial(linearDistribution, this.options.opacity_min, this.options.opacity_max);
            this.colorDistribution = function(d){
                return map(function(arg){
                    return linearDistribution(arg[0], arg[1], arg[2]);
                }, izip(this.options.colors[0], this.options.colors[1], [d,d,d]));
            }
        }
        signal(this, "recalculate");
    }
    
    
    
    this.redisplay = function(){
        this.recalculate();
        if(this.tagcloud.options.visible){
            this.setWidth(this.options.width);
            console.log("Tagcloud redisplaying")
            for(var i=0; i<this.tagcloud.options.classes; i++){
                var d = (this.tagcloud.options.classes-i)/this.tagcloud.options.classes;
                //console.log("Class " + (i+1) );
                var fontSize = this.fontDistribution(d);
                var opacity = this.opacityDistribution(d);
                var color = this.colorDistribution(d);
                color = color.map(Math.floor);
                //console.log("Color " + color);
                //console.log("Groups" + this.tagcloud.groups);                                
                //console.log("TagElements " + this.tagcloud.tagElements);
                var tags = this.tagcloud.groups[i+1];
                console.log("Tags: " + tags);
                if (!tags){
                    tags = [];
                }
                //console.log("Elements " + elements.length);
                tags.forEach(bind(function(tag){
                  //  console.log("Tag " + tag);
                    elements = this.tagcloud.tagElements;
                    //console.log("TagElements " + elements);
                    var el = elements[tag];
                    //console.log("Element " + el);
                    if(el){
                        el.style.fontSize = "" + fontSize + "" + this.options.font_unit;
                        el.style.opacity = "" + opacity/100 + "";
                        //console.log("rgb(" + color[0] + ", " + color[1] + "," +  color[2] +")");
                        el.style.color = "rgb(" + color[0] + ", " + color[1] + "," +  color[2] +")";
                    }
                }, this));
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

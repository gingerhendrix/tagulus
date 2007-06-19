/**
  * Generates simple tag clouds 
  *
  * 0.2 - 30/03/07 -  Incorporated into TagCloud webservice
  * 0.3 - 08/06/07 -  
  */
  
  
function TagCloud(folksonomy, element, options, displayOptions){
    var default_options = {
        classes : 6,
        sort : "random",
        sort_order : "normal",
        filter : ["blogs", "blog"],
        limit : false,
        weight : 'linear',
        style : {width : 600}
    }
    
    this.sort = true;
    this.center = true;
    this.filter = ["blogs", "blog"];
    this.element = element;
    
    function init(){
        this.tags = [];
        this.tagMap = {};
        this.wordCount = 0;
        this.options = merge(default_options, options);
        this.display = new TagCloudDisplay(this, element, displayOptions);
    
        makeTagMap();
        this.display.init();
        this.update();
    }
    
    function makeTagMap(){
        for(var i=0; i<folksonomy.length; i++){
               this.tags.push(folksonomy[i].tag);
               //var freq = Math.log(Number(folksonomy[i].frequency));
               var freq =  folksonomy[i].frequency;
               this.tagMap[folksonomy[i].tag] = freq;
               this.wordCount += freq;
                 if(!this.max || freq>this.max){
                     this.max = freq;
                 }
                 if(!this.min || freq<this.min){
                     this.min = freq;
                 }
        }
    }
    
    this.emitHTML = function(){
        
        var str = "";
        var tags = this.tags;
        var tagMap = this.tagMap;
        if(this.options.limit){
            tags = tags.sort(partial(weightsSort, tagMap));
            tags = tags.slice(0, this.options.limit);
            var min, max;
            tags.forEach(function(tag){
                var freq = tagMap[tag];
                 if(!max || freq>max){
                     max = freq;
                 }
                 if(!min || freq<min){
                     min = freq;
                 }
            });
            this.min = min;
            this.max = max;
        }
        if(this.options.sort == "weighted"){
            tags = tags.sort(partial(weightsSort, tagMap));
        }else if(this.options.sort == "random"){
            tags = tags.sort(randomSort);
        }else if(this.options.sort == "alpha"){
            tags =tags.sort(alphaSort);
        }
        if(this.options.sort_order == "center"){
            tags = center(tags);
        }else if(this.options.sort_order == "reverse"){
            tags = tags.reverse();
        }
        for(var i=0; i<tags.length; i++){
            var tag = tags[i];
            if(this.options.weight == 'log'){
                var weight = Math.log(tagMap[tag]);
                var min = Math.log(this.min);
                var max = Math.log(this.max);
            }else{
                var weight = tagMap[tag];
                var min = this.min;
                var max = this.max;
            }
            
            var classes = this.options.classes;
            var group =  Math.ceil(((classes-1)*(weight-min))/(max-min));
            
            group = classes - group; //invert order
            
            str += "<span class='tag tag"+group+"'>" + tag + " </span>";//"(" +weight + "," + group +") 
        }
        return str;
    }
    
    this.replaceElement = function(){
        this.element.innerHTML = this.emitHTML();
        this.display.redisplay();
    }
    
    this.update = function(){
        this.element.innerHTML = this.emitHTML();
        this.display.redisplay();
    }
    
    function filter(){//TODO
        return true;       
    }
    
    function center(tags){
        var newTags = [];
            var center = Math.floor(tags.length/2);
            var i=0;
            var right = true;
            tags.forEach(function(t){
               if(right){
                   newTags[center+i]=t;
                   i++;
                   right = false;
               }else{
                   newTags[center-i]=t;
                   right = true;
               }     
            });
       return newTags;
    }
    
    function weightsSort(tagMap, t1, t2){
        if(tagMap[t1]>tagMap[t2]){
                return -1;
        }else if(tagMap[t1]<tagMap[t2]){
            return 1;
        }else{
            return alphaSort(t1, t2)
        }
    }
    
    function randomSort(t1, t2){
        var r = Math.random()
        if(r > 0.5){
            return 1;
        }else if(r < 0.5){
            return -1;
        }else{
            return 0;
        }
    }
    
    function alphaSort(t1, t2){
        if(t1 < t2){
            return -1;
        }else if(t2> t1){
            return 1;
        }else{
            return 0;
        }
    }
    makeTagMap = bind(makeTagMap, this);
    init = bind(init, this);
    init()
};

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
    }
    
    this.recalculate = function(){
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
        signal(this, "recalculate");
    }
    
    
    
    this.redisplay = function(){
        this.recalculate();
        for(var i=0; i<this.tagcloud.options.classes; i++){
            var d = (this.tagcloud.options.classes-i)/this.tagcloud.options.classes;
            var fontSize = this.fontDistribution(d);
            var opacity = this.opacityDistribution(d);
            var color = this.colorDistribution(d);
            cssQuery(".tag"+(i+1), element).forEach(bind(function(el){
                el.style.fontSize = "" + fontSize + "" + this.options.font_unit;
                el.style.opacity = "" + opacity/100 + "";
                el.style.color = "rgb(" + color[0] + ", " + color[1] + "," +  color[2] +")";
            }, this));
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

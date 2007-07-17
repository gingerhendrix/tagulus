/**
  * Generates simple tag clouds 
  *
  * 0.2 - 30/03/07 -  Incorporated into TagCloud webservice
  * 0.3 - 08/06/07 -  
  */
  
function TagCloud(source, element, options, displayOptions){
    var default_options = {
        classes : 6,
        sort : "random",
        sort_order : "normal",
        filter : ["blogs", "blog"],
        limit : false,
        weight : 'linear',
        style : {width : 600},
        visible: true
    }
    this.element = element;
    
    function init(){
        this.tags = [];
        this.tagMap = {};
        this.displayTags = [];
        this.groups = [];
        this.tagGroups = {};
        this.tagElements = {};
    
        this.wordCount = 0;
        this.options = merge(default_options, options);
        this.display = new TagCloudDisplay(this, element, displayOptions);
        this.behaviour = new TagCloudBehaviour(this, element);
        makeTagMap();
        makeCloud();
        this.display.init();
        this.update();
    }
    
    function makeTagMap(){
        for(var i=0; i<source.length; i++){
               this.tags.push(source[i].tag);
               //var freq = Math.log(Number(source[i].frequency));
               var freq =  source[i].frequency;
               this.tagMap[source[i].tag] = freq;
               this.wordCount += freq;
                 if(!this.max || freq>this.max){
                     this.max = freq;
                 }
                 if(!this.min || freq<this.min){
                     this.min = freq;
                 }
        }
    }
    
    this.show = function(){
        this.options.visible = true;
        this.update();
    } 
    
    
    var makeCloud = function(){
        //var str = "";
        var tags = this.tags;
        var tagMap = this.tagMap;
        if(this.options.limit && this.options.limit != 0 && this.options.limit != "0"){
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
        var groups = [];
        var tagGroups = {};
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
            tagGroups[tag] = group;
            if(!groups[group]){
                groups[group] = []
            }
            groups[group].push(tag);
            //str += "<span class='tag tag"+group+"'>" + tag + " </span>";//"(" +weight + "," + group +") 
        }
        this.displayTags = tags;
        this.groups = groups;
        this.tagGroups = tagGroups;
    }
    
    var emitDOM = function(){
        var div = document.createElement("div");
        for(var i=0; i<this.displayTags.length; i++){
            var tag = this.displayTags[i];
            var group = this.tagGroups[tag];
            var span = document.createElement("span");
            span.setAttribute("class", "tag tag"+group);
            span.style.whiteSpace = "nowrap"
            span.innerHTML = tag;
            div.appendChild(span);
            this.tagElements[tag] = span;
            div.appendChild(document.createTextNode(" "));
            span.addEventListener("click", partial(this.behaviour.onclick, tag), true);
        }
        return div;
    }
    
    this.update = function(){
        console.log("Update " + this.options.visible);
        if(this.options.visible){
            makeCloud();
            this.element.innerHTML =  "";
            this.element.appendChild(emitDOM());
        }
        this.display.redisplay();
        signal(this, "update");
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
    
    emitDOM = bind(emitDOM, this);
    makeCloud = bind(makeCloud, this);
    makeTagMap = bind(makeTagMap, this);
    init = bind(init, this);
    init();
};

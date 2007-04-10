/**
  * Generates simple tag clouds 
  *
  * 0.2 - 30/03/07 -  Incorporated into TagCloud webservice
  *
  */
  
function TagCloud(){
    this.makeCloud = makeCloud;
    this.classes = 6;
    this.sort = true;
    this.center = true;
    this.filter = ["blogs", "blog"];
    this.limit = 40;
    
    function makeCloud(folksonomy){
        var str = "";
        var tags = [];
        var tagMap = {};
        var wordCount = 0;
        var max = 0;
        var min = Number.MAX_VALUE;
        for(var i=0; i<folksonomy.length && i<this.limit; i++){
            if(filter(tag)){
                 tags.push(folksonomy[i].tag);
                 var freq = Math.log(Number(folksonomy[i].frequency));
                 tagMap[folksonomy[i].tag] = freq;
                 wordCount += freq;
                 if(freq>max){
                     max = freq;
                 }
                 if(freq<min){
                     min = freq;
                 }
            }
        }
        if(this.sort || this.center){
            tags = sort(tags, tagMap)
        }
        if(this.center){
            tags = center(tags);
        }
        for(var i=0; i<tags.length; i++){
            var tag = tags[i];
            var weight = tagMap[tag];
            var group = this.classes+1 - Math.ceil((this.classes*(weight-min))/(max-min));
            if(group>this.classes){
                group = this.classes;
            }
            str += "<span class='tag tag"+group+"'>" + tag + " </span>"; 
        }
        return str;
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
    
    function sort(ts, f){
        ts = ts.sort(function(t2, t1){
            if(f[t1]>f[t2]){
                return 1;
            }else if(f[t1]<f[t2]){
                return -1;
            }else{
                return 0;
            }
        });
        return ts;
    }
   
};


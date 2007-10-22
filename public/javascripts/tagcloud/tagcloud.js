/**
  * Generates simple tag clouds 
  *
  * 0.2 - 30/03/07 -  Incorporated into TagCloud webservice
  * 0.3 - 08/06/07 -  
  */
  
function TagCloud(source, element, options){
    var default_options = {
        classes : 6,
        sort : "random",
        sort_order : "normal",
        filter : ["blogs", "blog"],
        data : {
          limit : false  
        },
        display : {
          width: 600  
        },
        weight : 'linear',
        visible: true
    }
    this.element = element;
    
    this.setData = function(data){
      this.source = data;
      var tc = this;
      Utils.signals.connect(this.source, "update", function(){
        tc.update();  
      })
    }
    
    function init(){
        this.elements = {};
        this.tags = [];
        this.options = updatetree({}, default_options, options);
        this.setData(source);

        this.display = new TagCloudDisplay(this, element, this.options.display);
        
        this.behaviour = new TagCloudBehaviour(this, element);

        this.display.init();
        this.update();
    }
     
    this.show = function(){
        this.options.visible = true;
        this.update();
    } 
    
    
    var emitDOM = function(){
        var div = document.createElement("div");
        this.tags = this.source.getTagNames();
        for(var i=0; i<this.tags.length; i++){
            var tagName = this.tags[i];
            var tag = source.getTag(this.tags[i]);
            var span = document.createElement("span");
            
            span.style.whiteSpace = "nowrap"
            span.innerHTML = tagName;
            
            div.appendChild(span);
            
            this.elements[tagName] = span;
            
            div.appendChild(document.createTextNode(" "));
            
            span.addEventListener("click", partial(this.behaviour.onclick, tag, span), true);
        }
        return div;
    }
    
    this.update = function(){
        if(this.options.visible){
            this.element.innerHTML =  "";
            this.element.appendChild(emitDOM());
        }
        this.display.redisplay();
        signal(this, "update");
    }
    
  
    emitDOM = bind(emitDOM, this);
    init = bind(init, this);
    init();
};


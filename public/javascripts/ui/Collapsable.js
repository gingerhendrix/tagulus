 function Collapsable(root, options){
 var default_options = {initiallyHidden : true};

 function init(){
     this.options = merge(default_options, options);
     var children = root.childNodes;
      for(var i=0; i<children.length; i++){
          var child = children[i];
          if(child.nodeName == "DT"){
              var sibling = child.nextSibling; 
              while(sibling != null && sibling.nodeName != "DD"){
                  sibling = sibling.nextSibling;
              } 
              if(sibling != null){
                   child.addEventListener("click", partial(toggle, sibling), true);
                   sibling.visible = this.options.initiallyHidden;
                   toggle(sibling);
             }
          }
       }
 }
 
 function toggle(el){
      if(el.visible){
          el.visible = false;
          el.style.position = "absolute";
          el.style.top = "-1000px";
      }else{
          el.visible = true;
          el.style.position = "relative";
          el.style.top = "0px";
      }
 }
 
 init();
}

        
   
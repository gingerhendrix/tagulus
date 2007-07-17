function Behaviour(){};
Behaviour.prototype.onclick = function(){};

function NavigableBehaviour(){
    this.url = "";
}
NavigableBehaviour.prototype = new Behaviour();
NavigableBehaviour.prototype.onclick = function(tag){
    var url = this.url.replace("%t", tag);
    window.location.href = url;
}


var BehaviourFactory = function(){
   var behaviours = {};
    
   return {
       register: function(name, constructor){
            behaviours[name] = constructor;                                        
       },
       create : function(name){
           if(behaviours[name]){
               return new behaviours[name]; 
           }
       }
   }
}

Utils = {};

Utils.namespace = function(name){
  var nameParts = name.split(".");
  var root = window;
  for(var i=0; i<nameParts.length; i++){
    if(!root.hasOwnProperty(nameParts[i])){
      root[nameParts[i]] = {};
    }
    root = root[nameParts[i]];
  }
}
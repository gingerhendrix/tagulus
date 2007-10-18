
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

Utils.namespace("Utils.http");

Utils.http.get = function(uri, callback, errback){
  var req = new XMLHttpRequest();
  req.open('GET', uri, true);
  req.onreadystatechange = function (aEvt) {
    if (req.readyState == 4) {
      if(req.status == 200){
         Utils.log.info("Loaded " + uri);
         if(callback && ((typeof callback) == "function")){
           callback(req);
        }
      }else{
        Utils.log.info("Error loading " + uri);
        if(errback && ((typeof errback) == "function")){
          errback(req);
        }
      }
    }
  };
  req.send(null); 
}

Utils.namespace("Utils.log");

Utils.log.log = function(msg){
  if(console && console.log){
    console.log("INFO: " + msg)
  }
}

Utils.log.info = function(msg){
  Utils.log.log("INFO: " + msg)
}

Utils.log.error = function(msg){
    Utils.log.log("ERROR: " + msg)
}

Utils.namespace("Utils.signals");

new function(){
  var observers = [];
  
  Utils.signals.signal = function(src, signal){
    Utils.log.info("Singal " + signal + " sent from " + src + " " + observers.length + " observers")
    for(var i=0; i<observers.length; i++){
      var ob = observers[i];
      if(ob.source === src && ob.signal == signal){
        Utils.log.info("Dispatching to " + i);
        ob.listener.apply(ob.src);
      }
    }    
  }
  
  Utils.signals.connect = function(src, signal, listener){
    var ident = { source : src, signal :  signal, listener : listener};
    observers.push(ident);
  }

}();
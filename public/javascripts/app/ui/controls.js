
Utils.namespace("app.ui.controls");

app.ui.controls.slider = function(name, options){
    var slider = new Slider(name);
    slider.min = (options.min instanceof Function) ? options.min() : options.min;
    slider.max = (options.max instanceof Function) ? options.max() : options.max;
    slider.width = 260;
    slider.ticks = (slider.width)/(slider.max-slider.min); 
    slider.onchange = options.update;
    window.setTimeout(function(){ 
      slider.init(); 
      slider.setValue((options.initial instanceof Function) ? options.initial() : options.initial); 
    }, 10);
    this.element = slider.getElement();
}

app.ui.controls.radioChoice = function(name, options){
  var init = (options.initial instanceof Function) ? options.initial() : options.initial;
  this.element =  options.options.map(function(opt){
        console.log("init " + init  );
        var inputEl = INPUT({type: "radio", 
                          name: name, 
                          value: opt.value, 
                          onchange : function(){options.update(this.value);}
                          }, ""); 
        if(opt.value == init){
          inputEl.checked = true;
        }                          
        return [inputEl, SPAN({}, opt.name)];
  });
}

app.ui.controls.selectChoice = function(name, options){
  var init = (options.initial instanceof Function) ? options.initial() : options.initial;
  var subOptions = (options.options instanceof Function) ? options.options() : options.options;
  this.element = SELECT({  
        onchange : function(){options.update(this.value);} }, 
        subOptions.map(
          function(opt){
            var inputEl = OPTION({ 
                                name: name, 
                                value: opt.value, 
                                }, opt.name); 
            if(opt.value == init){
              inputEl.selected = true;
            } 
            return inputEl;                         
          }
      ));
}

app.ui.controls.checkbox = function(name, options){
   var init = (options.initial instanceof Function) ? options.initial() : options.initial;
   var checkbox = INPUT({type: "checkbox", onchange : function(){options.update(this.checked)}});
   checkbox.checked = init;
   this.element =  [checkbox, SPAN({}, options.label)]
}

app.ui.controls.text =  function(name, options){
    var init = (options.initial instanceof Function) ? options.initial() : options.initial;
    var textbox = INPUT({type: "text", onchange : function(){options.update(this.value)}, value: init});
    this.element [SPAN({}, options.label), textbox]
}
function makeSettings(settings, element){
      var DL = MochiKit.Base.partial(MochiKit.DOM.createDOM, "DL");
      var DT = MochiKit.Base.partial(MochiKit.DOM.createDOM, "DT");
      var DD = MochiKit.Base.partial(MochiKit.DOM.createDOM, "DD");
      var INPUT = MochiKit.Base.partial(MochiKit.DOM.createDOM, "INPUT");
      
      var defaultGroup = {
        name: "",
        settings: [],
        groups: []
      };
      
      var defaultSetting = {
        name: ""
      };
      
      var controls = {"slider" : function(name, options){
          var slider = new Slider(name);
          slider.min = (options.min instanceof Function) ? options.min() : options.min;
          slider.max = (options.max instanceof Function) ? options.max() : options.max;
          slider.width = 260;
          slider.onchange = options.update;
          window.setTimeout(function(){ 
            slider.init(); 
            slider.setValue((options.initial instanceof Function) ? options.initial() : options.initial); 
          }, 10);
          return slider.getElement();
          
      },
      "radioChoice" : function(name, options){
        var init = (options.initial instanceof Function) ? options.initial() : options.initial;
          return options.options.map(function(opt){
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
      },
      "selectChoice" : function(name, options){
            var init = (options.initial instanceof Function) ? options.initial() : options.initial;
            return SELECT({  onchange : function(){options.update(this.value);} }, options.options.map(
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
      },
      "checkbox" : function(name, options){
          var init = (options.initial instanceof Function) ? options.initial() : options.initial;
          return [INPUT({type: "checkbox", onchange : function(){options.update(this.checked)}, checked : init }), SPAN({}, options.label)]
        
      }
    };

    function idName(name){
      return name.replace(/[^A-Za-z0-9:-_]/g, "_").toLowerCase();
    }      
      
    function makeSetting(setting, path){
      setting = merge(defaultSetting, setting)
      path = path ? (path + ":" + "setting_" + idName(setting.name)) : "setting_" + idName(setting.name);
      var controlBuilder = controls[setting.control];
      if(!controlBuilder){
        control = "Control '" + settings.control + "' not implemented"
      }else{
        control = controlBuilder(path, setting.controlOptions);          
      }
      console.log("Make setting " + control);
      return [DT({}, setting.name), DD({}, control)];
    }
    function makeGroup(group, path){
      path = path ? (path + ":" + idName(group.name)) : idName(group.name);
      group = merge(defaultGroup, group)
      return [DT({}, group.name), DD({}, 
        DL({}, group.settings.map(function(setting){ return makeSetting(setting, path)}).concat(group.groups.map(function(group){ return makeGroup(group, path)}))))];
    }
    
    var settingsEl = DL({}, settings.map(function(setting){
      return makeGroup(setting);
    }));
    element.innerHTML = "";
    element.appendChild(settingsEl);
};
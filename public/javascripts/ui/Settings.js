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

    function idName(name){
      return name.replace(/[^A-Za-z0-9:-_]/g, "_").toLowerCase();
    }      
      
    function makeSetting(setting, path){
      setting = (setting instanceof Function) ? setting() : setting; 
      setting = merge(defaultSetting, setting)
      path = path ? (path + ":" + "setting_" + idName(setting.name)) : "setting_" + idName(setting.name);
      if(!setting.control){
        control = "control not found"
      }else{
        control = new setting.control(path, setting.controlOptions);          
      }
      return [DT({}, setting.name), DD({}, control.element)];
    }
    
    function makeGroup(group, path){
      group = (group instanceof Function) ? group() : group; 
      path = path ? (path + ":" + idName(group.name)) : idName(group.name);
      group = merge(defaultGroup, group)
      
      var settings = (group.settings instanceof Function) ? group.settings() : group.settings;
      var groups = (group.groups instanceof Function) ? group.groups() : group.groups;
      return [DT({}, group.name), DD({}, 
        DL({}, settings.map(function(setting){ return makeSetting(setting, path)}).concat(groups.map(function(group){ return makeGroup(group, path)}))))];
    }
    
    var settingsEl = DL({}, settings.map(function(setting){
      return makeGroup(setting);
    }));
    element.innerHTML = "";
    element.appendChild(settingsEl);
};
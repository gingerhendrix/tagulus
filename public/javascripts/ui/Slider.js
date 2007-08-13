        function Slider(prefix){
            this.min = 0;
            this.max = 100;
            this.width = 200;
            this.onchange = function(){};
            var newVal;
            var oldVal;
            var slider;
            
            function html(){
              var width = this.width;
              
              var html = '<div class="slider" style="width: '+ (width + 60) + 'px">'
               + '<span id="'+prefix + '_min" style="position: relative; font-size: 8px; left: 6px;">0</span><span id="'+prefix + '_max" style="position: relative; left: ' +width + 'px; font-size: 8px">200</span>'
               + '<div id="'+prefix+'_sliderbg" style="background-image : url(/images/slider/small/horizBg.png); width : ' + (width + 16) + 'px; height: 16px; position: relative; top: 0px; cursor: pointer; ">'
               + '<div id="'+prefix + '_sliderthumb" style="position: relative; top: 0px !important; width: 16px; height: 16px;"><img id="'+prefix+'_sliderthumbimg" src="/images/slider/small/horizSlider.png" width="16" height="16"/></div>'
               + '</div>'
               + '<div id="'+prefix+'_slidervalue" style="position: relative; top: -16px; left: ' + (width + 8) + 'px; padding-left: 20px;">0</div>'
               + '</div>';
              
              return html;
            }
            
            this.getElement = function(){
              var div =  document.createElement("div");
              div.innerHTML = html.call(this);
              return div;
            }
            
            
            this.emitHTML = function(){
              document.write(html.call(this));
            }
            
            this.init = function(){
               document.getElementById(prefix + "_min").innerHTML = this.min;
               document.getElementById(prefix + "_max").innerHTML = this.max;
               slider = YAHOO.widget.Slider.getHorizSlider(prefix+"_sliderbg", prefix + "_sliderthumb", 0, this.width);
               slider.animate = true;
               slider.subscribe("change", bind(displayNewValue, this));
               slider.subscribe("slideEnd", bind(updateTagCloud, this));
            }
            
            this.setValue = function(val){
                return slider.setValue(((val-this.min)/(this.max-this.min))*this.width, true);
            }
            
            function displayNewValue(offset){
               // determine the actual value from the offset
               if(!isNaN(offset)){
                   console.log("Offset: " + offset);
                   newVal = Math.round(((offset/this.width)*(this.max-this.min))+this.min);
                   document.getElementById(prefix + "_slidervalue").innerHTML = newVal;
               }
            }
            
            function updateTagCloud(){
               if(oldVal!=newVal){
                    console.log("newVal: " + newVal);
                    oldVal=newVal;
                    this.onchange(newVal);
                }
            }
        }
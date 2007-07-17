
/**
 * TagCloudBehaviour
 */
function TagCloudBehaviour(tagcloud, element, options){
    var behaviours = [];
    
    this.add = function(b){
        behaviours.push(b);
    }
    
    this.remove = function(b){
        console.log(">Remove: length-"+behaviours.length);
        var removed = behaviours.splice(behaviours.indexOf(b), 1);
        console.log("Removed" + removed.length);
        console.log("<Remove: length-"+behaviours.length);
    }
    
    this.onclick = function(tag){
        behaviours.forEach(function(b){
            b.onclick(tag);
        })
    }
}
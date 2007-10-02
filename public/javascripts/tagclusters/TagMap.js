/**
 * A TagMap
 * @classDescription  A TagMap
 * 
 */
function TagMap(){
	var clone = function(obj){
		return eval(obj.toSource());
	};

	
	/**
	 * A associative array (object) of sites to arrays of tags.
	 */
	this.sites = {};
	/**
	 * A list of all the tagNames used in this TagMap
	 */
	this.tagNames = [];
	/**
	 * An associative array of tags to sites 
	 */
	this.tags = {};
	/**
	 * An list of all the sites used in this TagMap
	 */
	this.siteNames =[];
	
	/**
	 * Add a site and its tags
	 * @param site a tagged resource name
	 * @param ts an array of tags
	 */
	this.add = function(site, ts){
		var sites = this.sites;
		var siteNames = this.siteNames;
		var tags = this.tags;
		var tagNames = this.tagNames;
		
		if(!sites[site]){
			siteNames.push(site);
			sites[site] = [];
		}
            for(var i=0; i<ts.length; i++){
			    var tag = ts[i];
    			sites[site].push(tag);
		    	if(!tags[tag] ){
	    			tags[tag] = [];
    				tagNames.push(tag);
			    }
			    tags[tag].push(site);
		    }
       
	};
	
	/**
	  * Sorts this.tagNames by frequency
	  */
	this.sortTagNames = function(){
		var sortFunc = function(tags){
			return function(tagA, tagB){
				return (tags[tagB].length-tags[tagA].length);
			};
		};
		this.tagNames = this.tagNames.sort(sortFunc(this.tags));
	};
		
	
	/**
	 * Removes all the sites supplied
	 * @param _sites and array of sites
	 */
	this.removeAll = function(_sites){
		var rsites = clone(_sites);
		//alert("Remove all " + rsites + " " + rsites.length);
		var count =0;
		for(var i=0; i<rsites.length; i++){
			if(this.remove(rsites[i])){
					count++;
			}
		}
		return count;
	};
	
	/**
	 * Remove a single site
	 */
	this.remove = function(site){
		var tags = this.sites[site];
		if(tags){
			for(var j=0; j<tags.length; j++){
				var tag = tags[j];
				var siteIdx = this.tags[tag].indexOf(site);
				if(siteIdx>=0){
					this.tags[tag].splice(siteIdx, 1);
				}
			}
			delete this.sites[site];
			var idx = this.siteNames.indexOf(site);
			if(idx>=0){
				this.siteNames.splice(idx, 1);
			}
			return true;
		}else{
			return false;
		}
	};

	/**
	 * Clone this object
	 */	
	this.clone = function(){
		return clone(this);		
	};
	
}
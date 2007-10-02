/**
  * Calculates the intersection of a tagMap and a tag, the intersection term is left out of the returned tagMap
  */
function tagIntersection(tagMap, tag){
		var rootSites =tagMap.tags[tag];
		var child = new TagMap();
		for(var i=0; i<rootSites.length; i++){
			var site = rootSites[i];
			var newTags = new Array();
			var oldTags = tagMap.sites[site];
			for(var j=0; j< oldTags.length; j++){
				if(oldTags[j]!=tag){
					newTags.push(oldTags[j]);
				}
			}
			child.add(site, newTags);
		}
		return child;

}
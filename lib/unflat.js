var _  = require('lodash');
var isobmff = require('../isobmff.json');


module.exports = function unflat (data) {

	var tree = [],
		index = 0;




/*
	data.map(function (box) {
 if (isobmff.boxContainers.indexOf(boxType) > -1) {

		if (box.parents) {

			subTree(tree, index,  box);

		} else {

			addToTree(tree, index, box);

			index += 1;
		}
	});
*/
	_.forEach(_.sortBy(data, 'id'), iterator, tree);

	console.dir(JSON.stringify(tree));

	return tree;
}


function iterator (obj, index) {

	var tree = this;

	if (obj.parent !== 0) {
		// find parent, add
		addToParent(obj, tree);
	} else {
		addToTree(obj, tree)
	}

}


function addToParent (data, tree) {

	var parent = findById(data.parent, tree);
	
	console.log('parent', parent );
	if (parent) {

		addToTree(data, parent.content);
	}


}


function addToTree (data, tree) {

	tree.push({
		id: data.id,
		type: data.type,
		content: (isobmff.boxContainers.indexOf(data.type) > -1) ? [] : 'BINARY_DATA' //data.data
	});



}


function findById (id, tree) {
	return _.reduce(tree, function (accumulator, item) {
		if (accumulator !== false) {
			return accumulator;
		}

		if (item.id === id) {
			return item;
		}

		if (item.content instanceof Array) {
			return findById(id, item.content)
		}

		return false;
	}, false);
	
}


// ez igy nem lesz jo, mert lehet tobb moof is pl,
// szoval egy array szeru struktura lesz, sorrendben
/*
[
	{type: moof, content: [
		{type: traf, content: ... }
	]}
	{type: mdat, blabla }
	{type: moof, blabla }
	{type: mdat, blabla }
]
 */


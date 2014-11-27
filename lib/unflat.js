var _  = require('lodash');
var isobmff = require('../isobmff.json');


module.exports = function unflat (data) {

	var tree = [];

	_.forEach(_.sortBy(data, 'id'), iterator, tree);

	return tree;
}


function iterator (obj) {
	var tree = this;

	if (obj.parent !== 0) {
		addToParent(obj, tree);
	} else {
		addToTree(obj, tree)
	}

}


function addToParent (data, tree) {

	var parent = findById(data.parent, tree);

	if (parent) {
		addToTree(data, parent.content);
	}
}


function addToTree (data, tree) {
	// TODO: output 'BINARY_DATA' instead of data when debugging
	var content = data.data;

	//content = (data.data instanceof Buffer) ? 'BINARY_DATA' : content;
	
	tree.push({
		id: data.id,
		type: data.type,
		content: (isobmff.boxContainers.indexOf(data.type) > -1) ? [] : content
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
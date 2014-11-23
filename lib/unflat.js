module.exports = function unflat (data) {

	var tree = {};

	data.map(function (box) {
		if (box.parents) {
			subTree(tree, box.parents.split('.'), box)
		} else {
			addToTree(tree, box.type, box.data);
		}
	});

	return tree;
}



function addToTree (tree, type, data) {
	tree[type] = data;
	return tree;
}




function subTree (tree, parents, box) {

	parents.map(function (name, i, parents) {

		if (i !== 0) return;

		if (!tree[name]) {
			tree[name] = {};
		}

		parents.shift();

		if (parents.length > 0) {
			subTree(tree[name], parents, box);
		} else {
			addToTree(tree[name], box.type, box.data)
		}

		return;


	});
}


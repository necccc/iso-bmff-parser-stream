module.exports = function unflat (data) {

	var tree = {};

	data.map(function (box) {
		if (box.parents) {
			subTree(tree, box.parents.split('.'), box)
		} else {
			addToTree(tree, box.type, box.data);
		}
	});

	return data;
}



function addToTree (tree, type, data) {
	tree[type] = data;
	return tree;
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


var isobmff = require('../isobmff.json'); // to be deprecated
var boxes = {};

require("fs").readdirSync(__dirname + "/box").forEach(function(file) {
	boxes[file.replace('.js', '')] = require("./box/" + file);
});


function boxBuild (type, box) {
	if (boxes[type]) {

		if (typeof boxes[type].build == 'undefined') {
			throw new Error('lib/box/' + type + ' is missing build method')
		}

		return boxes[type].build(box);
	} else {
		return box;
	}
}

boxBuild.isBoxContainer = function (type) {
	return isobmff.boxContainers.indexOf(type) > -1;
}

module.exports = boxBuild;
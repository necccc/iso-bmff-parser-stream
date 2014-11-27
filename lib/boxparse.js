var isobmff = require('../isobmff.json'); // to be deprecated
var boxes = {};

require("fs").readdirSync(__dirname + "/box").forEach(function(file) {
	boxes[file.replace('.js', '')] = require("./box/" + file);
});


function boxParse (type, data) {
	if (boxes[type]) {
		return boxes[type](data);
	}
}

boxParse.isBoxContainer = function (type) {
	return isobmff.boxContainers.indexOf(type) > -1;
}

module.exports = boxParse;
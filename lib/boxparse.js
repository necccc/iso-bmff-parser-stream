
var boxes = {};

require("fs").readdirSync(__dirname + "/box").forEach(function(file) {
	boxes[file.replace('.js', '')] = require("./box/" + file);
});

module.exports = function (type, data) {
	if (boxes[type]) {
		return boxes[type](data);
	}
}
var _  = require('lodash');
var boxBuild = require('./lib/boxbuild.js');
var intobuffer = require('intobuffer');

function Builder (data, callback) {

	this.rebox(data);

	data = Buffer.concat(_.map(data, this.box, this));

	callback(null, data);

}

Builder.prototype.rebox = function (data) {
	this.reboxIterator(data);
}


Builder.prototype.reboxIterator = function (data) {

	return _.map(data, function (box) {

		if (box.content instanceof Array) {
			box.content = this.reboxIterator(box.content);
		} else {
			box.content = boxBuild(box.type, box.content);
		}

		return this.box(box);

	}, this);
}

Builder.prototype.box = function (box) {

	if (box.content instanceof Array) {
		box.content = Buffer.concat(box.content);
		return this.box(box);
	}

	return Buffer.concat([
		intobuffer(box.content.length + 8, 4),
		new Buffer(box.type),
		box.content
	]);
}

module.exports = Builder;
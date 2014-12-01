var util = require('util');
var Writable = require('stream').Writable;
var unflat = require('./lib/unflat.js');
var unbox = require('./lib/unbox.js');


/**
 *
 * @param options
 * @constructor
 */
var ParseStream = function (endCallback) {
	this.boxes = [];

	Writable.call(this, {objectMode: true});

	this.endCallback = endCallback;

	this.on('finish', this.onEnd.bind(this))

}

util.inherits(ParseStream, Writable);


/**
 *
 * @param data
 * @param enc
 * @param done
 *
 * @private
 */
ParseStream.prototype._write = function(data, enc, done) {

	if (this.boxFrag) {

		var dataToConcat = data;

		if (this.boxFrag.currentLength + dataToConcat.length > this.boxFrag.length ) {
			var remainingBuffer = this.boxFrag.currentLength + data.length - this.boxFrag.length;
			dataToConcat = data.slice(0, data.length - remainingBuffer);
			var dataRemains = data.slice( data.length - remainingBuffer);
		}

		this.boxFrag.currentLength += dataToConcat.length;

		// concat only what needed
		this.boxFrag.data = Buffer.concat([this.boxFrag.data, dataToConcat]);

		// remaining data passed to boxparser
		if (this.boxFrag.currentLength === this.boxFrag.length) {
			this.boxes.push(this.boxFrag);
			this.boxFrag = null;
		}

		if (dataRemains && dataRemains.length > 0) {
			this.parseBox(dataRemains);
		}

		done();

	} else {

		this.parseBox(data);


		done();
	}
};

ParseStream.prototype.parseBox = function (data) {
	var boxFragment = unbox(data, 0, this.boxes.push.bind(this.boxes));

	if (boxFragment) {
		this.boxFrag = boxFragment;
	}
}


ParseStream.prototype.onEnd = function () {
	this.endCallback(null, unflat(this.boxes));
}

module.exports = ParseStream;
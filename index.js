var util = require('util');
var Writable = require('stream').Writable;
var unflat = require('./lib/unflat.js');
var boxParser = require('./lib/boxParser.js');


/**
 *
 * @param options
 * @constructor
 */
var UnboxingWriteStream = function (endCallback) {
	Writable.call(this, {objectMode: true});

	this.endCallback = endCallback;

	this.on('finish', this.onEnd.bind(this))

}

util.inherits(UnboxingWriteStream, Writable);

UnboxingWriteStream.prototype.boxes = [];

/**
 *
 * @param data
 * @param enc
 * @param done
 *
 * @private
 */
UnboxingWriteStream.prototype._write = function(data, enc, done) {

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

UnboxingWriteStream.prototype.parseBox = function (data) {
	var boxFragment = boxParser(data, 0, this.boxes.push.bind(this.boxes));

	if (boxFragment) {
		this.boxFrag = boxFragment;
	}
}


UnboxingWriteStream.prototype.onEnd = function () {
	this.endCallback(null, unflat(this.boxes));
}

module.exports = UnboxingWriteStream;
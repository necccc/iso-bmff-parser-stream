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

	if (this.currentBoxFragment) {
		this.currentBoxFragment.currentLength += data.length;
		this.currentBoxFragment.data = Buffer.concat([this.currentBoxFragment.data, data]);

		if(this.currentBoxFragment.currentLength === this.currentBoxFragment.length) {
			this.boxes.push(this.currentBoxFragment);
			this.currentBoxFragment = null;
		}

		done();
		return;
	}

	var boxFragment = boxParser(data, 'root', this.boxes.push.bind(this.boxes));

	if (boxFragment) {
		this.currentBoxFragment = boxFragment;
	}

	done();
};


UnboxingWriteStream.prototype.onEnd = function () {
	this.endCallback(null, unflat(this.boxes));
}

module.exports = UnboxingWriteStream;
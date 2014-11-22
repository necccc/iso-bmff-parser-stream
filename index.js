var util = require('util');
var bitparser = require('bitparser');
var Transform = require('stream').Transform;

var isobmff = require('./isobmff.json');

/**
 *
 * @param integer
 * @returns {string}
 */
function getBoxType(integer) {
	var type = '',
		hexWord = integer.toString(16),
		hexWordLength = hexWord.length,
		i;

	for (i = 0; i < hexWordLength; i += 2) {
		type += String.fromCharCode(parseInt(hexWord.substr(i, 2), 16));
	}

	return type;
}

/**
 *
 * @param buf
 * @param parent
 * @param output
 * @returns {{currentLength: *, length: *, parent: *, type: *, data: *}}
 */
function bufferBoxParser (buf, parent, output) {

	var bp = bitparser(buf),
		bufferLength = bp.buffer.length,
		length,
		boxType,
		boxData;


	while (bufferLength > 0) {
		length = bp.readBits(32); // return byteLength,
		boxType = getBoxType(bp.readBits(32));

		if (bufferLength - length < 0) {
			return {
				currentLength: bufferLength,
				length: length,
				parent: parent,
				type: boxType,
				data: bp.getBuffer(bufferLength)
			};
			break;
		}


		boxData = bp.getBuffer(length - 8);

		if (isobmff.boxContainers.indexOf(boxType) > -1) {
			bufferBoxParser(boxData, boxType, output);
		}

		bufferLength -= length;

		output({
			length: length,
			parent: parent,
			type: boxType,
			data: boxData
		})


	}
}

/**
 *
 * @param options
 * @constructor
 */
var BinaryTransformStream = function (options) {
	Transform.call(this, {objectMode: true});
}

util.inherits(BinaryTransformStream, Transform);

/**
 *
 * @param data
 * @param enc
 * @param done
 *
 * @private
 */
BinaryTransformStream.prototype._transform = function(data, enc, done) {

	if (this.currentBoxFragment) {
		this.currentBoxFragment.currentLength += data.length;
		this.currentBoxFragment.data = Buffer.concat([this.currentBoxFragment.data, data]);

		if(this.currentBoxFragment.currentLength === this.currentBoxFragment.length) {
			this.push(this.currentBoxFragment);
			this.currentBoxFragment = null;
		}

		done();
		return;
	}

	var boxFragment = bufferBoxParser(data, null, this.push.bind(this));

	if (boxFragment) {
		this.currentBoxFragment = boxFragment;
	}

	done();
};

module.exports = BinaryTransformStream;
var bitparser = require('bitparser');
var getBoxType = require('./getBoxType.js');
var isobmff = require('../isobmff.json');
/**
 *
 * @param buf
 * @param parents
 * @param output
 * @returns {{currentLength: *, length: *, parents: *, type: *, data: *}}
 */
function boxParser (buf, parents, output) {

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
				parents: parents,
				type: boxType,
				data: bp.getBuffer(bufferLength)
			};
			break;
		}


		boxData = bp.getBuffer(length - 8);

		if (isobmff.boxContainers.indexOf(boxType) > -1) {
			boxParser(boxData, parents + '.' + boxType , output);
			bufferLength -= length;
			return;
		}

		bufferLength -= length;

		output({
			length: length,
			parents: parents,
			type: boxType,
			data: boxData
		})


	}
}


module.exports = boxParser;
var bitparser = require('bitparser');
var getBoxType = require('./getBoxType.js');
var isobmff = require('../isobmff.json');

var id = 0;

function getId () {
	id += 1;
	return id;
}

/**
 *
 * @param buf
 * @param parent
 * @param output
 * @returns {{currentLength: *, length: *, parent: *, type: *, data: *}}
 */
function boxParser (buf, parent, output) {

	var bp = bitparser(buf),
		bufferLength = bp.buffer.length,
		length,
		boxType,
		typeData,
		boxData,
		id;

	while (bufferLength > 0) {

		length = bp.readBits(32); // return byteLength,
		typeData = bp.readBits(32);
		boxType = getBoxType(typeData);

		if (!boxType) return;

		if (bufferLength - length < 0) {
			id = getId();
			return {
				id: id,
				currentLength: bufferLength,
				length: length,
				parent: parent,
				type: boxType,
				data: bp.getBuffer(bufferLength)
			};
			break;
		}

		boxData = bp.getBuffer(length - 8);

		bufferLength -= length;

		id = getId();

		if (isobmff.boxContainers.indexOf(boxType) > -1) {
			boxParser(boxData, id, output);
		}

		output({
			id: id,
			length: length,
			parent: parent,
			type: boxType,
			data: boxData
		});



	}
}


module.exports = boxParser;
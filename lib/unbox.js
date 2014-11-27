var bitparser = require('bitparser');
var getBoxType = require('./getBoxType.js');
var boxParse = require('./boxparse.js');
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
function unbox (buf, parent, output) {

	var bp = bitparser(buf),
		bufferLength = bp.buffer.length,
		length,
		boxType,
		typeData,
		boxData,
		id;

	while (bufferLength > 0) {

		length = bp.readBits(32); // returns byteLength,
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

		boxData = boxParse(boxType, boxData);

		if (boxParse.isBoxContainer(boxType)) {
			unbox(boxData, id, output);
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


module.exports = unbox;
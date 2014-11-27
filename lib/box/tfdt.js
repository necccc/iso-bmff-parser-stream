var bitparser = require('bitparser');


module.exports = function (data) {

	var bp = bitparser(data),
		version = bp.readBits(8),
		flags = bp.readBits(24),
		baseMediaDecodeTime = bp.readBits(32);

	/*

	 TFDT

	 baseMediaDecodeTime

	 8 bit version
	 24 bit flags

	 00 00 00 00
	 00 02 b0 00 // ez az adat, ami hex 0002b000 ami 02b000 ami decimalisan 176128

	 */

	return {
		version: version,
		flags: flags,
		baseMediaDecodeTime: baseMediaDecodeTime
	};
}
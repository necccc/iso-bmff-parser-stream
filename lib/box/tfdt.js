var bitparser = require('bitparser');
var intobuffer = require('intobuffer');

function tfdt_parse (data) {

	var bp = bitparser(data),
		version = bp.readBits(8),
		flags = bp.readBits(24),
		baseMediaDecodeTime = bp.readBits(version === 0 ? 32 : 64);

	return {
		version: version,
		flags: flags,
		baseMediaDecodeTime: baseMediaDecodeTime
	};
}

function tfdt_build (data) {

	return Buffer.concat([
		intobuffer(data.version, 1),
		intobuffer(data.flags, 3),
		intobuffer(data.baseMediaDecodeTime, data.version === 0 ? 4 : 8)
	]);

}

module.exports = {
	parse: tfdt_parse,
	build: tfdt_build
};
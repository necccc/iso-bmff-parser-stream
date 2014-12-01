var bitparser = require('bitparser');
var intobuffer = require('intobuffer');


function sidx_parse (data) {

	var bp = bitparser(data),
		version = bp.readBits(8),
		flags = bp.readBits(24),
		referenceId = bp.readBits(32),
		timeScale = bp.readBits(32),
		earliestPresentationTime = bp.readBits(version === 0 ? 32 : 64),
		firstOffset = bp.readBits(32),
		__reserved = bp.readBits(16),
		entryCount = bp.readBits(16),
		entries = [];

	for (var i = entryCount; i > 0; i =i -1 ) {
		entries.push({
			referencedSize: bp.readBits(32),
			subSegmentDuration: bp.readBits(32),
			unused: bp.getBuffer(4)
		});

		// dump the rest we dont need now

	}

	return {
		version: version,
		flags: flags,
		referenceId: referenceId,
		timeScale: timeScale,
		earliestPresentationTime: earliestPresentationTime,
		firstOffset: firstOffset,
		entries: entries
	};
}


function sidx_build (data) {

	var buf = Buffer.concat([
		intobuffer(data.version, 1),
		intobuffer(data.flags, 3),
		intobuffer(data.referenceId, 4),
		intobuffer(data.timeScale, 4),
		intobuffer(data.earliestPresentationTime, data.version === 0 ? 4 : 8),
		intobuffer(data.firstOffset, 4),
		intobuffer(0, 2),
		intobuffer(data.entries.length, 2)
	]);

	for (var i = 0; i < data.entries.length ; i++) {

		buf = Buffer.concat([
			buf,
			intobuffer(data.entries[i].referencedSize, 4),
			intobuffer(data.entries[i].subSegmentDuration, 4),
			data.entries[i].unused
		])

	}

	return buf;

}


module.exports = {
	parse: sidx_parse,
	build: sidx_build
};
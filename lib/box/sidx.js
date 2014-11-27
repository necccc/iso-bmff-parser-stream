var bitparser = require('bitparser');

module.exports = function (data) {

	var bp = bitparser(data),
		version = bp.readBits(8),
		flags = bp.readBits(24),
		referenceId = bp.readBits(32),
		timeScale = bp.readBits(32),
		earliestPresentationTime = bp.readBits(32),
		firstOffset = bp.readBits(32),
		__reserved = bp.readBits(16),
		entryCount = bp.readBits(16),
		entries = [];

	for (var i = entryCount; i > 0; i =i -1 ) {
		entries.push({
			referencedSize: bp.readBits(32),
			subSegmentDuration: bp.readBits(32)
		});

		// dump the rest we dont need now
		bp.getBuffer(4);
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
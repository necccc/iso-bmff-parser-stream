

var chunkFile = './media/video.m4s'
//var chunkFile = './media/audio.m4s'
//var chunkFile = './media/video_dashinit.mp4';

var fs = require('fs');
var isoBmff = require('../index.js');

var timer = []

timer.push(+new Date())

var chunkStream = fs.createReadStream(chunkFile, {
	flags: 'r',
	encoding: null,
	fd: null,
	mode: 0666,
	autoClose: true
});

var unboxing = new isoBmff.Parser(parseDone);

chunkStream
	.pipe(unboxing);


function parseDone (err, data) {
	timer.push(+new Date())
	new isoBmff.Builder(data, buildDone);

}

function buildDone (err, data) {
	timer.push(+new Date())
	fs.writeFile(chunkFile.replace('media/', ''), data, function (err) {

		timer.push(+new Date())

		console.log('complete time (ms)', timer[3] - timer[0] );
		console.log('read, parse (ms)',timer[1] - timer[0] );
		console.log('rebuild (ms)',timer[2] - timer[1] );
		console.log('write (ms)',timer[3] - timer[2] );

	});

}
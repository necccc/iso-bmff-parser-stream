

var chunkFile = './media/video.m4s'
//var chunkFile = './media/audio.m4s'
//var chunkFile = './media/video_dashinit.mp4';

var fs = require('fs');
var isoBmff = require('../index.js');

var chunkStream = fs.createReadStream(chunkFile, {
	flags: 'r',
	encoding: null,
	fd: null,
	mode: 0666,
	autoClose: true
});

var unboxing = new isoBmff.Parser(function (err, data) {


	//console.log(data.root.moof.traf );

	// console.dir(JSON.stringify(data));
	console.log(JSON.stringify(data));
});

chunkStream
	.pipe(unboxing);



var chunkFile = './media/video.m4s'

var fs = require('fs');
var isoBmff = require('../index.js');

var chunkStream = fs.createReadStream(chunkFile, {
	flags: 'r',
	encoding: null,
	fd: null,
	mode: 0666,
	autoClose: true
});

var unboxing = new isoBmff(function (err, data) {
//	console.log(data);
	//console.log(data.root.moof.traf );
})


chunkStream
	.pipe(unboxing);








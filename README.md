iso-bmff-parser-stream
======================

Parse an ISO BMFF using nodejs

Returns a structured javascript object of iso-bmff boxes

**work in progress**

## usage

```
var chunkFile = './media/audio.m4s'

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
	console.dir(JSON.stringify(data));
})


chunkStream
	.pipe(unboxing);

```
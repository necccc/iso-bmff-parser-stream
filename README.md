iso-bmff-parser-stream
======================

Parse an ISO BMFF using nodejs

work in progress 

## planned usage

var isobmff = require('iso-bmff')
var media = require('fs').createReadStream('movie.mp4')

media.on('end', function(data) {
  console.log(data.boxes.moof.traf.tfdt)
}

media.pipe(isobmff)

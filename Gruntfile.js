/* global module:false */
module.exports = function(grunt) {
	var port = grunt.option('port') || 8000;
	// Project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		release: {
			options: {
				bump: true, //default: true
				file: 'package.json', //default: package.json
				add: true, //default: true
				commit: true, //default: true
				push: true, //default: true
				tag: false, //default: true
				pushTags: false, //default: true

				npm: true, //default: true
				npmtag: true, //default: no tag

			}
		}
	});

	// Dependencies
	grunt.loadNpmTasks( 'grunt-release' );

	// Default task
	grunt.registerTask( 'default', [ 'release' ] );

};

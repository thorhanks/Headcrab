module.exports = function(grunt)
{
	grunt.initConfig(
	{
		copy:
		{
			main:
			{
				files:
				[
					// Chrome
					{ src: ['Logo/*.png'], dest: 'publish/Chrome/', expand: true, flatten: true, filter: 'isFile' },
					{ src: [ 'manifest.chrome.json'], dest: 'publish/Chrome/', expand: true, flatten: true, filter: 'isFile', rename: function(dest, src){ return dest + src.replace('.chrome', ''); } },
					// Firefox
					{ src: [ 'Logo/Logo_128x128.png'], dest: 'publish/Firefox/', expand: true, flatten: true, filter: 'isFile', rename: function(dest, src){ return dest + src.replace('Logo_128x128', 'icon'); } },
					{ src: [ 'manifest.firefox.json'], dest: 'publish/Firefox/', expand: true, flatten: true, filter: 'isFile', rename: function(dest, src){ return dest + src.replace('.firefox', ''); } }
				]
			}
		},
		uglify:
		{
			target:
			{
				files:
				{
					'publish/Chrome/content.js': ['ContentScripts/*.js'],
					'publish/Firefox/content.js': ['ContentScripts/*.js']
				}
			}
		},
		cssmin:
		{
			target:
			{
				files:
				{
					'publish/Chrome/content.css': ['ContentScripts/*.css'],
					'publish/Firefox/content.css': ['ContentScripts/*.css']
				}
			}
		},
		compress:
		{
			chrome:
			{
				options: { mode: 'zip', archive: 'publish/Chrome/Headcrab.zip' },
				files: [{ src: ['publish/Chrome/*', '*.pem'], expand: true, flatten: true }]
			},
			firefox:
			{
				options: { mode: 'zip', archive: 'publish/Firefox/Headcrab.xpi' },
				files: [{ src: ['publish/Firefox/*'], expand: true, flatten: true }]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.registerTask('default', ['copy', 'uglify', 'cssmin', 'compress']);
};

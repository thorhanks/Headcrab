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
					{ src: [ 'manifest.chrome.json'], dest: 'publish/Chrome/', expand: true, flatten: true, filter: 'isFile', rename: function(dest, src){ return dest + src.replace('chrome', ''); } },
					{ src: ['*.pem'], dest: 'publish/Chrome/', expand: true, flatten: true, filter: 'isFile' },
					// Firefox
					{ src: [ 'Logo/Logo_128x128.png'], dest: 'publish/Firefox/', expand: true, flatten: true, filter: 'isFile', rename: function(dest, src){ return dest + src.replace('Logo_128x128', 'icon'); } },
					{ src: [ 'manifest.firefox.json'], dest: 'publish/Firefox/', expand: true, flatten: true, filter: 'isFile', rename: function(dest, src){ return dest + src.replace('firefox', ''); } }
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
			main:
			{
				files:
				[
					{ src: ['publish/Chrome/*'], dest: 'publish/Chrome/Headcrab.zip', expand: true, flatten: true },
					{ src: ['publish/Firefox/*'], dest: 'publish/Firefox/Headcrab.zip.xpi', expand: true, flatten: true }
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.registerTask('default', ['copy', 'uglify', 'cssmin', 'compress']);
};

module.exports = function(grunt) {




	grunt.initConfig({




		pkg: grunt.file.readJSON('package.json'),




		stylus: {

			compile: {

				options: {
					paths: ['components', 'css'],
					'include css': true
				},

				files: {
					'build/app.css': 'css/app.styl'
				}

			}

		},




		autoprefixer: {

			compile: {

				options: {
					browsers: ['last <%= autoprefixerVersions %> version', '> 1%', 'ie 8', 'ie 7']
				},

				files: {
					'build/app.css': 'build/app.css'
				}

			}

		},




		cssmin: {

			compile: {
				
				files: {
					'build/app.css': ['build/app.css']
				}

			}

		},<% if(useJade) { %>




		jade: {

			compile: {

				data: {
					debug: false
				},

				files: {
					'index.html': ['views/index.jade'],
				}

			}

		},




		<% } %>uglify: {

			compile: {

				files: {
					'build/app.js': [
						<% if(useJquery) { %>'components/jquery/index.js',<% } %>
						'js/app.js'
					]
				}

			}

		},




		watch: {

			css: {
				files: ['css/**'],
				tasks: ['css']
			},

			js: {
				files: ['js/**'],
				tasks: ['js']
			},<% if(useJade) { %>

			html: {
				files: ['views/**'],
				tasks: ['html']
			},

			<% } %>all: {
				files: ['gruntfile.js'],
				tasks: ['default']
			}

		}




	});




	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	<% if(useJade) { %>grunt.loadNpmTasks('grunt-contrib-jade');<% } %>




	grunt.registerTask('css', ['stylus', 'autoprefixer', 'cssmin']);
	grunt.registerTask('js', ['uglify']);
	<% if(useJade) { %>grunt.registerTask('html', ['jade']);<% } %>
	grunt.registerTask('default', ['css', 'js'<% if(useJade) { %>, 'html'<% } %>]);




};
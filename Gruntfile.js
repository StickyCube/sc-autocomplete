module.exports = function (grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		config: {
			dirs: {
				src: 'src',
				srcScript: '<%= config.dirs.src %>/js',
				srcStyle: '<%= config.dirs.src %>/css',
				srcHtml: '<%= config.dirs.src %>/html',
				
				build: 'builds',
				buildLatest: '<%= config.dirs.build %>/<%= pkg.version %>',
				buildTemp: '<%= config.dirs.buildLatest %>/temp',

				dist: 'dist',

				example: 'examples',
				exampleStyle: '<%= config.dirs.example %>/styles',
				exampleScript: '<%= config.dirs.example %>/scripts',

				libs: 'libs'
			},

			filenames: {
				jqlatest: '<%= config.buildPrefix %>.<%= pkg.version %>.jquery.min.js',
				nglatest: '<%= config.buildPrefix %>.<%= pkg.version %>.angular.min.js',
				ngtpllatest: '<%= config.buildPrefix %>.<%= pkg.version %>.angular.tpls.min.js',
				cssLatest: '<%= config.buildPrefix %>.<%= pkg.version %>.min.css',

				jqlib: 'jquery.2.1.4.min.js',
				nglib: 'angular.1.3.15.min.js'
			},

			cdns: {
				bootstrap: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css'
			},

			buildPrefix: 'sc-autocomplete',
		},

		copy: {
			examples: {
				files: [{
					expand: true,
					cwd: '<%= config.dirs.buildLatest %>',
					src: ['*.js'],
					dest: '<%= config.dirs.exampleScript %>'
				}, {
					expand: true,
					cwd: '<%= config.dirs.buildLatest %>',
					src: ['*.css'],
					dest: '<%= config.dirs.exampleStyle %>'
				}, {
					expand: true,
					cwd: '<%= config.dirs.libs %>',
					src: ['*.js'],
					dest: '<%= config.dirs.exampleScript %>'
				}, {
					expand: true,
					cwd: '<%= config.dirs.srcScript %>',
					src: ['*-example.js'],
					dest: '<%= config.dirs.exampleScript %>'
				}]
			},
			build: {
				files:[{
					expand: true,
					cwd: '<%= config.dirs.srcHtml %>',
					src: ['sc-autocomplete.html'],
					dest: '<%= config.dirs.buildLatest %>'
				}]
			},
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.dirs.buildLatest %>',
					src: ['*'],
					dest: '<%= config.dirs.dist %>'
				}]
			}
		},

		clean: {
			build: ['<%= config.dirs.buildTemp %>'],
			all:{
				src: ['<%= config.dirs.build %>', '<%= config.dirs.dist %>', '<%= config.dirs.example %>']
			}
		},

		less: {
			build: {
				options: { compress: true },
				files: {
					'<%= config.dirs.buildLatest %>/<%= config.filenames.cssLatest %>': '<%= config.dirs.srcStyle %>/sc-autocomplete.less'
				}
			},
			prodCompressed: {
				options: { compress: true },
				files: {
					'<%= config.dirs.dist %>/css/<%= config.buildPrefix %>.min.css': '<%= config.dirs.srcStyle %>/sc-autocomplete.less'
				}
			},
			prodUncompressed: {
				options: { compress: false },
				files: {
					'<%= config.dirs.dist %>/css/<%= config.buildPrefix %>.css': '<%= config.dirs.srcStyle %>/sc-autocomplete.less'
				}
			},
			examples: {
				options: { compress: false },
				files: {
					'<%= config.dirs.exampleStyle %>/sc-autocomplete-example.css': '<%= config.dirs.srcStyle %>/sc-autocomplete-examples.less'
				}
			}
		},

		ngtemplates: {
			build: {
				cwd: '<%= config.dirs.srcHtml %>',
				src: 'sc-autocomplete.html',
				dest: '<%= config.dirs.buildTemp %>/template.temp.js',
				options: {
					module: 'sc-autocomplete',
					htmlmin: { collapseWhitespace: true }
				}
			}
		},

		htmlbuild: {
			examplejquery: {
				src: '<%= config.dirs.srcHtml %>/jquery-example.html',
				dest: '<%= config.dirs.example %>',
				options: {
					scripts: {
						files: [
							'<%= config.dirs.exampleScript %>/<%= config.filenames.jqlib %>',
							'<%= config.dirs.exampleScript %>/<%= config.filenames.jqlatest %>',
							'<%= config.dirs.exampleScript %>/jquery-example.js'
						]
					},
					styles: {
						files: [
							'<%= config.cdns.bootstrap %>',
							'<%= config.dirs.exampleStyle %>/sc-autocomplete.min.css',
							'<%= config.dirs.exampleStyle %>/<%= config.filenames.cssLatest %>'
						]
					}
				}
			},
			exampleangulartpl: {
				src: '<%= config.dirs.srcHtml %>/angular-example.html',
				dest: '<%= config.dirs.example %>/',
				options: {
					scripts: {
						files: [
							'<%= config.dirs.exampleScript %>/<%= config.filenames.nglib %>',
							'<%= config.dirs.exampleScript %>/<%= config.filenames.ngtpllatest %>',
							'<%= config.dirs.exampleScript %>/angular-example.js'
						]
					},
					styles: {
						files: [
							'<%= config.cdns.bootstrap %>',
							'<%= config.dirs.exampleStyle %>/sc-autocomplete.min.css',
							'<%= config.dirs.exampleStyle %>/<%= config.filenames.cssLatest %>'
						]
					}
				}
			},
		},

		uglify: {
			options: {
				mangleProperties: false,
				preserveComments: false,
				enclose: true,
				compress: {
					drop_console: true
				}
			},

			jQueryMin: {
				files: {
					'<%= config.dirs.buildLatest %>/<%= config.filenames.jqlatest %>': [
						'<%= config.dirs.srcScript %>/autocomplete.js',
						'<%= config.dirs.srcScript %>/sc-autocomplete.jquery.js'
					]
				}
			},


			angularTplMin: {
				files: {
					'<%= config.dirs.buildLatest %>/<%= config.filenames.ngtpllatest %>': [
						'<%= config.dirs.srcScript %>/autocomplete.js',
						'<%= config.dirs.srcScript %>/sc-autocomplete.angular.js',
						'<%= config.dirs.buildTemp %>/template.temp.js'
					]
				}
			},

			angularMin: {
				files: {
					'<%= config.dirs.buildLatest %>/<%= config.filenames.nglatest %>': [
						'<%= config.dirs.srcScript %>/autocomplete.js',
						'<%= config.dirs.srcScript %>/sc-autocomplete.angular.js'
					]
				}
			}
		},

		concat: {

			options: {
				banner: '(function () {',
				footer: '})();'
			},

			angularTpl: {
				src: [
					'<%= config.dirs.srcScript %>/autocomplete.js',
					'<%= config.dirs.srcScript %>/sc-autocomplete.angular.js',
					'<%= config.dirs.buildTemp %>/template.temp.js'
				],
				dest: '<%= config.dirs.buildLatest %>/<%= config.buildPrefix %>.<%= pkg.version %>.angular.tpls.js'
			},

			angular: {
				src: [
					'<%= config.dirs.srcScript %>/autocomplete.js',
					'<%= config.dirs.srcScript %>/sc-autocomplete.angular.js'
				],
				dest: '<%= config.dirs.buildLatest %>/<%= config.buildPrefix %>.<%= pkg.version %>.angular.js'
			},

			jQuery: {
				src: [
					'<%= config.dirs.srcScript %>/autocomplete.js',
					'<%= config.dirs.srcScript %>/sc-autocomplete.jquery.js'
				],
				dest: '<%= config.dirs.buildLatest %>/<%= config.buildPrefix %>.<%= pkg.version %>.jquery.js'
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-angular-templates');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-html-build');

	grunt.registerTask('rename', function () {
		var version = grunt.file.readJSON('package.json').version;
		var regex = new RegExp('\.' + version.replace('.', '\.'), 'ig');
		grunt.file.recurse('dist', function (abs, root, sub, filename) {
			if (filename.indexOf(version) > -1) {
				grunt.file.copy(abs, root + '/' + filename.replace(regex, ''));
				grunt.file.delete(abs);
			}
		});
	});

	grunt.registerTask('build', [
		'ngtemplates:build',
		'concat:jQuery',
		'concat:angular',
		'concat:angularTpl',
		'uglify:jQueryMin',
		'uglify:angularTplMin',
		'uglify:angularMin',
		'copy:build',
		'less:build',
		'clean:build'
	]);

	grunt.registerTask('examples', [
		'less:examples',
		'copy:examples',
		'htmlbuild',
	]);

	grunt.registerTask('all', [
		'build',
		'examples'
	]);

	grunt.registerTask('cleanup', [
		'clean:all'
	]);

	grunt.registerTask('default', [
		'clean:all',
		'build',
		'examples'
	]);

	grunt.registerTask('prod', [
		'clean:all',
		'build',
		'copy:dist',
		'rename'
	]);
};


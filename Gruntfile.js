module.exports = function(grunt)
{
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        concat: {
			global: {
				ignores: '',
				src: [
					'js/vendor/jquery-1.11.1.js',
					'js/vendor/jquery-ui.js',
					'js/vendor/**/*.js',
					'!js/vendor/modernizr-2.6.2.min.js'
				],
				dest: 'www/js/global.js'
			},
			wedding: {
				src: 'js/*.js',
				dest: 'www/js/wedding.js'
			},
            options: {
                banner: '/*\nWedding v <%= pkg.version %> - <%= grunt.template.today("dd.mm.yyyy") %> \n'+
                    'Copyright (c) <%= grunt.template.today("yyyy") %> \n' +
                    'ShabbTech\n*/\n\n'
            }
        },

        uglify: {
            global: {
                files: {
                    'www/js/global.min.js': 'www/js/global.js'
                }
            },
			wedding: {
				files: {
					'www/js/wedding.min.js': 'www/js/wedding.js'
				}
			}
        },

        copy:
        {
			modernizrJs:{
				files: [{
					expand: true,
					cwd: 'js/vendor',
					src: 'modernizr-2.6.2.min.js',
					dest: 'www/js/',
					filter: 'isFile'
				}]
			},
			specific:{
				files: [{
					expand: true,
					cwd: 'js/',
					src: '*.js',
					dest: 'www/js/',
					filter: 'isFile'
				}]
			}
        },

        jshint: {
            global: {
                src:    'js/*.js'
            }
        },

        watch: {
            js: {
                files: ['js/**/*.js'],
                tasks: ['concat','copy'],
                options: {
                    nospawn: false
                }
            },
            scss: {
                files: 'compass/scss/**/*.scss',
                tasks: ['compass:dev'],
                options: {
                    nospawn: false
                }
            }
        },


        clean: {
            short: [
                'www/js/*',
                'www/css/*'
            ],
            options: {
                force: true
            }
        },



        compass: {
            build: {
                options: {
                    basePath: 'compass',
                    config: 'compass/config.rb',
                    outputStyle: 'compressed'
                }
            },
            dev: {
                options: {
                    basePath: 'compass',
                    config: 'compass/config.rb',
                    outputStyle: 'expanded'
                }
            }
        }


        /*
         // Unit tests.
         nodeunit: {
         tests: ['test/*_test.js']
         }*/
    });


    grunt.registerTask("build", [
        "jshint:global",
    //    "clean",
        "concat",
	//	"copy:modernizrJs",
    //    "uglify",
        "compass:build"
    ]);

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
};
module.exports = function (grunt) {
    grunt.initConfig({
        jshint: {
            all: ['js/*.js', '!js/min.js']
        },
        uglify: {
            dist: {
                files: {
                    'js/min.js': ['js/*.js']
                }
            }
        },
        cssmin: {
            combine: {
                files: {
                'css/min.css': ['css/common.css', 'css/home.css' ]
                }
            }
        },
         sass: {
                dist: {
                    options: {
                        style: 'expanded',
                        compass: true
                    },
                    files: [{
                        "expand": true,
                        "cwd": "sass/",
                        "src": ['**/*.scss'],
                        "dest": "css/",
                        "ext": ".css"
                    }]
                }
            },
            compass: {
                dist: {
                  options: {
                    config: 'config.rb',  // css_dir = 'dev/css'
                    cssDir: 'css'
                  }
                }
              },

        watch: {
            sass: {
                files: 'sass/*.scss',
                tasks: ['sass']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass-import');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.registerTask('default', ['jshint', 'uglify', 'cssmin', 'sass', 'watch' , 'compass']);

}

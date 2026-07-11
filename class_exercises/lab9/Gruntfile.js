module.exports = function(grunt) {
    grunt.initConfig({
        less: {
            development: {
                customFunctions: {
                    static: (lessObject, name) => {
                        return 'url("' + require("./lib/static").map(name.value) + '")'
                    }
                },
                files: {
                    "public/css/test.css": "less/test.less"
                }
            }
        },
        uglify: { 
            all: {
                files: {
                    "public/js/main.min.js": ['public/js/**/*.js', '!public/js/**/main*.js']
                }
            }
        },    
        cssmin: {
            combine: { 
                files: { 
                    'public/css/main.css': ['public/css/**/*.css', '!public/css/main*.css']
                }
            },
            minify: {
                src: 'public/css/main.css', 
                dest: 'public/css/main.min.css',
            }
        },
        hashres:{
            options:{
            fileNameFormat: '${name}.${hash}.${ext}'
            },
            all: { 
                    src: [
                    'public/js/main.min.js',
                    'public/css/main.min.css', 
                ],
                dest: ['views/layouts/main.handlebars',]
            }
        }
    })
    //... , 
    let static = ['grunt-contrib-less', 'grunt-contrib-uglify', 'grunt-contrib-cssmin', 'grunt-hashres']
    static.forEach(function(task) {
        grunt. loadNpmTasks(task); 
    });
    //  grunt. loadNpmTasks('grunt-contrib-less'); 
    grunt.registerTask('default', ['cafenocha', 'jshint', 'exec']); 
    grunt.registerTask('static', ['less', 'uglify', 'cssmin', "hashres"]);
}
    
    
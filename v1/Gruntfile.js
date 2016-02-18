module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                separator: "<%= current_file_name %>"
            },
            dist: {
                src: [ 'assets/js/origam/input.js', 'assets/js/origam/select.js','assets/js/origam/close.js','assets/js/origam/tooltip.js','assets/js/origam/table.js','assets/js/origam/*.js'],
                dest: 'dist/js/src/<%= pkg.name %>.js'
            }
        },

        csso: {
            dynamic_mappings: {
                expand: true,
                cwd: 'assets/css/',
                src: ['*.css','!*.min.css'],
                dest: 'dist/css/',
                ext: '.min.css'
            }
        },

        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'assets/fonts/',
                        src: '**',
                        dest: 'dist/fonts/',
                        flatten: true,
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: 'assets/images/',
                        src: '**',
                        dest: 'dist/images/',
                        flatten: true,
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: 'dist/js/cpr/',
                        src: ['**/*.js'],
                        dest: 'dist/js/',
                        rename: function(dest, src) {
                            return dest+src.replace('.js', '.min.js');
                        }
                    }
                ]
            }
        },

        uglify: {
            build: {
                files: [{
                    expand: true,
                    src: '**/*.js',
                    dest: 'dist/js/cpr',
                    cwd: 'dist/js/src/'
                }]
            }
        },

        clean: [
            "dist/js/cpr"
        ],

        watch: {
            options: {
                livereload: true // Activons le livereload du navigateur
            },
            src: {
                files: ['assets/js/origam/*.js', 'assets/js/main/demo.js', 'assets/css/*.css', 'demo/*.html'], // Les fichiers à observer…
                tasks: ['default']  // … la commande à effectuer
            }
        }

    });

    grunt.registerTask("prepareModules", "Finds and prepares modules for concatenation.", function() {

        // get all module directories
        grunt.file.expand("assets/js/*").forEach(function (dir) {

            // get the module name from the directory name
            var dirName = dir.substr(dir.lastIndexOf('/')+1);

            if(dirName != 'origam') {

                // get the current concat object from initConfig
                var concat = grunt.config.get('concat') || {};

                // create a subtask for each module, find all src files
                // and combine into a single js file per module
                concat[dirName] = {
                    src: [dir + '/*.js'],
                    dest: 'dist/js/src/' + dirName + '.js'
                };

                // add module subtasks to the concat task in initConfig
                grunt.config.set('concat', concat);
            }
        });
    });

    // 2. Je charge ma tâche
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-csso');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // J'assigne ma tâche à la commande par défaut de Grunt
    grunt.registerTask("default", ["csso", "prepareModules", "concat", "uglify", "copy", "clean"]);
};
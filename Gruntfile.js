module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        /*
         1. Je configure ma tâche
         (la doc de chaque package vous fournira les options disponibles)
         */
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: ['js/jquery.js', 'js/plugins.js','js/main.js'],
                dest: 'js/app.js'
            }
        }

    });

    // 2. Je charge ma tâche
    grunt.loadNpmTasks('grunt-contrib-concat');

    // J'assigne ma tâche à la commande par défaut de Grunt
    grunt.registerTask('default', ['concat:dist']);
};
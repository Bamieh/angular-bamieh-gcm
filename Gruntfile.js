'use strict';
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
          banner: [
             '/*!',
             'Angular-Bamieh-GCM v<%= pkg.version %>',
             '<%= grunt.template.today("yyyy-mm-dd") %>',
             'https://github.com/Bamieh/angular-bamieh-gcm',
             '*/\n'
         ].join('\n')
      },
      my_target: {
        files: {
          'dest/bamieh-gcm.min.js': ['src/bamieh-gcm.js']
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['uglify']);
};

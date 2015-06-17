fs = require 'fs'
path = require 'path'

module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

    coffee:
      app:
        expand: true
        cwd: 'src'
        src: ['**/*.coffee']
        dest: 'lib'
        ext: '.js'

    coffeelint:
      options:
        #no_empty_param_list:
        #  level: 'error'
        max_line_length:
          level: 'ignore'

      src: ['src/**/*.coffee']
      test: ['spec/*.coffee']
      gruntfile: ['Gruntfile.coffee']


  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-coffeelint'

  grunt.registerTask('lint', ['coffeelint'])
  grunt.registerTask 'default', ['coffee','lint']
  grunt.registerTask 'clean', ->
    grunt.file.delete('lib') if grunt.file.exists('lib')

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['lib/**/*.js', 'app/**/*.js', 'public/client/**/*.js'],
        dest: 'app/appBuilt.js'
      },
      lib: {
        src: ['public/lib/underscore.js', 'public/lib/jquery.js', 'public/lib/backbone.js', 'public/lib/handlebars.js'],
        dest: 'public/libBuilt.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      my_target: {
        files: {
          'app/appBuilt.min.js' : ['app/appBuilt.js'],
          'public/libBuilt.min.js' : ['public/libBuilt.js']
        }
      }
    },

    jshint: {
      files: [
        'Gruntfile.js',
        'lib/**/*.js',
        'app/**/*.js',
        'public/client/**/*.js',
        'server-config.js',
        'server.js'
      ],
      options: {
        jshintrc: '.jshintrc',
        ignores: [
          'app/appBuilt.js',
          'app/appBuilt.min.js',
          'public/libBuilt.js',
          'public/libBuilt.min.js'
        ]
      }
    },

    cssmin: {
      minify: {
        expand: true,
        cwd: 'public/',
        src: ['*.css', '!*.min.css'],
        dest: 'public/',
        ext: '.min.css'
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'concat',
    'uglify',
    'cssmin'
  ]);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      // add your production server task here
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    'jshint',
    'concat',
    'uglify',
    'cssmin',
    'mochaTest'
  ]);


};

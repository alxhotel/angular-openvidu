/*
 * (C) Copyright 2016 Kurento (http://kurento.org/)
 *
 * All rights reserved.
 *
 */

module.exports = function (grunt) {
  var DIST_DIR = 'dist';

  var pkg = grunt.file.readJSON('package.json');

  var bower = {
    TOKEN: process.env.TOKEN,
    repository: 'git://github.com/Kurento/<%= pkg.name %>-bower.git'
  };

  // Project configuration.
  grunt.initConfig({
    pkg: pkg,
    bower: bower,

    // Plugins configuration
    clean: {
      generated_code: DIST_DIR,
      coverage: 'lib-cov',

      generated_doc: '<%= jsdoc.all.dest %>'
    },

    // Generate documentation
    jsdoc: {
      all: {
        src: ['package.json', 'README.md', 'lib/**/*.js', 'test/*.js'],
        dest: 'doc/jsdoc'
      }
    },

    // Generate instrumented version for coverage analisis
    jscoverage: {
      all: {
        expand: true,
        cwd: 'lib/',
        src: ['**/*.js'],
        dest: 'lib-cov/'
      }
    },

    jshint: {
      all: ['lib/**/*.js', "test/*.js"],
      options: {
        "curly": true,
        "indent": 2,
        "unused": true,
        "undef": true,
        "camelcase": false,
        "newcap": true,
        "node": true,
        "browser": true
      }
    },

    // Generate browser versions
    browserify: {
      options: {
        transform: ['browserify-optional']
      },

      require: {
        src: 'lib/browser.js',
        dest: DIST_DIR + '/<%= pkg.name %>_require.js'
      },

      standalone: {
        src: 'lib/browser.js',
        dest: DIST_DIR + '/<%= pkg.name %>.js',

        options: {
          browserifyOptions: {
            standalone: '<%= pkg.name %>'
          }
        }
      },

      coverage: {
        src: 'lib-cov/browser.js',
        dest: DIST_DIR + '/<%= pkg.name %>.cov.js',

        options: {
          browserifyOptions: {
            standalone: '<%= pkg.name %>'
          }
        }
      },
    },

    // Generate bower.json file from package.json data
    sync: {
      bower: {
        options: {
          sync: [
            'name', 'description', 'license', 'keywords', 'homepage',
            'repository'
          ],
          overrides: {
            authors: (pkg.author ? [pkg.author] : []).concat(pkg.contributors || []),
            main: ['js/<%= pkg.name %>.js']
          }
        }
      }
    },

    // Publish / update package info in Bower
    shell: {
      bower: {
        command: [
          'curl -X DELETE "https://bower.herokuapp.com/packages/<%= pkg.name %>?auth_token=<%= bower.TOKEN %>"',
          'node_modules/.bin/bower register <%= pkg.name %> <%= bower.repository %>',
          'node_modules/.bin/bower cache clean'
        ].join('&&')
      }
    }
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-githooks');
  grunt.loadNpmTasks('grunt-jscoverage');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-npm2bower-sync');
  grunt.loadNpmTasks('grunt-shell');

  // Alias tasks
  grunt.registerTask('default',
    ['clean', 'jsdoc', 'browserify']
  );
  grunt.registerTask('bower', ['sync:bower', 'shell:bower']);
  grunt.registerTask('coverage', ['clean:coverage', 'jscoverage',
    'browserify:coverage'
  ]);
};

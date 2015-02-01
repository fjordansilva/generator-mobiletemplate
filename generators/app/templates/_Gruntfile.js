'use strict';

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-angular-gettext');
  grunt.loadNpmTasks('grunt-ngdocs');
  grunt.loadNpmTasks('grunt-cordovacli');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);
  

  // Project configuration.
  grunt.initConfig({
    yeoman: {
      app: 'app',
      temp: 'temp',
      dist: 'www'
    },

    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      docs: {
        files: [{
          dot: true,
          src: [
            'docs/'
          ]
        }]
      },
      server: '.tmp'
    },
    /**
     * Generate AngularJs Documentation
     */
    ngdocs : {
      options: {
        dest: 'docs',
        scripts: [
          'angular.js'
        ],
        html5Mode: false,
        startPage: '/api',
        title: 'Documentation del proyecto',
        titleLink: '/api',
        bestMatch: true
      },
      api: {
        src: ['app/js/*.js', 'app/modules/**/*.js'],
        title: 'Documentation del proyecto'
      }
    },

    // Automatically inject Bower components into the app
    bowerInstall: {
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath: '<%= yeoman.app %>/'
      }
    },
    //Injects all the scripts into the index html file
    injector: {
      options: {
        addRootSlash: false,
        transform: function(filepath, index, length) {
          filepath = filepath.substr(4, filepath.length);
          switch (filepath.substr((~-filepath.lastIndexOf(".") >>> 0) + 2)) {
            case 'js':
              return filepath = '<script type="text/javascript" src="' + filepath + '"></script>';
              break;
            case 'css':
              return filepath = '<link rel="stylesheet" type="text/css" href="' + filepath + '" />';
              break;
            default:
              console.log('File extension not supported');
              break;
          }
        }
      },
      local_dependencies: {
        files: {
          'app/index.html': [
            'app/js/config.js',
            'app/js/index.js',
            'app/js/translations.js',
            'app/modules/*/*.js',
            'app/modules/*/config/**/*.js',
            'app/modules/*/services/**/*.js',
            'app/modules/*/directives/**/*.js',
            'app/modules/*/filters/**/*.js',
            'app/modules/*/controllers/**/*.js',
            'app/css/**/*.css'
          ]
        }
      }
    },
    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },
    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        'imagemin',
        'svgmin'
      ]
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'index.html',
            'modules/*/views/*.html',
            'img/{,*/}*.{webp}',
            'fonts/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/img',
          src: ['generated/*']
        }]
      },
      dev: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'index.html',
            'modules/**/*',
            'js/**/*',
            'css/**/*',
            'lib/**/*',            
            'img/{,*/}*.{webp}',
            'fonts/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/img',
          src: ['generated/*']
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/css',
        dest: '.tmp/css/',
        src: '**/*.css'
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    cssmin: {
      options: {
        root: '<%= yeoman.app %>/css/**/*.css'
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/img',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/img'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/img',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/img'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', '<%= yeoman.app %>/modules/*/views/*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '**/*.css',
          dest: '.tmp/styles/'
        }]
      }
    },
    // ngmin tries to make the code safe for minification automatically by
    // using the Angular long form for dependency injection. It doesn't work on
    // things like resolve or inject so those have to be done manually.
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/app/index.html']
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/app/js/*.js',
            '<%= yeoman.dist %>/app/modules/*/*.js',
            '<%= yeoman.dist %>/app/modules/*/config/*.js',
            '<%= yeoman.dist %>/app/modules/*/services/*.js',
            '<%= yeoman.dist %>/app/modules/*/directives/*.js',
            '<%= yeoman.dist %>/app/modules/*/filters/*.js',
            '<%= yeoman.dist %>/app/modules/*/controllers/*.js',
            '<%= yeoman.dist %>/app/css/**/*.css',
            '<%= yeoman.dist %>/app/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/css/fonts/*'
          ]
        }
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/**/*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>']
      }
    },

    // Strip comments from the distribution code
    comments: {
      dist: {
        options: {
          singleline: true,
          multiline: true
        },
        src: [ 'www/scripts/custom.js']
      },
    },

    // Compile cordova project
    cordovacli: {
      options: {
        path: "."
      },
      build_ios: {
        options: {
          command: 'build',
          platforms: ['ios']
        }
      },
      build_android: {
        options: {
          command: 'build',
          platforms: ['android']
        }
      },
      emulate_ios: {
        options: {
          command: 'emulate',
          platforms: ['ios']
        }
      },
      emulate_android: {
        options: {
          command: 'emulate',
          platforms: ['android']
        }
      }
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        '<%= yeoman.app %>/js/**/*.js',
        '<%= yeoman.app %>/modules/**/*.js'
      ],
      unitTest: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: ['<%= yeoman.app %>/modules/*/tests/unit/*.js']
      }
    },

    ngAnnotate: {
      options: {
        // Task-specific options go here.
        singleQuotes: true
      },
      app: {
        // Target-specific file lists and/or options go here.
        files: {
          '<%= yeoman.dist %>/scripts/custom.js': [
              '<%= yeoman.dist %>/scripts/custom.js'
          ]
        }
      }
    },

    uglify: {
      js: {
        src: [
            '<%= yeoman.dist %>/scripts/custom.js'
        ],
        dest: '<%= yeoman.dist %>/scripts/custom.js'
      }
    },

    // MULTILANG
    nggettext_extract: {
      pot: {
        options: {
          extensions: {
            htm: 'html',
            html: 'html',
            php: 'html',
            phtml: 'html',
            tml: 'html',
            aspx: 'html',
            js: 'js'
          },
        },
        files: {
          'po/template.pot': [
            './**/*.html',
            './**/*.aspx',
            './www/js/langkeys.js'
          ]
        }
      }
    },
    nggettext_compile: {
      all: {
        files: {
          './app/js/translations.js': ['po/*.po']
        }
      }
    }
  });

  grunt.registerTask('extract_text', [
    'nggettext_extract'
  ]);
  
  grunt.registerTask('compile_text', [
    'nggettext_compile'
  ]);

  grunt.registerTask('docs', [
    'clean:docs',
    'ngdocs'
  ]);

  grunt.registerTask('test', [
    'newer:jshint',
    'clean:server',
    'concurrent:test',
    'autoprefixer'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'bowerInstall',
    'ngdocs',
    'injector',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngmin',
    'copy:dist',
    'cdnify',
    'cssmin',
    'rev',
    'usemin',
    'htmlmin',
    'comments:dist',
    'ngAnnotate',
    'uglify'
  ]);

  grunt.registerTask('develop', [
    'clean:dist',
    'bowerInstall',
    'ngdocs',
    'injector',
    'concurrent:dist',
    'copy:dev',
    'cdnify'
  ]);
};
/**
 * Gruntfile
 *
 * If you created your Sails app with `sails new foo --linker`, 
 * the following files will be automatically injected (in order)
 * into the EJS and HTML files in your `views` and `assets` folders.
 *
 * At the top part of this file, you'll find a few of the most commonly
 * configured options, but Sails' integration with Grunt is also fully
 * customizable.  If you'd like to work with your assets differently 
 * you can change this file to do anything you like!
 *
 * More information on using Grunt to work with static assets:
 * http://gruntjs.com/configuring-tasks
 */

module.exports = function (grunt) {



  /**
   * CSS files to inject in order
   * (uses Grunt-style wildcard/glob/splat expressions)
   *
   * By default, Sails also supports LESS in development and production.
   * To use SASS/SCSS, Stylus, etc., edit the `sails-linker:devStyles` task 
   * below for more options.  For this to work, you may need to install new 
   * dependencies, e.g. `npm install grunt-contrib-sass`
   */

  var cssFilesToInject = [
    'linker/styles/font-awesome.css',
    'linker/styles/vendor/**/*.css',
    'linker/styles/main.css',
    'linker/**/*.css'
  ];


  /**
   * Javascript files to inject in order
   * (uses Grunt-style wildcard/glob/splat expressions)
   *
   * To use client-side CoffeeScript, TypeScript, etc., edit the 
   * `sails-linker:devJs` task below for more options.
   */

  var jsFilesToInject = [
    // Vendor (third-party) dependencies, in order
    'linker/js/vendor/jquery.js',
    'linker/js/vendor/angular.js',
    'linker/js/vendor/angular-resource.js',
    'linker/js/vendor/angular-sanitize.js',
    'linker/js/vendor/angular-ui-router.js',
    'linker/js/vendor/angular-foundation.js',
    'linker/js/vendor/angular-foundation-tpls.js',
    'linker/js/vendor/angular-ui-tinymce.js',
    'linker/js/vendor/angular-quick-date.js',
    'linker/js/vendor/readmore.js',

    // *->    put other dependencies here   <-*
    'linker/js/cms/models/models.js',

    // All of the rest of your app scripts imported here
    'linker/**/*.js'
  ];


  /**
   * Client-side HTML templates are injected using the sources below
   * The ordering of these templates shouldn't matter.
   * (uses Grunt-style wildcard/glob/splat expressions)
   * 
   * By default, Sails uses JST templates and precompiles them into 
   * functions for you.  If you want to use jade, handlebars, dust, etc.,
   * edit the relevant sections below.
   */

  var templateFilesToInject = [
    'linker/**/*.html'
  ];



  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  //
  // DANGER:
  //
  // With great power comes great responsibility.
  //
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////

  // Modify css file injection paths to use 
  cssFilesToInject = cssFilesToInject.map(function (path) {
    return '.tmp/public/' + path;
  });

  // Modify js file injection paths to use 
  jsFilesToInject = jsFilesToInject.map(function (path) {
    return '.tmp/public/' + path;
  });
  
  
  templateFilesToInject = templateFilesToInject.map(function (path) {
    return 'assets/' + path;
  });


  // Get path to core grunt dependencies from Sails
  var depsPath = grunt.option('gdsrc') || 'node_modules/sails/node_modules';
  grunt.loadTasks(depsPath + '/grunt-contrib-clean/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-copy/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-concat/tasks');
  grunt.loadTasks(depsPath + '/grunt-sails-linker/tasks');
  //grunt.loadTasks(depsPath + '/grunt-contrib-jst/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-watch/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-uglify/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-cssmin/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-less/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-coffee/tasks');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-conventional-changelog');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    copy: {
      dev: {
        files: [
          {
            expand: true,
            cwd: './assets',
            src: ['**/*.!(coffee|less)'],
            dest: '.tmp/public'
          },
          {
            expand: true,
            cwd: './vendor/font-awesome/fonts/',
            src: ['**/*'],
            dest: '.tmp/public/linker/fonts'
          },
          { '.tmp/public/linker/js/vendor/jquery.js':                  './vendor/jquery/dist/jquery.js' },
          { '.tmp/public/linker/js/vendor/angular.js':                 './vendor/angular/angular.js' },
          { '.tmp/public/linker/js/vendor/angular-resource.js':        './vendor/angular-resource/angular-resource.js' },
          { '.tmp/public/linker/js/vendor/angular-sanitize.js':        './vendor/angular-sanitize/angular-sanitize.js' },
          { '.tmp/public/linker/js/vendor/angular-ui-router.js':       './vendor/angular-ui-router/release/angular-ui-router.js' },
          { '.tmp/public/linker/js/vendor/angular-foundation.js':      './vendor/angular-foundation/mm-foundation.js' },
          { '.tmp/public/linker/js/vendor/angular-foundation-tpls.js': './vendor/angular-foundation/mm-foundation-tpls.js' },
          { '.tmp/public/linker/js/vendor/angular-ui-tinymce.js':      './vendor/angular-ui-tinymce/src/tinymce.js' },
          {
            expand: true,
            cwd: './vendor/tinymce',
            src: ['**/*'],
            dest: '.tmp/public/js/vendor/tinymce'
          },
          { '.tmp/public/linker/js/vendor/angular-quick-date.js': './vendor/ngQuickDate/dist/ng-quick-date.js' },
          { '.tmp/public/linker/styles/vendor/angular-quick-date.css': './vendor/ngQuickDate/dist/ng-quick-date.css' },
          { '.tmp/public/linker/js/vendor/readmore.js': './vendor/readmore/readmore.js' }
        ]
      },
      prod: {
        files: [
          {
            expand: true,
            cwd: './vendor/font-awesome/fonts/',
            src: ['**/*'],
            dest: '.tmp/public/fonts'
          }
        ]
      },
      build: {
        files: [
          {
          expand: true,
          cwd: '.tmp/public',
          src: ['**/*'],
          dest: 'www'
        }
        ]
      }
    },

    clean: {
      dev: ['.tmp/public/**'],
      build: ['www']
    },

    // jst: {
    //   dev: {

    //     // To use other sorts of templates, specify the regexp below:
    //     // options: {
    //     //   templateSettings: {
    //     //     interpolate: /\{\{(.+?)\}\}/g
    //     //   }
    //     // },

    //     files: {
    //       '.tmp/public/jst.js': templateFilesToInject
    //     }
    //   }
    // },

    ngtemplates:  {
      www:        {
        cwd:      'assets/linker/templates',
        src:      'www/**/*.html',
        dest:     '.tmp/public/templates/www.tpls.js',
        options: {
          module: 'www-templates'
        }
      },
      cms:        {
        cwd:      'assets/linker/templates',
        src:      'cms/**/*.html',
        dest:     '.tmp/public/templates/cms.tpls.js',
        options: {
          module: 'cms-templates'
        }
      }
    },

    less: {
      dev: {
        files: [
          {
            expand: true,
            cwd: 'assets/styles/',
            src: ['*.less'],
            dest: '.tmp/public/styles/',
            ext: '.css'
          }, {
            expand: true,
            cwd: 'assets/linker/styles/',
            src: ['*.less'],
            dest: '.tmp/public/linker/styles/',
            ext: '.css'
          }
        ]
      },
      fontawesome: {
        options: {
          paths: ['assets/linker/styles', 'vendor/font-awesome/less']
        },
        files: [
          { '.tmp/public/linker/styles/font-awesome.css': 'vendor/font-awesome/less/font-awesome.less' }
        ]
      }
    },
    
    coffee: {
      dev: {
        options:{
          bare:true
        },
        files: [
          {
            expand: true,
            cwd: 'assets/js/',
            src: ['**/*.coffee'],
            dest: '.tmp/public/js/',
            ext: '.js'
          }, {
            expand: true,
            cwd: 'assets/linker/js/',
            src: ['**/*.coffee'],
            dest: '.tmp/public/linker/js/',
            ext: '.js'
          }
        ]
      }
    },

    concat: {
      js: {
        src: jsFilesToInject,
        dest: '.tmp/public/concat/production.js'
      },
      css: {
        src: cssFilesToInject,
        dest: '.tmp/public/concat/production.css'
      }
    },

    uglify: {
      dist: {
        src: ['.tmp/public/concat/production.js'],
        dest: '.tmp/public/min/production.js'
      }
    },

    cssmin: {
      dist: {
        src: ['.tmp/public/concat/production.css'],
        dest: '.tmp/public/min/production.css'
      }
    },

    'sails-linker': {

      devJs: {
        options: {
          startTag: '<!--SCRIPTS-->',
          endTag: '<!--SCRIPTS END-->',
          fileTmpl: '<script src="%s"></script>',
          appRoot: '.tmp/public'
        },
        files: {
          '.tmp/public/**/*.html': jsFilesToInject,
          'views/**/*.html': jsFilesToInject,
          'views/**/*.ejs': jsFilesToInject
        }
      },

      prodJs: {
        options: {
          startTag: '<!--SCRIPTS-->',
          endTag: '<!--SCRIPTS END-->',
          fileTmpl: '<script src="%s"></script>',
          appRoot: '.tmp/public'
        },
        files: {
          '.tmp/public/**/*.html': ['.tmp/public/min/production.js'],
          'views/**/*.html': ['.tmp/public/min/production.js'],
          'views/**/*.ejs': ['.tmp/public/min/production.js']
        }
      },

      devStyles: {
        options: {
          startTag: '<!--STYLES-->',
          endTag: '<!--STYLES END-->',
          fileTmpl: '<link rel="stylesheet" href="%s">',
          appRoot: '.tmp/public'
        },

        // cssFilesToInject defined up top
        files: {
          '.tmp/public/**/*.html': cssFilesToInject,
          'views/**/*.html': cssFilesToInject,
          'views/**/*.ejs': cssFilesToInject
        }
      },

      prodStyles: {
        options: {
          startTag: '<!--STYLES-->',
          endTag: '<!--STYLES END-->',
          fileTmpl: '<link rel="stylesheet" href="%s">',
          appRoot: '.tmp/public'
        },
        files: {
          '.tmp/public/index.html': ['.tmp/public/min/production.css'],
          'views/**/*.html': ['.tmp/public/min/production.css'],
          'views/**/*.ejs': ['.tmp/public/min/production.css']
        }
      },

      // Bring in JST template object
      devTpl: {
        options: {
          startTag: '<!--TEMPLATES-->',
          endTag: '<!--TEMPLATES END-->',
          fileTmpl: '<script type="text/javascript" src="%s"></script>',
          appRoot: '.tmp/public'
        },
        files: {
          '.tmp/public/index.html': ['.tmp/public/**/*.tpls.js'],
          'views/**/*.html': ['.tmp/public/**/*.tpls.js'],
          'views/**/*.ejs': ['.tmp/public/**/*.tpls.js']
        }
      },


      /*******************************************
       * Jade linkers (TODO: clean this up)
       *******************************************/

      devJsJADE: {
        options: {
          startTag: '// SCRIPTS',
          endTag: '// SCRIPTS END',
          fileTmpl: 'script(type="text/javascript", src="%s")',
          appRoot: '.tmp/public'
        },
        files: {
          'views/**/*.jade': jsFilesToInject
        }
      },

      prodJsJADE: {
        options: {
          startTag: '// SCRIPTS',
          endTag: '// SCRIPTS END',
          fileTmpl: 'script(type="text/javascript", src="%s")',
          appRoot: '.tmp/public'
        },
        files: {
          'views/**/*.jade': ['.tmp/public/min/production.js']
        }
      },

      devStylesJADE: {
        options: {
          startTag: '// STYLES',
          endTag: '// STYLES END',
          fileTmpl: 'link(rel="stylesheet", href="%s")',
          appRoot: '.tmp/public'
        },
        files: {
          'views/**/*.jade': cssFilesToInject
        }
      },

      prodStylesJADE: {
        options: {
          startTag: '// STYLES',
          endTag: '// STYLES END',
          fileTmpl: 'link(rel="stylesheet", href="%s")',
          appRoot: '.tmp/public'
        },
        files: {
          'views/**/*.jade': ['.tmp/public/min/production.css']
        }
      },

      // Bring in JST template object
      devTplJADE: {
        options: {
          startTag: '// TEMPLATES',
          endTag: '// TEMPLATES END',
          fileTmpl: 'script(type="text/javascript", src="%s")',
          appRoot: '.tmp/public'
        },
        files: {
          'views/**/*.jade': ['.tmp/public/**/*.tpls.js']
        }
      }
      /************************************
       * Jade linker end
       ************************************/
    },

    watch: {
      api: {

        // API files to watch:
        files: ['api/**/*']
      },
      assets: {

        // Assets to watch:
        files: ['assets/**/*'],

        // When assets are changed:
        tasks: ['compileAssets', 'linkAssets']
      }
    },

    changelog: {
      options: {
        // edit here on a case-by-case basis if needed
      }
    },
  });

  // When Sails is lifted:
  grunt.registerTask('default', [
    'compileAssets',
    'linkAssets',
    'watch'
  ]);

  grunt.registerTask('compileAssets', [
    'clean:dev',
    //'jst:dev',
    'ngtemplates',
    'less',
    'copy:dev',    
    'coffee:dev'
  ]);

  grunt.registerTask('linkAssets', [
    // Update link/script/template references in `assets` index.html
    'sails-linker:devJs',
    'sails-linker:devStyles',
    'sails-linker:devTpl',
    'sails-linker:devJsJADE',
    'sails-linker:devStylesJADE',
    'sails-linker:devTplJADE'
  ]);


  // Build the assets into a web accessible folder.
  // (handy for phone gap apps, chrome extensions, etc.)
  grunt.registerTask('build', [
    'compileAssets',
    'linkAssets',
    'clean:build',
    'copy:build'
  ]);

  // When sails is lifted in production
  grunt.registerTask('prod', [
    'clean:dev',
    //'jst:dev',
    'ngtemplates',
    'less',
    'copy:dev',
    'coffee:dev',
    'copy:prod',
    'concat',
    'uglify',
    'cssmin',
    'sails-linker:prodJs',
    'sails-linker:prodStyles',
    'sails-linker:devTpl',
    'sails-linker:prodJsJADE',
    'sails-linker:prodStylesJADE',
    'sails-linker:devTplJADE'
  ]);

  grunt.registerTask('heroku:development', 'build');
  grunt.registerTask('heroku:production', 'prod');

  grunt.registerTask('heroku', 'heroku:production');

  grunt.registerTask('release', [
    'changelog'
  ]);

  // When API files are changed:
  // grunt.event.on('watch', function(action, filepath) {
  //   grunt.log.writeln(filepath + ' has ' + action);

  //   // Send a request to a development-only endpoint on the server
  //   // which will reuptake the file that was changed.
  //   var baseurl = grunt.option('baseurl');
  //   var gruntSignalRoute = grunt.option('signalpath');
  //   var url = baseurl + gruntSignalRoute + '?action=' + action + '&filepath=' + filepath;

  //   require('http').get(url)
  //   .on('error', function(e) {
  //     console.error(filepath + ' has ' + action + ', but could not signal the Sails.js server: ' + e.message);
  //   });
  // });
};

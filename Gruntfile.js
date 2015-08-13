module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),






    /****************************************************
     *
     *  CSS / SASS
     *
     ***************************************************/
    // https://www.npmjs.com/package/grunt-sass
    sass: {
      dist: {
        options: {
          // style    : 'compressed',
          sourceMap: true,
          includePaths : [
            'bower_components'
          ],
        },
        files: {
          'dist/css/app.css'       : 'dev/sass/app.scss',
          'dist/css/web-fonts.css' : 'dev/sass/web-fonts.scss'
        }
      }
    },

    // https://github.com/nDmitry/grunt-autoprefixer
    autoprefixer: {
      dist: {
        src: 'dist/css/app.css'
      },
    },

    // https://github.com/gruntjs/grunt-contrib-cssmin
    cssmin: {
      dist: {
        files: {
          'dist/css/app.css': ['dist/css/app.css'],
        }
      }
    },





    /****************************************************
     *
     *  JS
     *
     ***************************************************/
    // https://github.com/gruntjs/grunt-contrib-concat
    concat: {
      options: {
        separator: ';',
      },
      plugins: {
        src: [
          'bower_components/scrollReveal.js/scrollReveal.js',
          'bower_components/mixitup/src/jquery.mixitup.js',
          // 'bower_components/jquery-gi-thewall/jQuery.GI.TheWall.min.js',
          'bower_components/lightgallery/light-gallery/js/lightGallery.min.js',
          'dev/js/plugins/*.js'
        ],
        dest: 'dev/js/plugins.js',
      },
      components: {
        src: [
          'dev/js/components/*.js'
        ],
        dest: 'dev/js/components.js',
      },
      app: {
        src: [
          'dev/js/plugins.js',
          'dev/js/components.js'
        ],
        dest: 'dist/js/app.js',
      },
    },

    // https://github.com/gruntjs/grunt-contrib-uglify
    uglify: {
      dist: {
        files: {
          'dist/js/app.js': ['dist/js/app.js'],
        }
      }
    },





    /****************************************************
     *
     *  MISC
     *
     ***************************************************/
    // https://github.com/gruntjs/grunt-contrib-watch
    watch: {
      options: {
        nospawn: true,
        livereload: 35729
      },
      sass: {
        files: ['dev/sass/{,**/}*.scss'],
        tasks: ['sass', 'autoprefixer', 'newer:imagemin:dynamic']
      },
      js: {
        files: ['dev/js/{,**/}*.js'],
        tasks: ['concat']
      },
      imgs: {
        files: ['dev/img/{,**}*.{png, jpg, jpeg, gif, webp, svg}'],
        tasks: ['imagemin:dynamic']
      },
      config: {
        options: { reload: true },
        files: ['Gruntfile.js'],
      }
    },

    clean: ['dist/'],






    /****************************************************
     *
     *  IMAGES
     *
     ***************************************************/
    // https://github.com/gruntjs/grunt-contrib-imagemin
    imagemin: {
      dynamic: {
        options: {
          optimizationLevel : 3,
          svgoPlugins       : [
            { removeViewBox: false },
            { mergePaths: false }
          ],
        },
        files: [{
          expand : true,
          cwd    : 'dev/img/',
          src    : ['**/*.{png,jpg,jpeg,gif,svg}'],
          dest   : 'dist/img/'
        }]
      }
    },

    svgstore: {
      options: {
        prefix : '',
        svg: {
          viewBox : '0 0 100 100',
          xmlns: 'http://www.w3.org/2000/svg'
        }
      },
      your_target: {
        files: {
          'inc/icons-lib.svg.php': ['dev/img/svg/icons/*.svg'],
        },
      },
    },





  });








  /****************************************************
   *
   *  TASKS
   *
   ***************************************************/
  grunt.registerTask('dev', [
    'newer:imagemin:dynamic',

    'newer:sass',
    'newer:autoprefixer:dist',

    'svgstore',

    'newer:concat',

    'watch',
  ]);



  grunt.registerTask('dist', [
    'clean',

    'imagemin:dynamic',

    'sass',
    'autoprefixer:dist',
    'cssmin:dist',

    'concat',
    'uglify:dist',
  ]);



};

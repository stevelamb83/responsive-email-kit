module.exports = function(grunt) {
	'use strict';

	var path = require('path');

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		/**
         * Project Paths
         */
        paths: {
        	// Store the finished files here
            dist: 'dist',

            // Where our images are located
            images: 'img',
            
            // Where the email templates are located
            templates: 'templates',

            // Where the Sass files are located
            sass: 'sass',
            
            // Where are CSS is located
            css: 'css'
        },

        /**
         * Before generating any new files, clean the /dist/ directory.
         */
        clean: {
            dist: ['<%= paths.dist %>']
        },

        /**
         * Compile the Sass files using Compass
         */
        compass: {
            dist: {
                options: {
                    sassDir: '<%= paths.sass %>',
                    cssDir: '<%= paths.css %>',
                    environment: 'production'
                }
            }
        },

	    /**
	     * Task to copy images to the dist directory
         *
         * This doesn't minify them, but you can run grunt dist to minify them and copy them over.
	     */
	    copy: {
            images: {
                files: [{
                    expand: true,
                    cwd: '<%= paths.images %>',
                    src: ['**/*.{gif,png,jpg}'],
                    dest: '<%= paths.dist %>/img'
                }]
            }
        },

        /**
         * Insert the media query css into the document manually.
         */
        htmlbuild: {
            dist: {
                src: ['<%= paths.dist %>/*.html'],
                dest: '<%= paths.dist %>',
                options: {
                    relative: true,
                    styles: {
                        mq: '<%= paths.css %>/mq.css'
                    }
                }
            }
        },

        /**
         * Image optimization
         */
        imagemin: {
            options: {
                progressive: false
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= paths.images %>',
                    src: ['**/*.{gif,png,jpg}'],
                    dest: '<%= paths.dist %>/img'
                }]
            }
        },

        /**
         * Inline the CSS from the external file into the document
         * This also copies the templates into the /dist/ folder
         */
        premailer: {
            main: {
                files: [{
                    expand: true,
                    cwd: '<%= paths.templates %>',
                    src: ['**/*.html'],
                    dest: '<%= paths.dist %>/'
                }]
            }
        },

        /**
         * This helps us watch changes to the files and reloads/recompiles when necessary
         */
        watch : {
        	// Watch the .SCSS files for changes and recompile them
            sass: {
                files: ['sass/*.scss'],
                tasks: ['compass', 'clean', 'copy', 'premailer', 'htmlbuild']
            },

            // Watch the template files for changes, inline their css files again, and recompile them
            templates: {
            	files: ['templates/*.html'],
            	tasks: ['clean', 'copy', 'premailer', 'htmlbuild']
            },
            
            // Watch our files for changes and reload the browser
            livereload: {
                files: ['<%= paths.dist %>/*.html', '<%= paths.dist %>/img/*'],
                options: {
                    livereload: true
                }
            }
        }
	});

    grunt.registerTask('dist', ['compass', 'clean', 'imagemin', 'premailer', 'htmlbuild']);

	grunt.registerTask('default', ['compass', 'clean', 'copy', 'premailer', 'htmlbuild']);
}
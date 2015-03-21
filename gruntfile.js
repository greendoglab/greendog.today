module.exports = function(grunt) {

    grunt.initConfig({

        sass: {
            dist: {
                options: {
                    style: 'expanded',
                    compass: false
                },
                files: {
                    'src/assets/css/style.css': 'src/assets/sass/style.scss'
                }
            }
        },

        autoprefixer: {
            options: {
                browsers: ['last 10 version']
            },
            multiple_files: {
                expand: true,
                flatten: true,
                src: 'src/assets/css/*.css',
                dest: 'src/static/css/'
            }
        },

        cssmin: {
            combine: {
                files: {
                    'src/static/css/style.min.css': ['src/static/css/style.css']
                }
            }
        },

        concat: {
            dist: {
                src: [
                    'bower_components/jquery/dist/jquery.min.js',
                    'bower_components/social-likes/social-likes.min.js',
                    'src/assets/js/scripts.js'
                ],
                dest: 'src/static/js/production.js',
            }
        },

        uglify: {
            build: {
                src: 'src/static/js/production.js',
                dest: 'src/static/js/production.min.js',
            }
        },

        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'src/assets/images/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'src/static/images/'
                }]
            }
        },

        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'bower_components/social-likes',
                        src: ['social-likes_flat.css'],
                        dest: 'src/static/css/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/normalize.css',
                        src: ['normalize.css'],
                        dest: 'src/static/css/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/fontawesome/fonts',
                        src: ['*'],
                        dest: 'src/static/fonts/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/fontawesome/css',
                        src: ['font-awesome.min.css'],
                        dest: 'src/static/css/',
                        filter: 'isFile'
                    },
                ],
            },
        },

        watch: {
            options: {
                livereload: true,
            },
            scripts: {
                files: ['src/assets/js/*.js'],
                tasks: ['concat'],
                options: {
                    spawn: false,
                }
            },
            css: {
                files: ['src/assets/sass/*.scss', 'src/assets/sass/*/*.scss'],
                tasks: ['sass', 'autoprefixer'],
                options: {
                    spawn: false,
                    livereload: false,
                }
            },
            autoprefixer: {
                files: 'src/assets/css/**',
                tasks: ['autoprefixer']
            },
            images: {
                files: ['src/assets/images/*.{png,jpg,gif}'],
                tasks: ['imagemin'],
            }
        },

    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('build', ['copy', 'concat', 'imagemin', 'sass', 'autoprefixer', 'uglify', 'cssmin']);
    grunt.registerTask('run', ['copy', 'concat', 'imagemin', 'sass', 'autoprefixer', 'uglify', 'cssmin', 'watch']);
    grunt.registerTask('default', ['run'])

};

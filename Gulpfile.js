'use strict';

var gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  del = require('del'),
  sass = require('gulp-sass'),
  rename = require('gulp-rename'),
  livereload = require('gulp-livereload'),
  jshint = require('gulp-jshint'),
  notify = require('gulp-notify'),
  autoprefixer = require('gulp-autoprefixer'),
  minifycss = require('gulp-minify-css'),
  htmlreplace = require('gulp-html-replace'),
  serve = require('gulp-serve');

var paths = {
  js: ['site/js/*.js', '!site/js/vendor/**/*.js'],
  scss: 'site/scss/style.scss',
  index: 'site/index.html'
};

var dests = {
  js: 'dist/js',
  css: 'dist/css',
  index: 'dist'
};

gulp.task('clean', function(cb) {
  del('dist', cb);
});

gulp.task('js', function () {
  return gulp.src(paths.js)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('site.js'))
    .pipe(rename({ suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(dests.js))
    .pipe(notify({ mesage: 'linted and minified js' }));
});

gulp.task('scss', function() {
  return gulp.src(paths.scss)
    .pipe(sass({ errLogToConsole: true }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(rename({suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest(dests.css))
    .pipe(notify({ message: 'compiled and minified scss' }));
});

gulp.task('index', function() {
  return gulp.src(paths.index)
    .pipe(htmlreplace({
      'css': 'css/style.min.css',
      'js': 'js/site.min.js'
    }))
    .pipe(gulp.dest(dests.index))
    .pipe(notify({ message: 'copied index.html to dist/index.html' }))
});

gulp.task('watch', function() {
  gulp.watch(paths.js, ['js']);
  gulp.watch(paths.scss, ['scss']);
  livereload.listen();
  gulp.watch(['dist/**']).on('change', livereload.changed);
});

gulp.task('serve', serve('dist'));

gulp.task('build', ['js', 'scss', 'index']);

gulp.task('default', ['clean', 'build']);

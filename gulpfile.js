var gulp = require('gulp');
var uglify = require('gulp-uglify');
var clean = require('gulp-minify-css');

var rename = require('gulp-rename');
var mustache = require("gulp-mustache");
var fs = require('fs');

gulp.task('minify-fi-css', function () {
  return gulp.src('./src/fi.css')
    .pipe(clean({ keepBreaks: true }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./build'))
});

gulp.task('minify-home-css', function () {
  return gulp.src('./src/index.css')
    .pipe(clean({ keepBreaks: true }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./build'));
});

gulp.task('minify-js', ['minify-fi-css'], function () {
  return gulp.src(['./src/fi.js', './src/index.js'])
    .pipe(mustache({
      style: fs.readFileSync('./build/fi.min.css')
    }))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('./build'))
    .pipe(gulp.dest('./extensions/chrome'));
});

gulp.task('home', ['minify-js', 'minify-home-css'], function () {
  return gulp.src("./src/index.tpl")
    .pipe(mustache({
      style: fs.readFileSync('./build/index.min.css', { encoding: 'utf8' }),
      bookmarklet: fs.readFileSync('./build/fi.min.js', { encoding: 'utf8' }),
      init: fs.readFileSync('./build/index.min.js', { encoding: 'utf8' })
    }))
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest("."));
});

gulp.task('default', ['home', 'minify-js']);

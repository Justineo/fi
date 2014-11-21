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

gulp.task('minify-fi-js', ['minify-fi-css'], function () {
  return gulp.src('./src/fi.js')
    .pipe(mustache({
      style: fs.readFileSync('./build/fi.min.css', 'utf8')
    }))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('./build'))
    .pipe(gulp.dest('./extensions/chrome'));
});

gulp.task('minify-home-js', ['minify-home-css'], function () {
  return gulp.src('./src/index.js')
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('./build'))
});

gulp.task('inject-fx-css', ['minify-fi-css'], function () {
  return gulp.src('./src/fi.js')
    .pipe(mustache({
      style: fs.readFileSync('./build/fi.min.css', 'utf8').replace(/\n/g, ''),
      firefox: true
    }))
    .pipe(gulp.dest('./extensions/firefox/data'));
});

gulp.task('home', ['minify-fi-js', 'minify-home-js', 'minify-home-css'], function () {
  return gulp.src("./src/index.tpl")
    .pipe(mustache({
      style: fs.readFileSync('./build/index.min.css', 'utf8'),
      bookmarklet: fs.readFileSync('./build/fi.min.js', 'utf8'),
      init: fs.readFileSync('./build/index.min.js', 'utf8')
    }))
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest("."));
});

gulp.task('fx', ['inject-fx-css']);

gulp.task('default', ['home', 'fx']);

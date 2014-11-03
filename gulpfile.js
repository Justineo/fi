var gulp = require('gulp');
var uglify = require('gulp-uglify');
var clean = require('gulp-minify-css');

var rename = require('gulp-rename');
var mustache = require("gulp-mustache");
var fs = require('fs');

gulp.task('minify-js', function() {
  return gulp.src(['./fi.js', './index.js'])
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('.'));
});

gulp.task('minify-css', function() {
  gulp.src('./index.css')
    .pipe(clean({ keepBreaks: true }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('.'))
});

gulp.task('home', ['minify-js', 'minify-css'], function() {
  return gulp.src("./index.tpl")
    .pipe(mustache({
      style: fs.readFileSync('./index.min.css', { encoding: 'utf8' }),
      bookmarklet: fs.readFileSync('./fi.min.js', { encoding: 'utf8' }),
      init: fs.readFileSync('./index.min.js', { encoding: 'utf8' })
    }))
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest("."));
});

gulp.task('default', ['home']);

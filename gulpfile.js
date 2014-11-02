var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var mustache = require("gulp-mustache");
var fs = require('fs');

gulp.task('minify-fi', function() {
  return gulp.src('./fi.js')
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('.'));
});

gulp.task('minify-bookmarklet', function() {
  return gulp.src('./bookmarklet.js')
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('.'));
});

gulp.task('home', ['minify-fi', 'minify-bookmarklet'], function() {
  return gulp.src("./index.tpl")
    .pipe(mustache({
      code: fs.readFileSync('./bookmarklet.min.js', {
          encoding: 'utf8'
      })
    }))
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest("."));
});

gulp.task('default', ['home']);

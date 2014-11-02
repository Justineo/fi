var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var mustache = require("gulp-mustache");
var fs = require('fs');

gulp.task('minify', function() {
  return gulp.src('./fi.js')
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('.'));
});

gulp.task('home', ['minify'], function() {
  return gulp.src("./index.tpl")
    .pipe(mustache({
      code: fs.readFileSync('./fi.min.js', {
          encoding: 'utf8'
      })
    }))
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest("."));
});

gulp.task('default', ['home']);

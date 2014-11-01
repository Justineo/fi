var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var mustache = require("gulp-mustache");
var fs = require('fs');
var htmlencode = require('htmlencode');

gulp.task('minify', function() {
  return gulp.src('./fi.js')
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('.'));
});

gulp.task('readme', ['minify'], function() {
  return gulp.src("./README.tpl")
    .pipe(mustache({
      bookmark: htmlencode.htmlEncode(
        fs.readFileSync('./fi.min.js', {
          encoding: 'utf8'
        })
      )
    }))
    .pipe(rename({ extname: '.md' }))
    .pipe(gulp.dest("."));
});

gulp.task('default', ['readme']);

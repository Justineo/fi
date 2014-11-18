var gulp = require('gulp');
var uglify = require('gulp-uglify');
var clean = require('gulp-minify-css');

var rename = require('gulp-rename');
var mustache = require("gulp-mustache");
var fs = require('fs');

gulp.task('minify-js', function() {
  return gulp.src(['./src/fi.js', './src/index.js'])
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('./build'));
});

gulp.task('minify-css', function() {
  gulp.src('./src/index.css')
    .pipe(clean({ keepBreaks: true }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./build'))
});

gulp.task('home', ['minify-js', 'minify-css'], function() {
  return gulp.src("./src/index.tpl")
    .pipe(mustache({
      style: fs.readFileSync('./build/index.min.css', { encoding: 'utf8' }),
      bookmarklet: fs.readFileSync('./build/fi.min.js', { encoding: 'utf8' }),
      init: fs.readFileSync('./build/index.min.js', { encoding: 'utf8' })
    }))
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest("."));
});

gulp.task('default', ['home']);

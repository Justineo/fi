var gulp = require('gulp');
var uglify = require('gulp-uglify');
var clean = require('gulp-minify-css');
var rename = require('gulp-rename');
var mustache = require('gulp-mustache');
var fs = require('fs');
var exec = require('child_process').exec;

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
      style: fs.readFileSync('./build/fi.min.css')
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
      style: fs.readFileSync('./build/fi.min.css').replace(/\n/g, ''),
      firefox: true
    }))
    .pipe(gulp.dest('./extensions/firefox/data'));
});

gulp.task('home', ['minify-fi-js', 'minify-home-js', 'minify-home-css'], function () {
  return gulp.src('./src/index.tpl')
    .pipe(mustache({
      style: fs.readFileSync('./build/index.min.css'),
      bookmarklet: fs.readFileSync('./build/fi.min.js'),
      init: fs.readFileSync('./build/index.min.js')
    }))
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest('.'));
});

gulp.task('pack-chrome-extension', ['minify-fi-js'], function (cb) {
  exec('find extensions/chrome -path \'*/.*\' -prune -o -type f -print | zip extensions/packed/chrome.zip -@', function (error, stdout, stderr) {
    if (error) {
      return cb(error);
    } else {
      var pack = JSON.parse(fs.readFileSync('./package.json'));
      var version = pack.version;
      var manifestPath = './extensions/chrome/manifest.json';
      var manifest = JSON.parse(fs.readFileSync(manifestPath));
      manifest.version = version;
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, '  ');
      cb();
    }
  });
});

gulp.task('pack-firefox-addon', ['inject-fx-css'], function (cb) {
  exec('cfx xpi --output-file=../packed/fi.xpi', {
    cwd: 'extensions/firefox'
  }, function (error, stdout, stderr) {
    if (error) {
      return cb(error);
    } else {
      var pack = JSON.parse(fs.readFileSync('./package.json'));
      var version = pack.version;
      var fxPackPath = './extensions/firefox/package.json';
      var fxPack = JSON.parse(fs.readFileSync(fxPackPath));
      fxPack.version = version;
      fs.writeFileSync(fxPackPath, JSON.stringify(fxPack, null, '  ');
      cb();
    }
  });
});

gulp.task('extensions', ['pack-chrome-extension', 'pack-firefox-addon']);
gulp.task('default', ['home', 'extensions']);

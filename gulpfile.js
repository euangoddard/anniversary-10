// Regular NPM dependencies
var argv = require('minimist')(process.argv.slice(2));
var browserSync = require('browser-sync');
var del = require('del');

// Gulp dependencies
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();


var CONFIG = {
  is_release: !!argv.release
};

var reload = browserSync.reload;


gulp.task('clean', function () {
  del.sync(['./dist']);
});


gulp.task('static', function () {
  gulp.src('./src/static/**/*')
    .pipe(gulp.dest('./dist'));
});


gulp.task('sass', ['build-html'], function () {
  var output_style = CONFIG.is_release ? 'compressed' : 'expanded';

  return gulp.src('./src/scss/**/*.scss')
    .pipe($.sass({
      outputStyle: output_style,
      precision: 10
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: [
    	'last 2 versions',
      'android >= 4.4'
    ]}))
    .pipe(gulp.dest('./dist/css'));
});


gulp.task('build-html', function () {
  gulp.src('./src/index.html')
    .pipe($.if(CONFIG.is_release, $.minifyHtml()))
    .pipe(gulp.dest('./dist'));
});


gulp.task('lint', function() {
  return gulp.src(['./src/**/*.js'])
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});


gulp.task('build', ['sass', 'static']);


gulp.task('serve', ['default'], function () {
  browserSync({
    notify: false,
    logPrefix: 'H&Co',
    server: 'dist',
    baseDir: 'dist'
  });

  gulp.watch(['./src/**/*', './gulpfile.js'], ['build', reload]);
});


gulp.task('default', ['build']);

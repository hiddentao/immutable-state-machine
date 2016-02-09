var gulp = require('gulp'),
  path = require('path');

var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var mocha = require('gulp-mocha');

var srcFile = './src/*.js';
var testFile = './test/*.js';
var buildFolder = './build';




gulp.task('js', function() {
  return gulp.src( srcFile )
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe( uglify() )
    .pipe( gulp.dest(buildFolder) )
  ;
});


gulp.task('test', ['js'], function() {
  return gulp.src( testFile )
    .pipe(mocha({
      ui: 'exports',
      reporter: 'spec'
    }));
});


gulp.task('default', ['test']);


'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const newer = require('gulp-newer');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglifyes');

gulp.task('lint', () => gulp.src('./src/**/*.js')
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError()));

gulp.task('build', ['lint'], () => gulp.src('./src/**/*.js')
  .pipe(newer('./'))

  .pipe(sourcemaps.init())
  .pipe(babel())
  .pipe(uglify())
  .pipe(sourcemaps.write('./'))

  .pipe(gulp.dest('./')));

gulp.task('default', ['build']);

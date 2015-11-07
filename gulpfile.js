(function() {
  'use strict';

  var gulp = require('gulp');
  var concat = require('gulp-concat');

  var sources = [
    'bower_components/angular/angular.min.js',
    'bower_components/angular-onselect/dist/angular-onselect.js'
  ];

  gulp.task('build', function() {
    return gulp.src(sources)
      .pipe(concat('app.js'))
      .pipe(gulp.dest('.'));
  });

  gulp.task('default', [ 'build' ]);

})();
(function() {
  'use strict';

  const gulp = require('gulp');
  const concat = require('gulp-concat');

  const sources = [
    'src/**/*.module.js',
    'src/**/!(*.spec).js'
  ];

  gulp.task('build', function() {
    return gulp.src(sources)
      .pipe(concat('angular-onselect.js'))
      .pipe(gulp.dest('dist'));
  });

})();
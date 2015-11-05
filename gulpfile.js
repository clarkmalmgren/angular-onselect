(function() {
  'use strict';

  const del = require('del');
  const gulp = require('gulp');
  const concat = require('gulp-concat');
  const karma = require('karma');

  const sources = [
    'src/**/*.module.js',
    'src/**/!(*.spec).js'
  ];

  gulp.task('clean', function(done) {
    del(['build'], done);
  });

  gulp.task('build', function() {
    return gulp.src(sources)
      .pipe(concat('angular-onselect.js'))
      .pipe(gulp.dest('dist'));
  });

  gulp.task('test', function(done) {
    new karma.Server({
      configFile: __dirname + '/karma.conf.js',
      singleRun: true
    }, done).start();
  });

  gulp.task('test-run', function(done) {
    new karma.Server({
      configFile: __dirname + '/karma.conf.js',
      singleRun: false
    }, done).start();
  });

  gulp.task('default', [ 'test', 'build' ]);

})();
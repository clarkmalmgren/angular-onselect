module.exports = function (config) {
  config.set({
    browsers: ['PhantomJS'],

    frameworks: [
      'mocha',
      'chai-sinon',
      'chai'
    ],

    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/ng-describe/dist/ng-describe.js',
      'src/**/*.module.js',
      'src/**/*.js'
    ],

    preprocessors: {
      'src/**/*.js': ['coverage']
    },

    reporters: [
      'mocha',
      'coverage',
      'junit'
    ],

    junitReporter: {
      outputDir: 'build/test-reports/'
    },

    coverageReporter: {
      type: 'lcov',
      dir: 'build/test-reports/coverage',
      subdir: '.'
    },

    client: {
      mocha: {
        reporter: 'html'
      }
    }
  });
};
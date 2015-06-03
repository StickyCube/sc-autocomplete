// Karma configuration

module.exports = function (config) {
  "use strict";

  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
        'libs/angular.1.3.15.min.js',
        'libs/*.js',
        'src/js/autocomplete.js',
        // 'dist/autocomplete.js',
        'dist/sc-autocomplete.angular.tpls.js',
        'test/unit_tests/*.spec.js'
    ],

    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],

    plugins: [
        'karma-chrome-launcher',
        'karma-jasmine',
    ],
    singleRun: false,
  });
};

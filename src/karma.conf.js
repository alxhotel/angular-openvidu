// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

let isCI = !!process.env.CI;

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../coverage'),
      reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true
    },
    customLaunchers: {
      Chrome_without_security: {
        base: 'Chrome',
        flags: [
          '--disable-web-security',
          '--ignore-certificate-errors',
          '--allow-insecure-localhost',
          '--use-fake-ui-for-media-stream',
          '--use-fake-device-for-media-stream',
          '--ignore-urlfetcher-cert-requests'
        ]
      }
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: !isCI,
    browsers: ['Chrome_without_security'],
    concurrency: Infinity,
    singleRun: true
  });
};

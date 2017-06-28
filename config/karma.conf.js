let isCI = !!process.env.CI;
let browsers = ['Chrome'];
let autoWatch =  !isCI;
let singleRun = isCI;

module.exports = function (config) {
	config.set({
		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['jasmine'],

		// list of files / patterns to load in the browser
		files: [
			{pattern: './config/testing-bootstrap.js', watched: false}
		],

		// list of files to exclude
		exclude: [
		],

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			'./config/testing-bootstrap.js': ['webpack']
		},

		webpack: {
			// karma watches the test entry points
			// (you don't need to specify the entry option)
			// webpack watches dependencies

			// webpack configuration
			resolve: {
				extensions: ['.ts', '.js'],
				modules: ['node_modules']
			},
			module: {
				rules: [
					{
						test: /\.ts$/,
						loader: ['ts-loader', 'angular2-template-loader'],
						exclude: [/node_modules/]
					},
					{
						test: /\.(html|css)$/,
						loader: 'raw-loader'
					}
				]
			}
		},

		webpackMiddleware: {
            stats: {
                chunks: false
            }
        },

		plugins: [
			require("karma-webpack"),
			require('karma-jasmine'),
			require('karma-chrome-launcher'),
			require('karma-phantomjs-launcher'),
			require('karma-mocha-reporter')
		],

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['mocha'],

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: autoWatch,

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: browsers,

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: singleRun,

		// Concurrency level
		// how many browser should be started simultanous
		concurrency: Infinity,

		// PhantomJS can be super slow and cause the tests to fail due to timeout.
		// Extend default from 10s to 50s to prevent this.
		browserNoActivityTimeout: 50000
	})
};
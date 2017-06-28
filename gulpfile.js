var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var rimraf = require('rimraf');
var ts = require('gulp-typescript');
var tsProj = ts.createProject('tsconfig.json');
var inlineNg2Template = require('gulp-inline-ng2-template');
var tslint = require('gulp-tslint');
var ngc = require('gulp-ngc');
var rollup = require('rollup');
var runSequence = require('run-sequence');

// Rollup Config
var rollupConfig = require('./rollup.config.js');

gulp.task('css', function () {
	return gulp.src(['src/**/*.scss'])
		.pipe(sass({style: 'compressed'}).on('error', gutil.log))
		.pipe(autoprefixer('last 10 versions', 'ie 9'))
		.pipe(gulp.dest('src'));
});

gulp.task('watch', function () {
	gulp.watch(['src/**/*.scss'], ['css']);
});

gulp.task('clean', function (cb) {
	return rimraf('./dist', cb);
});

gulp.task('tslint', function () {
	return gulp.src('src/**/*.ts')
		.pipe(tslint())
		.pipe(tslint.report());
});

gulp.task('inline-files', function () {
	// ts-node tools/inline-files.ts && tsc -p tsconfig.json
	return gulp.src(['src/**/*.ts'])
		.pipe(inlineNg2Template({ base: '/src', useRelativePaths: true }))
		.pipe(tsProj())
		.pipe(gulp.dest('./dist'));
});

gulp.task('rollup', function () {
	// rollup -c rollup.config.js dist/index.js > dist/index.bundle.js
	return rollup.rollup({
		entry: 'dist/index.js'
	}).then(function (bundle) {
		bundle.write(rollupConfig);
	}).catch(function (thing) {
		//console.log(thing);
	});
});

gulp.task('ngc', function () {
	// ngc -p tsconfig.json
	return ngc('tsconfig.json')
});

gulp.task('copyFiles', function () {
	// Copy README and package.json
	gulp.src('package.json').pipe(gulp.dest('./dist'));
	gulp.src('README.md').pipe(gulp.dest('./dist'));
});

gulp.task('build', ['clean', 'css', 'tslint'], function (cb) {
	// Run task secuantially
	runSequence('ngc', 'inline-files', 'rollup', 'copyFiles', cb);
});

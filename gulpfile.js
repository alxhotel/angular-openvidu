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
//var ngc = require('gulp-ngc');
var ngc = require('@angular/compiler-cli/src/main').main;
var rollup = require('rollup');

// Rollup Config
var rollupConfig = require('./rollup.config.js');

gulp.task('css', function () {
	return gulp.src(['src/**/*.scss'])
		.pipe(sass({style: 'compressed'}).on('error', gutil.log))
		.pipe(autoprefixer('last 10 versions', 'ie 9'))
		.pipe(gulp.dest('src'))
});

gulp.task('watch', function () {
	return gulp.watch(['src/**/*.scss'], gulp.series('css'))
});

gulp.task('clean', function (cb) {
	return rimraf('./dist', cb)
});

gulp.task('tslint', function () {
	return gulp.src('src/**/*.ts')
		.pipe(tslint())
		.pipe(tslint.report())
});

// ts-node tools/inline-files.ts && tsc -p tsconfig.json
gulp.task('inlineFiles', function () {
	return gulp.src(['src/**/*.ts'])
		.pipe(inlineNg2Template({ base: '/src', useRelativePaths: true }))
		.pipe(tsProj())
		.pipe(gulp.dest('./dist'))
});

// rollup -c rollup.config.js dist/index.js > dist/index.bundle.js
gulp.task('rollup', function () {
	return rollup.rollup({
		input: 'dist/index.js'
	}).then(function (bundle) {
		bundle.write(rollupConfig);
	}).catch(function (thing) {
		//console.log(thing);
	});
});

// ngc -p tsconfig.json
gulp.task('ngc', function (done) {
	ngc(['tsconfig.json']);
	done();
});

// Copy README and package.json
gulp.task('copyFiles', function () {
	return gulp.src(['package.json', 'README.md']).pipe(gulp.dest('./dist'))
});

// Run task secuantially
gulp.task('build', gulp.series(
	gulp.parallel('clean', 'css', 'tslint'),
	gulp.series('ngc', 'inlineFiles', 'rollup', 'copyFiles')
));

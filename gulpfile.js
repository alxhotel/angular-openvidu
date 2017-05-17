var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var rimraf = require('rimraf');
var ts = require('gulp-typescript');
var tsProj = ts.createProject('tsconfig.json');
var inlineNg2Template = require('gulp-inline-ng2-template');
var tslint = require('gulp-tslint');
var ngc = require('gulp-ngc');
var rollup = require('rollup');
var file = require('gulp-file');

gulp.task('css', function () {
	gulp.src(['src/**/*.less'])
		.pipe(less({style: 'compressed'}).on('error', gutil.log))
		.pipe(autoprefixer('last 10 versions', 'ie 9'))
		.pipe(gulp.dest('src'));
});

gulp.task('watch', function () {
	gulp.watch(lessDir + '/*.less', ['css']);
});

gulp.task('clean', function (cb) {
	rimraf('./dist', cb);
});

gulp.task('tslint', function () {
	return gulp.src('src/**/*.ts')
		.pipe(tslint())
		.pipe(tslint.report());
});

gulp.task('build', ['clean', 'css', 'tslint'], function () {
	// ts-node tools/inline-files.ts && tsc -p tsconfig.json
	
	gulp.src(['src/**/*.ts'])
		.pipe(inlineNg2Template({ base: '/src', useRelativePaths: true }))
		.pipe(tsProj())
		.pipe(gulp.dest('./dist'));
	
	// rollup -c rollup.config.js dist/index.js > dist/index.bundle.js
	//rollup.rollup({
	//	entry: 'dist/index.js'
	//});
	
	// ngc -p tsconfig.json
	ngc('tsconfig.json')
	
	// Copy README and package.json
	gulp.src('package.json').pipe(gulp.dest('./dist'));
	gulp.src('README.md').pipe(gulp.dest('./dist'));
});

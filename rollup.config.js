module.exports = {
	entry: 'dist/index.js',
	format: 'umd',
	moduleName: 'angular-openvidu',
	external: [
		'@angular/core',
		'@angular/common'
	],
	dest: 'dist/index.bundle.js'
};

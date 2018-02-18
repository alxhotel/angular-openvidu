module.exports = {
	input: 'dist/index.js',
	format: 'umd',
	name: 'angular-openvidu',
	external: [
		'@angular/core',
		'@angular/common'
	],
	output: 'dist/index.bundle.js'
};

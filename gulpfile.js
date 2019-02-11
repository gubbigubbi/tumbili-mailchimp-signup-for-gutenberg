const gulp = require( 'gulp' );
const zip = require( 'gulp-zip' );
const size = require( 'gulp-filesize' ); // to give you a filesize
const babel = require( 'gulp-babel' ); // compile to es
const rename = require( 'gulp-rename' );

function release() {
	return gulp
		.src(
			[
				'dist/*',
				'src/*.php',
				'src/client.js',
				'assets/*.jpg',
				'assets/*.svg',
				'readme.txt',
				'*.php',
			],
			{
				base: './',
			}
		)
		.pipe( zip( 'tumbili-mailchimp-for-gutenberg.zip' ) )
		.pipe( gulp.dest( './' ) )
		.pipe( size() );
}

function runBabel() {
	return gulp
		.src( 'src/client.js' )
		.pipe(
			babel( {
				presets: [ '@babel/env' ],
			} )
		)
		.pipe( size() )
		.pipe( rename( 'client.babel.js' ) )
		.pipe( gulp.dest( './dist' ) );
}

exports.release = release;
exports.babel = runBabel;
exports.default = release;

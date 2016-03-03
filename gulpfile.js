var THEME_NAME = 'theme';

'use strict';

	var gulp = require('gulp'),
	  concat = require('gulp-concat'),
      uglify = require('gulp-uglify'),
      rename = require('gulp-rename'),
autoprefixer = require('gulp-autoprefixer'),
		sass = require('gulp-sass'),
		maps = require('gulp-sourcemaps'),
	   clean = require('gulp-clean');

gulp.task('copyFiles', function() {
	gulp.src('src/templates/**/*')
		.pipe(gulp.dest(THEME_NAME + '/'));
	gulp.src('src/images/**/*')
		.pipe(gulp.dest(THEME_NAME + '/images'));	
	gulp.src('src/fonts/**/*')
		.pipe(gulp.dest(THEME_NAME + '/fonts'));		
});

gulp.task('concatScripts', function() {
	return gulp.src('src/js/main.js')
		// .pipe(maps.init())
		.pipe(concat('main.js'))
		// .pipe(maps.write('./'))
		.pipe(gulp.dest('theme/js'));
});

gulp.task('minifyScripts', ['concatScripts'], function() {
	return gulp.src('src/js/main.js')
		// .pipe(maps.init())
		// .pipe(uglify())
		// .pipe(maps.write('./'))
		.pipe(rename('main.min.js'))
		.pipe(gulp.dest(THEME_NAME + '/js'));
});

gulp.task('compileSass', function() {
	return gulp.src('src/sass/main.scss')
		.pipe(maps.init())
		.pipe(sass(
			// { outputStyle: 'compressed' }
		).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(rename('main.min.css'))
		.pipe(maps.write('./'))
		.pipe(gulp.dest(THEME_NAME + '/css'))
});

gulp.task('watchFiles', function() {
	gulp.watch('src/templates/**/*', ['build']);
	gulp.watch('src/sass/**/*', ['build']);
	gulp.watch('src/js/main.js', ['build']);
});

gulp.task('clean', function() {
	gulp.src([THEME_NAME, 'wordpress/wp-content/themes/' + THEME_NAME])
		.pipe(clean({force : true}));
});

gulp.task('build', ['copyFiles', 'minifyScripts', 'compileSass'], function(){
	return gulp.src(['/css/main.min.*', '/js/main.min.*'], { base: THEME_NAME})
		.pipe(gulp.dest(THEME_NAME))
});

gulp.task('wp-theme', ['build'], function () {
	gulp.src(THEME_NAME + '/**/*')
		.pipe(gulp.dest('wordpress/wp-content/themes/' + THEME_NAME + '/'));	
});

gulp.task('default', ['wp-theme', 'watchFiles'], function() {
	gulp.start('build');

});




/**
 * gulpfile.js
 * Main file for gulp script 
 * @author: Juan Camilo Ibarra
 * @Creation_Date: March 2016
 * @version: 0.1.0
 * @Update_Author : Juan Camilo Ibarra
 * @Date: March 2016
 */

var gulp = require('gulp');
var clean = require('gulp-clean');
var concat = require('gulp-concat');

var runSequence = require('run-sequence');
var fs = require('fs');

//************* BROWSERIFY************
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var glob = require('glob');

var dest_dev = "./public";


gulp.task('browserify_debug', function () {
  // set up the browserify instance on a task basis
  var files = glob.sync('./controllers/*.js');
  var b = browserify({
    entries : files,
    debug: true,
  });

  return b.bundle()
    .pipe(source('bundle_app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        .on('error', gutil.log)
    .pipe(sourcemaps.write(dest_dev))
    .pipe(gulp.dest(dest_dev + '/js'));
});

gulp.task('browserify_prod', function () {
  // set up the browserify instance on a task basis
  var files = glob.sync('./controllers/*.js');
  var b = browserify({
    entries: files,
    debug: false,
    // defining transforms here will avoid crashing your stream
    transform: [uglify]
  });

  return b.bundle()
    .pipe(source('bundle_app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: false}))
        // Add transformation tasks to the pipeline here.
        //.pipe(uglify({mangle : false}))
        .on('error', gutil.log)
    .pipe(gulp.dest(dest_dev + '/js'));
});

//***********************************************

// Removes build_test folder
gulp.task('clean_build_test', function(){
	return gulp.src(dest_dev, {read : false})
		.pipe(clean({force : true}));
});

// Copies view files to views in build_test
gulp.task('copy_view_files', function() {
	return gulp.src('index.html')
		.pipe(gulp.dest(dest_dev));
});

// Copies templates files to views in build_test
gulp.task('copy_templates_files', function() {
	return gulp.src('templates/*')
		.pipe(gulp.dest(dest_dev + '/templates'));
});
// Copies images files to build_test
gulp.task('copy_images_files', function() {
	return gulp.src('./images/*')
		.pipe(gulp.dest(dest_dev + '/images'));
});


//Concat css files for app into one bundle file (budle_app.css)
gulp.task('concat_app_css', function(){
	return gulp.src([
			//***************************************
			//ADD HERE EXTRA CSS FILES
			//***************************************
			"./css/view.css"
		])
		.pipe(concat('bundle_app.css'))
		.pipe(gulp.dest(dest_dev + '/css'));
});

//******************* GULP SEQUENCES ********************
// Clean building
gulp.task('generate', function(callback) {
	runSequence(
		'clean_build_test',
		'copy_view_files',
		'copy_images_files',
		'copy_templates_files',
		'concat_app_css',
		'browserify_debug',
		function(err) {
		if (err)
			console.log(err);
		else
			console.log('TESTING FILES CREATED SUCCESSFULLY');
		callback(err);
	});
}); 

// Updates build files
gulp.task('update', function(callback) {
	runSequence(
		'copy_view_files',
		'copy_images_files',
		'copy_templates_files',
		'concat_app_css',
		'browserify_debug',
		function(err) {
		if (err)
			console.log(err);
		else
			console.log('TESTING FILES UPDATED SUCCESSFULLY');
		callback(err);
	});
}); 
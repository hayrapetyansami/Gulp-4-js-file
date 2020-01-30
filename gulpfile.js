/* SAMi GULP 4 File 2019 v3 */

// update [imagemin] up to 7

// get npm modules

const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const gcmq = require('gulp-group-css-media-queries');
const sourcemaps = require('gulp-sourcemaps');

// build path
const patt = './build';

// sass to css task
function preproc() {
   return gulp.src('./src/sass/styles.scss')
   .pipe(sass().on('error', sass.logError))
   .pipe(gcmq())
   .pipe(sourcemaps.init())
   .pipe(concat('styles.css'))
   .pipe(autoprefixer({
      browsers: ['> 0.01%'],
      cascade: false
   }))
   .pipe(cleanCSS({
      level: 2
   }))
   .pipe(sourcemaps.write('.'))
   .pipe(gulp.dest('./build/css'))
   .pipe(browserSync.stream());
}

// styles task
function styles() {
   return gulp.src('./src/css/**/*.css')
   .pipe(gcmq())
   .pipe(sourcemaps.init())
   .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
   }))
   .pipe(cleanCSS({
      level: 2
   }))
   .pipe(sourcemaps.write('.'))
   .pipe(gulp.dest('./build/css'))
   .pipe(browserSync.stream());
}

// all js task
function scripts() {
   return gulp.src('./src/js/**/*.js')
   .pipe(sourcemaps.init())
   .pipe(concat('all.js'))
   .pipe(uglify({
      toplevel: true
   }))
   .pipe(sourcemaps.write('.'))
   .pipe(gulp.dest('./build/js'))
   .pipe(browserSync.stream());
}

// pictures task
function img(){
	return gulp.src('./src/img/**/*')
	.pipe(imagemin())
	.pipe(imagemin([
		imagemin.gifsicle({interlaced: true}),
		imagemin.mozjpeg({quality: 75, progressive: true}),
		imagemin.optipng({optimizationLevel: 5}),
		imagemin.svgo({
			plugins: [
				{removeViewBox: true},
				{cleanupIDs: false}
			]
		})
	]))
   
   .pipe(gulp.dest('./build/img'))
}

// delete build folder and all files in the build folder
function clean() {
   return del(['build/*'])
}

// fonts folder => build
function fonts(){
   return gulp.src('./src/fonts/*')
   .pipe(gulp.dest('./build/fonts'))
}

// all libs folder => build
function libs(){
   return gulp.src('./src/libs/*')
   .pipe(gulp.dest('./build/libs')) 
}

// all .html => build
function htmls(){
   return gulp.src('./src/*.html')
   .pipe(gulp.dest('./build/')) 
   .pipe(browserSync.stream());
}

// run gulp watch to live stream in browser
function watch() {
	browserSync.init({
	  server: {
		 baseDir: patt
	  }//,
	  //tunnel: true
	});

	gulp.watch('./src/fonts/*', fonts) // fonts watch
	gulp.watch('./src/libs/*', libs) // libs watch
	gulp.watch('./src/js/**/*.js', scripts) // scripts watch
	gulp.watch('./src/sass/**/*.scss', preproc) // sass watch 
	gulp.watch('./src/css/**/*.css', styles) // css watch 
	gulp.watch('./src/*.html', htmls)  // html watch
	gulp.watch("./*.html").on('change', browserSync.reload); // html watch for all htmls
}

// all gulp tasks
gulp.task('del', clean);
gulp.task('htmls', htmls)
gulp.task('sass', preproc);
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('imagemin', img)
gulp.task('fonts', fonts);
gulp.task('libs', libs);

// watch task for run live stream from build folder
gulp.task('watch', watch);

// build task for run build to all files from src to build folder
gulp.task('all', gulp.series(clean, gulp.parallel(htmls, preproc, styles, scripts, img, fonts, libs)));

// dev task, parallel build and after watch
gulp.task('dev', gulp.series('all','watch'));

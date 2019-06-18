/* 
	GULP-ով աշխաելու համար նախ պետք է ներբեռնեք Nodejs.org կայքից nodejs-ը, որի մեջ արդեն իսկ կա NPM-ը որը NodeJs Packed Manager է
	բացվում, այսինքն նոդ ջիեսի պակետների մենեջեր, հետո նստացվնում եք գալպը CMDի միջոցով գրելով npm i gulp-cli --save-dev
	հետո սարքում ենք ձեր json-ը գրելով nmp init ու լրացնելով դաշտերը, եթե ցանկանում եք բաց թողնել պարզապես գրեք npm init հետո y
	ու վերջ գալպը պատրաստ է աշխատանքի, հետո ձեռքով նստացնում եք բոլոր մոդուլները, որոնք ներքևում են, և վերջ, խոդի եք տալիս պրոյեկտը ըստ ֆունկցիաների
*/



// Ստանում ենք գալպի այն մոդուլները որոնց մեզ պետք են

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

// ցույց ենք տալիս այն ճանապարհը, որտեղ որ պետք է build լինի մեր վերջնական պրոյեկտը
const patt = './build';

// sass-ի ֆունկցիան
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
// javascrip-ների ֆունկցիան
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
// all js
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
// imagemin-ի ֆունկցիան, որը նկարները մինիֆիկացնում է
function img(){
	return gulp.src('./src/img/*')
	.pipe(imagemin())
	.pipe(imagemin([
		imagemin.gifsicle({interlaced: true}),
		imagemin.jpegtran({progressive: true}),
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
// del-ը ջնջելու ֆունկցիան է, որը ջնջում է կոնկրետ ցույց տված ֆայլը, եթե դիրքեթիվը փոխեք ուշադիր եղեք, որ ճիշտ նշեք նոր դիրեքթիվը,
// թե չէ շատ հնարավոր ա ձեր կոմպի մեջ ինչ կա չկա պահի տակ ջնջեք :) 
function clean() {
   return del(['build/*'])
}
// fonts սա ֆոնթերի ֆունկցիան է, որը ֆոնթերը src-ից քոփի է անում և տեղադրում build-ի մեջ
function fonts(){
   return gulp.src('./src/fonts/*')
   .pipe(gulp.dest('./build/fonts'))
}
// libs սա այն ֆունկցիան է, որտեղ կարոն եք դնել բոլոր գրադարանները, կամ պլագինները, որոնք առանձին են միանում մեր HTMLին,
// օրինակ ինչ որ image gallery-ի պլագին, որը միայն պետք է աշխատի gallery էջում:
function libs(){
   return gulp.src('./src/libs/*')
   .pipe(gulp.dest('./build/libs')) 
}
// html այս ֆունկցիան բոլոր HTML ները տեղափոխում է src-ից դեպի build folder որտեղ էլ ստանում ենք վերջնական ֆայլերը:
function htmls(){
   return gulp.src('./src/*.html')
   .pipe(gulp.dest('./build/')) 
   .pipe(browserSync.stream());
}

// gulp watch - սա այն հրամանն է որի միջոցով մենք ապահովում ենք ուղիղ եթեր, և որը վերահսկում է բոլոր փոփոխությունները
// կլինի sass, less, styleus, css, js, html և այլն, ներկա պահին 3 տասկ է կատարում
function watch() {
   browserSync.init({
      server: {
          baseDir: patt
      }
  });

gulp.watch('./src/sass/**/*.scss', preproc)// sass ների թասք
  gulp.watch('./src/css/**/*.css', styles)// css ների թասք
  gulp.watch('./src/*.html', htmls) // html-ների թասք
  gulp.watch("./*.html").on('change', browserSync.reload); // html թասք որը հետևում է բոլոր այն փոփոխություններին, որոնք կատարվում են բոլոր HTMLների մեջ
}

// gulp tasks, այստեղ բոլոր այն թասկերն են, որոնք մենք ստացել ենք վերևում, և փոխանցում ենք CMDին
gulp.task('del', clean);
gulp.task('htmls', htmls)
gulp.task('sass', preproc);
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('imagemin', img)
gulp.task('fonts', fonts);
gulp.task('libs', libs);

// watch task - սա watch-ը միացնելու տասկն է պարզապես CMDի մեջ գրում եք gulp watch և սեղմում enter
gulp.task('watch', watch);

// build task - build-ը միացնելու տասկն է պարզապես CMDի մեջ գրում եք gulp build և սեղմում enter, և ձեր ֆայլերը build են լինում
gulp.task('build', gulp.series(clean, gulp.parallel(htmls, preproc, styles, scripts, img, fonts, libs)));

// build => watch - սա սկզբում բիլդ է անում հետո արդեն watch, օգտակար է գլոբալ փոփոխությունների ժամանակ
// կանչելու համար գրեք gulp dev
gulp.task('dev', gulp.series('build','watch'));
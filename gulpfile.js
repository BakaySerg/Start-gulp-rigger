var	gulpversion   = '4'; // Gulp version: 3 or 4

var   gulp          = require('gulp'),
		gutil         = require('gulp-util' ),
		sass          = require('gulp-sass'),
		browserSync   = require('browser-sync'),
		concat        = require('gulp-concat'),
		uglify        = require('gulp-uglify'),
		cleancss      = require('gulp-clean-css'),
		rename        = require('gulp-rename'),
		autoprefixer  = require('gulp-autoprefixer'),
		notify        = require('gulp-notify'),
		rigger        = require('gulp-rigger'), //работа с инклюдами в html и js
		imagemin      = require('gulp-imagemin'), //минимизация изображений
		rsync         = require('gulp-rsync');

gulp.task('browser-sync', function() {
	browserSync({
		server: {baseDir: 'app'},
		notify: false,
		// open: false,
		// online: false, // Work Offline Without Internet Connection
		// tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
	})
});

// таск для билдинга html
gulp.task('layout', function () {
   return gulp.src('src/*.html') //Выберем файлы по нужному пути
   // .pipe(plumber())
   .pipe(rigger()) //Прогоним через rigger
   .pipe(gulp.dest('app/')) //выгрузим их в папку 
   .pipe(browserSync.reload({ stream: true })) //И перезагрузим наш сервер для обновлений
});

gulp.task('styles', function() {
	return gulp.src('src/scss/**/*.scss')
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	// .pipe(autoprefixer(['last 4 versions']))
	.pipe(cleancss( {level: { 1: { specialComments: 0 }}})) // Opt., comment out when debugging
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('scripts', function() {
	return gulp.src([
		'src/libs/jquery/dist/jquery.min.js',
		'src/js/main.js', // Always at the end
		])
	.pipe(concat('scripts.min.js'))
	// .pipe(uglify()) // Minify js (opt.)
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('code', function() {
	return gulp.src('app/*.html')
	.pipe(browserSync.reload({ stream: true }))
});

// gulp.task('rsync', function() {
// 	return gulp.src('app/**')
// 	.pipe(rsync({
// 		root: 'app/',
// 		hostname: 'username@yousite.com',
// 		destination: 'yousite/public_html/',
// 		// include: ['*.htaccess'], // Includes files to deploy
// 		exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
// 		recursive: true,
// 		archive: true,
// 		silent: false,
// 		compress: true
// 	}))
// });

// if (gulpversion == 3) {
// 	gulp.task('watch', ['styles', 'scripts', 'browser-sync'], function() {
// 		gulp.watch('app/scss/**/*.scss', ['styles']);
// 		gulp.watch(['libs/**/*.js', 'app/js/main.js'], ['scripts']);
// 		gulp.watch('app/*.html', ['code'])
// 	});
// 	gulp.task('default', ['watch']);
// }

if (gulpversion == 4) {
	gulp.task('watch', function() {
		gulp.watch('src/scss/**/*.scss', gulp.parallel('styles'));
		gulp.watch(['libs/**/*.js', 'src/js/main.js'], gulp.parallel('scripts'));
		gulp.watch('src/**/*.html', gulp.parallel('layout'))
	});
	gulp.task('default', gulp.parallel('layout','styles', 'scripts', 'browser-sync', 'watch'));
}
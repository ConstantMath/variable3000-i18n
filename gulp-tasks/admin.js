var gulp          = require('gulp');
var browserSync   = require('browser-sync').create();
var sass          = require('gulp-sass');
var browserify    = require('browserify');
var source        = require('vinyl-source-stream');
var buffer        = require('vinyl-buffer');
var beautify      = require('gulp-beautify');
var rename        = require('gulp-rename');
var sourcemaps    = require('gulp-sourcemaps');
var autoprefixer  = require('gulp-autoprefixer');
var cssmin        = require('gulp-cssmin');
var shell         = require('gulp-shell');
var concat        = require('gulp-concat');
var gutil         = require('gulp-util');
var uglify        = require('gulp-uglify-es').default;
var babelify      = require('babelify');
////
// Admin Tasks
////
////
// Static Server + watching scss/html files
gulp.task('serve-admin', ['admin-sass'], function() {
  browserSync.init({
    proxy: "variable3000-i18n.test",
    port: 8080,
    open: false
  });
  gulp.watch("resources/assets/admin/js/**/*.js", ['admin-js-watch']);
  gulp.watch("resources/assets/admin/css/**/*.scss", ['admin-sass']);
  gulp.watch("resources/assets/admin/**/*.blade.php").on('change', browserSync.reload);
});


gulp.task("admin-sass", function(){
  return gulp.src('resources/assets/admin/css/*.scss')
  .pipe(sourcemaps.init())
  // Compile sass avec les commentaires dans la source
  .pipe(sass({
    style: 'expanded',
    sourceComments: 'normal'
  }))
  // Ajoute des préfixes automatiquement
  .pipe(autoprefixer())
  // Commente le code pour debug avec firebug
  .pipe(sourcemaps.write())
  // Sauve le fichier dans public/assets
  .pipe(gulp.dest('public/assets/admin'))
  // browserSync
  .pipe(browserSync.stream())
  // Renomme le fichier avec .min
  .pipe(rename({suffix: '.min'}))
  // Compresse le fichier
  .pipe(cssmin())
  // Sauve le fichier dans public/assets
  .pipe(gulp.dest('public/assets/admin'))
});

gulp.task('admin-js', function() {
  return gulp.src([
    'resources/assets/admin/js/vendor/*.js',
    'resources/assets/admin/js/modules/*.js',
    'resources/assets/admin/js/*.js'
  ])
  // Concatène tous les fichiers js en 1
  .pipe(concat('scripts.js'))
  // Indente
  .pipe(beautify({indentSize: 2}))
  // Sauve le fichier dans public/assets
  .pipe(gulp.dest("public/assets/admin"))
  // Renomme le fichier avec .min
  .pipe(rename({suffix: '.min'}))
  // Compresse le fichier
  .pipe(uglify())
      .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
  // Sauve le fichier compressé dans public/assets
  .pipe(gulp.dest('public/assets/admin'))
});

// reloading browsers
gulp.task('admin-js-watch', ['admin-js'], function (done) {
  browserSync.reload();
  done();
});

gulp.task('admin', ['serve-admin']);

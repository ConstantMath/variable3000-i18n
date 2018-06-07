var gulp          = require('gulp');
var sass          = require('gulp-sass');
var beautify      = require('gulp-beautify');
var rename        = require('gulp-rename');
var sourcemaps    = require('gulp-sourcemaps');
var autoprefixer  = require('gulp-autoprefixer');
var cssmin        = require('gulp-cssmin');
var shell         = require('gulp-shell');
var concat        = require('gulp-concat');
var gutil         = require('gulp-util');
var livereload    = require('gulp-livereload');
var uglify        = require('gulp-uglify-es').default;

////
// Admin Tasks
////
////

gulp.task('admin-js', function() {
  gulp.src([
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
  .pipe(livereload())
});

gulp.task("admin-sass", function(){
  gulp.src('resources/assets/admin/css/*.scss')
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
  // Renomme le fichier avec .min
  .pipe(rename({suffix: '.min'}))
  // Compresse le fichier
  .pipe(cssmin())
  // Sauve le fichier dans public/assets
  .pipe(gulp.dest('public/assets/admin'))
  .pipe(livereload())
});

gulp.task('admin', function() {
  livereload.listen();
  gulp.watch('resources/assets/admin/**/*.js',['admin-js']);
  gulp.watch('resources/assets/admin/**/*.scss',['admin-sass']);
});

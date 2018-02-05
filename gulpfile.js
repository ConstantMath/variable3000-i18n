var gulp = require('gulp'),
    shell = require('gulp-shell'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    beautify = require('gulp-beautify'),
    cssmin = require('gulp-cssmin'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    livereload = require('gulp-livereload');
    gutil = require('gulp-util');




gulp.task("front-sass", function(){
  gulp.src('resources/assets/css/*.scss')
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
  .pipe(gulp.dest("public/assets"))
  // Renomme le fichier avec .min
  .pipe(rename({suffix: '.min'}))
  // Compresse le fichier
  .pipe(cssmin())
  // Sauve le fichier dans public/assets
  .pipe(gulp.dest('public/assets'))
  .pipe(livereload())
});


////
// Admin Tasks
////

gulp.task('admin-js', function() {
  gulp.src([
    'resources/assets/js/admin/vendor/*.js',
    'resources/assets/js/admin/libs/*.js',
    'resources/assets/js/admin/*.js'
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
  gulp.watch('resources/assets/js/admin/**/*.js',['admin-js']);
  gulp.watch('resources/assets/admin/css/**/*.scss',['admin-sass']);
});

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


////
// Front Tasks
////

gulp.task('front-js', function() {
  gulp.src(['resources/assets/js/vendor/*.js', 'assets/js/*.js'])
  // Concatène tous les fichiers js en 1
  .pipe(concat('scripts.js'))
  // Indente
  .pipe(beautify({indentSize: 2}))
  // Sauve le fichier dans public/dist
  .pipe(gulp.dest("public/dist"))
  // Renomme le fichier avec .min
  .pipe(rename({suffix: '.min'}))
  // Compresse le fichier
  .pipe(uglify())
  // Sauve le fichier compressé dans public/dist
  .pipe(gulp.dest('public/dist'))
});

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
  // Sauve le fichier dans public/dist
  .pipe(gulp.dest("public/dist"))
  // Renomme le fichier avec .min
  .pipe(rename({suffix: '.min'}))
  // Compresse le fichier
  .pipe(cssmin())
  // Sauve le fichier dans public/dist
  .pipe(gulp.dest('public/dist'))
  .pipe(livereload())
});

gulp.task("front-css-font", function(){
  gulp.src('resources/assets/fonts/*.scss')
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
  // Sauve le fichier dans public/dist
  .pipe(gulp.dest("public/dist"))
  // Renomme le fichier avec .min
  .pipe(rename({suffix: '.min'}))
  // Compresse le fichier
  .pipe(cssmin())
  // Sauve le fichier dans public/dist
  .pipe(gulp.dest('public/dist'))
  .pipe(livereload())
});

gulp.task('patternlab', shell.task([
  // Lance Patternalb Watch
  'cd public/patternlab && php core/console --watch --patternsonly'
]));

gulp.task('front', function() {
  livereload.listen();
  gulp.watch('resources/assets/js/**/*.js',['front-js']);
  gulp.watch('resources/assets/css/**/*.scss',['front-sass']);
  gulp.watch('resources/assets/fonts/*.scss',['front-css-font']);
});


////
// Admin Tasks
////

gulp.task('admin-js', function() {
  gulp.src([
    'resources/admin-assets/js/vendor/*.js',
    'resources/admin-assets/js/libs/*.js', 
    'resources/admin-assets/js/*.js'
  ])
  // Concatène tous les fichiers js en 1
  .pipe(concat('scripts.js'))
  // Indente
  .pipe(beautify({indentSize: 2}))
  // Sauve le fichier dans public/dist
  .pipe(gulp.dest("public/dist/admin"))
  // Renomme le fichier avec .min
  .pipe(rename({suffix: '.min'}))
  // Compresse le fichier
  .pipe(uglify())
  // Sauve le fichier compressé dans public/dist
  .pipe(gulp.dest('public/dist/admin'))
});

gulp.task("admin-sass", function(){
  gulp.src('resources/admin-assets/css/*.scss')
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
  // Sauve le fichier dans public/dist
  .pipe(gulp.dest('public/dist/admin'))
  // Renomme le fichier avec .min
  .pipe(rename({suffix: '.min'}))
  // Compresse le fichier
  .pipe(cssmin())
  // Sauve le fichier dans public/dist
  .pipe(gulp.dest('public/dist/admin'))
  .pipe(livereload())
});


gulp.task('admin', function() {
  livereload.listen();
  gulp.watch('resources/admin-assets/js/**/*.js',['admin-js']);
  gulp.watch('resources/admin-assets/css/**/*.scss',['admin-sass']);
});

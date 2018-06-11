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

// Static Server + watching scss/html files
gulp.task('serve', ['front-sass'], function() {
  browserSync.init({
    proxy: "variable3000-i18n.test",
    port: 8080,
    open: false
  });
  gulp.watch("resources/assets/front/js/**/*.js", ['front-js-watch']);
  gulp.watch("resources/assets/front/css/**/*.scss", ['front-sass']);
  gulp.watch("resources/patternlab/**/*.mustache").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('front-sass', function() {
  return gulp.src("resources/assets/front/css/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass({
      style: 'expanded',
      sourceComments: 'normal'
    }))
    // Ajoute des préfixes automatiquement
    .pipe(autoprefixer())
    // Commente le code pour debug
    .pipe(sourcemaps.write())
    // Sauve le fichier dans public/assets
    .pipe(gulp.dest("public/assets/front"))
    // browserSync
    .pipe(browserSync.stream())
    // Renomme le fichier avec .min
    .pipe(rename({suffix: '.min'}))
    // Compresse le fichier
    .pipe(cssmin())
    // Sauve le fichier dans public/assets
    .pipe(gulp.dest('public/assets/front'))
});

// process JS files and return the stream.
gulp.task('front-js', function () {
  return browserify({
    entries: './resources/assets/front/js/scripts.js',
    debug: true
  })
  .transform("babelify", { presets: ["es2015"] })
  .bundle()
  .pipe(source('scripts.js'))
  .pipe(buffer())
  // Indente
  .pipe(beautify({indentSize: 2}))
  // Sauve le fichier dans public/assets
  .pipe(gulp.dest("public/assets/front"))
  // Renomme le fichier avec .min
  .pipe(rename({suffix: '.min'}))
  // Compresse le fichier
  .pipe(uglify())
  // Sauve le fichier compressé dans public/assets
  .pipe(gulp.dest('public/assets/front'))
});

// reloading browsers
gulp.task('front-js-watch', ['front-js'], function (done) {
  browserSync.reload();
  done();
});

// Patternlab
gulp.task('patternlab', shell.task([
  // Lance Patternalb Watch
  'cd resources/patternlab && php core/console --watch --patternsonly'
]));

gulp.task('front', ['serve']);
gulp.task('frontlab', ['serve', 'patternlab']);

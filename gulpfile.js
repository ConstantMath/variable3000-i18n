var elixir = require('laravel-elixir');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */


elixir(function(mix) {

  // ----- front ----- //

  mix.sass([
    'main.scss'
  ], 'public/assets/css/styles.css');

  mix.version([]);

  // ----- admin ----- //

  mix.styles([
   'libs/'
  ], 'public/admin-assets/css/libs.css', 'resources/admin/css/');

  this.config.assetsPath = 'resources/admin-assets/css/'; // path pour Elixir/sass

  mix.sass([
    'main.scss'
  ], 'public/admin-assets/css/styles.css');

  mix.scripts([
    'libs',
    'main.js'
  ], 'public/admin-assets/js/scripts.js', 'resources/admin-assets/js/');


  // ----- versioning ----- //

  mix.version([
    'public/assets/css/styles.css',
    'public/admin-assets/css/libs.css',
    'public/admin-assets/css/styles.css',
    'public/admin-assets/js/scripts.js'
  ]);

});

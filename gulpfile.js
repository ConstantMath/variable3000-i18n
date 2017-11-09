const elixir = require('laravel-elixir');


elixir(mix => {
  mix.sass('screen.scss', 'public/css/')
     .sass('admin/main.scss', 'public/css/admin/')
     .webpack('app.js')
     .scripts(['admin/vendor', 'admin/main.js', 'admin/libs'], 'public/js/admin/')
     .browserSync({
       proxy: 'variable3000-i18n.dev'
     });
});

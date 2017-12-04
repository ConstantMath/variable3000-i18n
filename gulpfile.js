const elixir = require('laravel-elixir');


elixir(mix => {
  mix.sass('admin/main.scss', 'public/css/admin/')
     .scripts(['admin/vendor', 'admin/libs', 'admin/main.js'], 'public/js/admin/')
});

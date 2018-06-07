<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>@yield('page_title')</title>
  <?php // TODO: page_description ?>
  <meta name="description" content="@yield('website_description')">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <?php // TODO: fb:admins ?>
  <meta property="fb:admins" content="">
  <?php // TODO: fb:app_id ?>
  <meta property="fb:app_id" content="">
  <meta name="apple-mobile-web-app-title" content="{{ config('app.name') }}">
  <meta name="application-name" content="{{ config('app.name') }}">
  <meta name="msapplication-TileColor" content="#ffffff">
  <meta property="og:title" content="@yield('page_title')">
  <meta property="og:description" content="@yield('website_description')">
  <meta property="og:image" content="">
  <meta property="og:url" content="">
  <link rel="apple-touch-icon" sizes="57x57" href="/assets/favicon/apple-touch-icon-57x57.png">
  <link rel="apple-touch-icon" sizes="60x60" href="/assets/favicon/apple-touch-icon-60x60.png">
  <link rel="apple-touch-icon" sizes="72x72" href="/assets/favicon/apple-touch-icon-72x72.png">
  <link rel="apple-touch-icon" sizes="76x76" href="/assets/favicon/apple-touch-icon-76x76.png">
  <link rel="apple-touch-icon" sizes="114x114" href="/assets/favicon/apple-touch-icon-114x114.png">
  <link rel="apple-touch-icon" sizes="120x120" href="/assets/favicon/apple-touch-icon-120x120.png">
  <link rel="apple-touch-icon" sizes="144x144" href="/assets/favicon/apple-touch-icon-144x144.png">
  <link rel="apple-touch-icon" sizes="152x152" href="/assets/favicon/apple-touch-icon-152x152.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/favicon/apple-touch-icon-180x180.png">
  <link rel="icon" type="image/png" href="/assets/favicon/favicon-32x32.png" sizes="32x32">
  <link rel="icon" type="image/png" href="/assets/favicon/favicon-194x194.png" sizes="194x194">
  <link rel="icon" type="image/png" href="/assets/favicon/favicon-96x96.png" sizes="96x96">
  <link rel="icon" type="image/png" href="/assets/favicon/android-chrome-192x192.png" sizes="192x192">
  <link rel="icon" type="image/png" href="/assets/favicon/favicon-16x16.png" sizes="16x16">
  <link rel="manifest" href="/assets/favicon/manifest.json">
  <link rel="mask-icon" href="/assets/favicon/safari-pinned-tab.svg" color="#ffffff">
  <meta name="msapplication-TileColor" content="#ffffff">
  <meta name="msapplication-TileImage" content="/assets/favicon/mstile-144x144.png">
  <meta name="theme-color" content="#ffffff">
  <!-- Styles -->
  @if (app('env') == 'local' )
    <link href="{{ url('/assets/front/screen.css') }}" rel="stylesheet">
  @else
    <link href="{{ url('/assets/front/screen.min.css') }}" rel="stylesheet">
  @endif

  @if($google_analytics)
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id={{ $google_analytics }}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '{{ $google_analytics }}');
    </script>
  @endif
</head>
<body>
  <div class="page @yield('page_class')">
    @include('components.header')
    @yield('content')
    @if (app('env') == 'local' )
      <script src="{{ url('/assets/front/scripts.js') }}"></script>
    @else
      <script src="{{ url('/assets/front/scripts.min.js') }}"></script>
    @endif
  </div>
</body>
</html>

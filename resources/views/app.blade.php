<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>@yield('page_title')</title>
  <meta name="description" content="[site]">
  <meta name="keywords" content="[site]">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta property="fb:admins" content="569403070">
  <meta property="fb:app_id" content="307156226006266">
  <meta name="theme-color" content="#ffffff">
  <meta name="apple-mobile-web-app-title" content="[site]">
  <meta name="application-name" content="[site]">
  <meta name="msapplication-TileColor" content="#ffffff">
  <meta name="theme-color" content="#ffffff">
  <meta property="og:locale" content="en_EN" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="@yield('page_title')" />
  <meta property="og:description" content="[site]" />
  <meta property="og:image" content="/assets/favicon/favicon-194x194.png" />
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
    <link href="{{ url('/dist/screen.css') }}" rel="stylesheet">
  @else
    <link href="{{ url('/dist/screen.min.css') }}" rel="stylesheet">
  @endif
</head>
<body>
  <div class="page @yield('page_class')">
  <!-- header -->
  <header class="primary-header">
    <h1 class="primary-title">
      <a href="{{ url('/') }}" id="infos-button">Variable 3000</a>
    </h1>
    <nav class="primary-nav">
      <ul class="nav">
        <li class="nav__item" id="link-next"><a href="{{ url('/') }}" class="nav__link">Home</a></li>
      </ul>
    </nav>
  </header>
  @yield('content')
  @if (app('env') == 'local' )
    <script src="{{ url('/dist/scripts.js') }}"></script>
  @else
    <script src="{{ url('/dist/scripts.min.js') }}"></script>
  @endif
  </div>
</body>
</html>

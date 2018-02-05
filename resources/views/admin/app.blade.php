<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  @yield('meta')
  <title>@yield('page_title')</title>
  <!-- Styles -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
  <link href="{{ url('/css/admin/main.css') }}" rel="stylesheet">
</head>
<body  class="admin @yield('page_class')">
  @if (Auth::check())  @include('admin.components.navigation-primary') @endif
  <div class="container-fluid">
    <div class="row">
      @if(Auth::check())
        @include('admin.components.navigation-secondary')
        <main class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
      @else
        <main>
      @endif
      @yield('content')
      </main>
    </div>
  </div>
  <!-- JavaScripts -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.3/jquery.min.js" integrity="sha384-I6F5OKECLVtK/BL+8iSLDEHowSAfUo76ZL9+kGAgTRdiByINKJaqTPH/QVNS1VDb" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
  <script src="{{ url('/assets/admin/scripts.min.js') }}"></script>
  @yield('scripts')
</body>
</html>

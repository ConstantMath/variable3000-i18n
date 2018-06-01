<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  @yield('meta')
  <title>@yield('page_title')</title>
  <!-- Styles -->
  <link href="{{ url('/assets/admin/main.css') }}" rel="stylesheet">
</head>
<body  class="admin @yield('page_class')">
  @include('admin.components.flash-message')
  @if (Auth::check())  @include('admin.components.navigation-primary') @endif
  <main class="main-content wrapper">
      @yield('content')
  </main>
  @include('admin.components.footer')
  <!-- JavaScripts -->
  <script type="text/javascript">
  @if(!empty(config('translatable.locales')) && count(config('translatable.locales')) > 1)
      var admin_url = '/{{config('translatable.locales')[0]}}/admin';
    @else
      var admin_url = '/admin';
    @endif
  </script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.3/jquery.min.js" integrity="sha384-I6F5OKECLVtK/BL+8iSLDEHowSAfUo76ZL9+kGAgTRdiByINKJaqTPH/QVNS1VDb" crossorigin="anonymous"></script>
  <script src="//code.jquery.com/jquery-1.10.2.min.js"></script>
  <script src="//cdn.datatables.net/1.10.7/js/jquery.dataTables.min.js"></script>
  <script src="{{ url('/assets/admin/scripts.min.js') }}"></script>
  @yield('scripts')
</body>
</html>

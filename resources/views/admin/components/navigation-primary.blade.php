<nav class="navbar navbar-fixed-top nav-primary">
  <div class="container-fluid">
    <div class="navbar-header">
      <!-- Collapsed Hamburger -->
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#app-navbar-collapse">
        <span class="sr-only">Toggle Navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <!-- Branding Image -->
      <a class="navbar-brand" href="{{ url('/admin') }}"><img src="{{ url('/assets/admin/images/5.png') }}" width="32" height="32" /></a>
    </div>
    <div class="collapse navbar-collapse" id="app-navbar-collapse">
      <!-- Right Side Of Navbar -->
      <ul class="nav navbar-nav navbar-right">
        {{-- <!-- Authentication Links --> --}}
        @if (Auth::guest())
          <li><a href="{{ url('/login') }}">Login</a></li>
          <li><a href="{{ url('/register') }}">Register</a></li>
        @else
          <li class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
              {{ Auth::user()->name }} <span class="caret"></span>
            </a>
            <ul class="dropdown-menu" role="menu">
              <li><a href="{{ route('logout') }}" onclick="event.preventDefault(); document.getElementById('logout-form').submit();"><i class="fa fa-btn fa-sign-out"></i>Logout</a></li>
            </ul>
          </li>
        @endif
      </ul>
    </div>
  </div>
</nav>
{{-- Logout form since Lrvl 5.3 arr This prevents other web applications from logging your users out of your application. --}}
<form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">{{ csrf_field() }}</form>

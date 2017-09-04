<!-- header -->
<header class="primary-header">
  <ul class="lang">
    <li class="lang__item @if (app()->getLocale() == "fr") active @endif"><a href="{{ route('lang.switch', "fr") }}" class="lang__link">Fr</a></li>
    <li class="lang__item @if (app()->getLocale() == "en") active @endif"><a href="{{ route('lang.switch', "en") }}" class="lang__link">En</a></li>
  </ul>
  <h1 class="primary-title">
    <a href="{{ url('/') }}" id="infos-button">Variable</a>
  </h1>
  <nav class="primary-nav">
    <ul class="nav">
      <li class="nav__item" id="link-next"><a href="{{ url('/') }}" class="nav__link">Home</a></li>
    </ul>
  </nav>
</header>

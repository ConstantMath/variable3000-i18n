<nav class="navbar navbar--fixed-top nav--primary">
    <div class="navbar__nav">
      <!-- Left Side Of Navbar -->
      <ul class="navbar__list navbar__list--left">
        <li><a href="{{ url('./') }}">Variable</a></li>
        <li>{!! link_to_route('homepage', 'Projets') !!}</li>
        <li>{!! link_to_route('pages.index', 'Pages') !!}</li>
      </ul>
      <!-- Right Side Of Navbar -->
      @if(count(config('translatable.locales')) > 1 )
      <ul class="navbar__list navbar__list--right">
        @foreach (config('translatable.locales') as $lang)
          <li class="lang__item @if (app()->getLocale() ==  $lang) active @endif"><a href="{{ route('lang.switch', $lang) }}" class="lang__link">{{ $lang }}</a></li>
        @endforeach
      </ul>
      @endif
    </div>
</nav>

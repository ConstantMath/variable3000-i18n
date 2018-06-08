<!-- header -->
{{-- <header class="primary-header">
  @if(count(config('translatable.locales')) > 1 )
  <ul class="lang">
    @foreach (config('translatable.locales') as $lang)
      <li class="lang__item @if (app()->getLocale() ==  $lang) active @endif"><a href="{{ route('lang.switch', $lang) }}" class="lang__link">{{ $lang }}</a></li>
    @endforeach
  </ul>
  @endif
  <h1 class="primary-title">
    <a href="{{ url('/') }}" id="infos-button">Variable</a>
  </h1>
  <nav class="primary-nav">
    <ul class="nav">
      <li class="nav__item" id="link-next"><a href="{{ url('/') }}" class="nav__link">Home</a></li>
    </ul>
  </nav>
</header> --}}

<nav class="navbar nav--secondary">
  <ul class="navbar__list">
  @foreach ($articles as $article)
    <li>
      <a href="{{ route('pages.show', [$article->slug]) }}">{{ $article->title }}</a>
      @if($article->publishedChildren)
        <ul>
        @foreach ($article->publishedChildren as $child)
          <li>
            <a href="{{ route('pages.show', [$article->id]) }}">{{ $child->title }}</a>
          </li>
        @endforeach
        </ul>
      @endif
    </li>
  @endforeach
  </ul>
</nav>

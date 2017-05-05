@extends('app')

@section('content')
  <main class="wrapper" id="main">
    <!-- articles -->
    <ul>
    @foreach ($articles as $article)
      <li>
        {{ $article->title }}
        @if($article->children)
          <ul>
          @foreach ($article->children as $child)
            <li>
              <a href="{{ route('articles.show', [$child->parent_id, $child->slug]) }}">{{ $child->title }}</a>
            </li>
          @endforeach
          </ul>
        @endif
      </li>
    @endforeach
    </ul>
    <!-- /articles -->
  </main>
@endsection

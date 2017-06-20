@extends('app')

@section('page_title', $data['page_title'])
@section('page_class', $data['page_class'])

@section('content')
  <main class="wrapper" id="main">
    <!-- articles -->
    <ul>
    @foreach ($articles as $article)
      <li>
        {{ $article->title }}
        @if($article->publishedChildren)
          <ul>
          @foreach ($article->publishedChildren as $child)
            <li>
              <a href="{{ route('articles.show', [$child->slug]) }}">{{ $child->title }}</a>
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

@extends('app')

@section('page_title', $data['page_title'])
@section('page_class', $data['page_class'])

@section('content')
  <main class="main">
    <!-- articles -->
    <ul class="gallery">
    @foreach ($articles as $article)
      <li class="gallery__item">
        <a class="item__content" href="{{ route('articles.show', [$article->slug]) }}">
          @if($article->getMedia('une')->first())
            <img src="{{ url('/imagecache/large') }}/{{ $article->getMedia('une')->first()->id }}/{{ $article->getMedia('une')->first()->file_name }}">
          @endif
          <div class="item__title">{{ $article->title }}</div>
        </a>
      </li>
    @endforeach
    </ul>
    <!-- /articles -->
  </main>
@endsection

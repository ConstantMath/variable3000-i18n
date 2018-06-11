@extends('app')

@section('page_title', $data['page_title'])
@section('page_class', $data['page_class'])

@section('content')
@include('components.nav-secondary')
  <main class="wrapper main">
    <!-- article -->
    <article>
      <h1 class="article__title">{{ $article->title }}</h1>
      <div class="article__slideshow">
        @if($article->getMedia('une')->first())
          <div class="slideshow__item featured">
            <img src="{{ url('/imagecache/large') }}/{{ $article->getMedia('une')->first()->id }}/{{ $article->getMedia('une')->first()->file_name }}">
          </div>
        @endif
        @if ($article->getMedia('gallery'))
          @foreach($article->getMedia('gallery') as $media)
            @if (str_contains($media->mime_type, "image"))
              <div class="slideshow__item">
                <img src="{{ url('/imagecache/large') }}/{{ $media->id }}/{{ $media->file_name }}" alt="{{ $media->alt }}">
              </div>
            @endif
          @endforeach
        @endif
      </div>
      <p class="article__intro">{{ $article->intro }}</p>
      <!-- content -->
      <div class="body">
        @markdown($article->text)
      </div>
      <!-- /content -->
      <!-- gallery -->

      <!-- /gallery -->
      <!-- category -->
      @if ($article->category)
      <ul>
        @foreach($article->category as $category)
          <li>{{$category->name}}</li>
        @endforeach
      </ul>
      @endif
      <!-- /category -->
      <!-- tags -->
      @if ($article->theTags)
      <ul>
        @foreach($article->theTags as $tag)
          <li>{{$tag->name}}</li>
        @endforeach
      </ul>
      @endif
      <!-- /tags -->
    </article>
    <!-- /article -->
  </main>
@endsection

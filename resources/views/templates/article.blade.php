@extends('app')

@section('page_title', $data['page_title'])
@section('page_class', $data['page_class'])

@section('content')
  <main class="wrapper" id="main">
    <!-- article -->
    <article>
      <h1>{{ $article->title }}</h1>
      @if($article->imageUne)
        <a href="{{ url('/imagecache/large') }}/{{ $article->imageUne->name }}">
          <img src="{{ url('/imagecache/small') }}/{{ $article->imageUne->name }}" alt"{{ $article->imageUne->alt }}">
        </a>
      @endif
      <p style="font-size:24px">{{ $article->intro }}</p>
      <!-- content -->
      @markdown($article->text)
      <!-- /content -->
      <!-- gallery -->
      @if ($article->medias)
      <section class="gallery block-fade">
        @foreach($article->medias as $media)
          <div class="gallery__media" style="display:inline-block; margin:30px;">
            <a href="{{ url('/imagecache/large') }}/{{ $media->name }}">
              <img src="{{ url('/imagecache/small') }}/{{ $media->name }}" alt="{{ $media->alt }}">
            </a>
          </div>
        @endforeach
      </section>
      @endif
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

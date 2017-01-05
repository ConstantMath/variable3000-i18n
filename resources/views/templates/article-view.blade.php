@extends('app')

@section('content')
<div class="container">
  <div class="row">
    <div class="col-md-10 col-md-offset-1">
    @if($article)
      <div class="page-header"><h2>{{ $article->title }}</h2></div>
      {!! $article->text !!}
    @endif
    @unless ($article->tags->isEmpty())
      <h3>Tags:</h3>
      <ul>
      @foreach($article->tags as $tag)
        <li>{{ $tag->name }}</li>
      @endforeach
      </ul>
    @endunless
    </div>
  </div>
</div>
@endsection

@extends('admin.app')

@section('page_title', $data['page_title'])
@section('page_class', $data['page_class'])

@section('content')
      @if(isset($article->id))
        {!! Form::model($article, ['route' => ['admin.articles.update', $article->id], 'method' => 'put', 'class' => 'panel panel-edit main-form', 'id' => 'main-form', 'files' => true]) !!}
      @else
        {!! Form::model($article, ['route' => ['admin.articles.store'], 'method' => 'post', 'class' => 'panel panel-edit main-form', 'id' => 'main-form', 'files' => true]) !!}
      @endif
        <div class="panel-heading">
          {{$parent->title or 'Edit' }}
          @if(isset($article->id))
          <div class="tip pull-right created_at">
            {!! Form::text('created_at', null, ['class' => 'form-control created_at']) !!}
          </div>
          @endif
        </div>
        <div id="validation"></div>
        @include('admin.components.article-form', ['submitButtonText' => 'Save'])
    {!! Form::close() !!}
    <div class="article-aside">
      @include('admin.components.article-aside')
    </div>

    @if(isset($article->id))
      <ul class="panel-footer">
        <li>
          @include('admin.components.delete-form', ['model' => $article, 'model_name' => 'articles'])
        </li>
        <li>
          <a href="{{ url('/') }}/{{ $article->slug }}" class="link" target="_blank"> preview</a>
        </li>
      </ul>
    @endif
  </div>
@endsection

@section('meta')
  <meta name="csrf-token" content="{{ csrf_token() }}" />
@endsection

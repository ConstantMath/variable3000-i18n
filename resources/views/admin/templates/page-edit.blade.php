@extends('admin.app')

@section('page_title', $data['page_title'])
@section('page_class', $data['page_class'])

@section('content')
    @if(isset($article->id))
      <div class="edit__header">
        <h1 class="edit__title">Edit</h1>
      </div>
      {!! Form::model($article, ['route' => ['admin.pages.update', $article->id], 'method' => 'put', 'class' => 'panel panel-edit main-form', 'id' => 'main-form', 'files' => true]) !!}
    @else
      <div class="edit__header">
        <h1 class="edit__title">Create</h1>
      </div>
      {!! Form::model($article, ['route' => ['admin.pages.store'], 'method' => 'post', 'class' => 'panel panel-edit main-form', 'id' => 'main-form', 'files' => true]) !!}
    @endif
        <div id="validation"></div>
        @include('admin.components.page-form', ['submitButtonText' => 'Save'])
        {!! Form::close() !!}
        <div class="article-aside">
          @include('admin.components.aside-medias')
        </div>
        @if(isset($article->id))
          <ul class="panel-footer">
            <li>@include('admin.components.delete-form', ['model' => $article, 'model_name' => 'pages'])</li>
            <li><a href="{{ url('/') }}/{{ $article->slug }}" class="link" target="_blank">{{ __('admin.preview') }}</a> {{ __('admin.on_website') }}</li>
          </ul>
        @endif
    @endsection

@section('meta')
  <meta name="csrf-token" content="{{ csrf_token() }}" />
@endsection

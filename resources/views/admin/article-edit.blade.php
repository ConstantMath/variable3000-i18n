@extends('admin.layouts.app')

@section('content')
<div class="row">
  <div class="col-sm-8 col-md-7 col-md-offset-1 col-lg-7 col-md-offset-2">
    <div class="panel panel-default">
      <div class="panel-heading">Ajouter un article</div>
      <div class="panel-body">
        <div class="col-sm-12">
          <div id="validation"></div>
          {!! Form::model($article, ['route' => ['admin.articles.update', $article->id], 'method' => 'put', 'class' => 'form-horizontal panel']) !!}
            @include('admin.partials.article-form', ['submitButtonText' => 'Save'])
          {!! Form::close() !!}
        </div>
      </div>
    </div>
  </div>
  <div class="col-sm-4 col-md-3 col-lg-3">
    @include('admin.partials.article-image-une-panel')
    @include('admin.partials.article-medias-panel')
    @include('admin.partials.article-delete-form')
  </div>
</div>
@endsection

@section('meta')
  <meta name="csrf-token" content="{{ csrf_token() }}" />
@endsection

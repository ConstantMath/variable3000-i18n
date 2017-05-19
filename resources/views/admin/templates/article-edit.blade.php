@extends('admin.app')

@section('page_title', $data['page_title'])
@section('page_class', $data['page_class'])

@section('content')
  <div class="row">
    <div class="col-sm-8 col-md-7 col-md-offset-1 col-lg-7 col-md-offset-2 article-edit">
      @if(isset($article->id))
        {!! Form::model($article, ['route' => ['articles.update', $article->id], 'method' => 'put', 'class' => 'panel main-form', 'id' => 'main-form', 'files' => true]) !!}
      @else
        {!! Form::open(['url' => 'admin/articles','class' => 'panel', 'id' => 'main-form', 'files' => true]) !!}
      @endif
      <div class="panel panel-default">
        <div class="panel-heading">
          {{$parent->title or 'Edit' }}
          @if(isset($article->created_at))
          <div class="tip pull-right created_at">
            <span>{{ $article->created_at }}</span>
            {!! Form::text('created_at', null, ['class' => 'form-control']) !!}
          </div>
          @endif
        </div>
        <div class="panel-body">
          <div class="col-sm-12">
            <div id="validation"></div>
            @include('admin.components.article-form', ['submitButtonText' => 'Save'])
          </div>
        </div>
      </div>
      {!! Form::close() !!}
      @if(isset($article->id))
        <ul class="nav navbar-nav">
          <li>
            @include('admin.components.article-delete-form')
          </li>
          <li>
            <a href="{{ url('/') }}/{{ $article->slug }}" target="_blank"><i class="fa fa-eye"></i> preview</a>
          </li>
        </ul>
      @endif
    </div>
    <div class="col-sm-4 col-md-3 col-lg-3">
      @include('admin.components.article-aside')
    </div>
  </div>
@endsection

@section('meta')
  <meta name="csrf-token" content="{{ csrf_token() }}" />
@endsection

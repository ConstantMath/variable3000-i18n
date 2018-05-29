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
            <span>{{ $article->created_at }}</span>
            {!! Form::text('created_at', null, ['class' => 'form-control']) !!}
          </div>
          @endif
        </div>
        <div class="panel-body">
          <div id="validation"></div>
          @include('admin.components.article-form', ['submitButtonText' => 'Save'])
        </div>
      {!! Form::close() !!}
    </div>
    <div class="article-aside">
      @include('admin.components.article-aside')
    </div>

    @if(isset($article->id))
      <ul class="nav navbar-nav">
        <li>
          @include('admin.components.delete-form', ['model' => $article, 'model_name' => 'articles'])
        </li>
        <li>
          <a href="{{ url('/') }}/{{ $article->slug }}" target="_blank"><i class="fa fa-eye"></i> preview</a>
        </li>
      </ul>
    @endif
  </div>
@endsection

@section('meta')
  <meta name="csrf-token" content="{{ csrf_token() }}" />
@endsection

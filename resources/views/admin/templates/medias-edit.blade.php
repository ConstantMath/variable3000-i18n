@extends('admin.app')

@section('page_title', $data['page_title'])
@section('page_class', $data['page_class'])

@section('content')
  @if(isset($article->id))
    {!! Form::model($article, ['route' => ['admin.medias.update', $article->id ], 'method' => 'put', 'class' => 'form-horizontal panel main-form', 'id' => 'main-form']) !!}
  @else
    {!! Form::model($article, ['route' => ['admin.medias.store'], 'method' => 'post', 'class' => 'form-horizontal panel', 'id' => 'main-form']) !!}
  @endif
  <div class="panel panel-default panel-edit panel-edit--single panel-settings">
    <div class="panel-heading">
      Edit media
    </div>
    <div id="validation"></div>
    <div class="panel-body">
        <div class="form-group">
          {{ Form::label('name', 'Name') }}
          {{ Form::text('name', null, array('class' => 'form-control')) }}
          {!! $errors->first('name', '<span class="help-block">:message</span>') !!}
        </div>
        {{-- Submit buttons --}}
      </div>
      @include('admin.components.form-submit')
      <div class="panel-footer">
      {!! Form::close() !!}
      @if(isset($article->id))
          @include('admin.components.delete-form', ['model' => $article, 'model_name' => 'medias'])
      @endif
    </div>
  </div>

@endsection

@section('meta')
  <meta name="csrf-token" content="{{ csrf_token() }}" />
@endsection

@extends('admin.app')

@section('page_title', $data['page_title'])
@section('page_class', $data['page_class'])

@section('content')
  @foreach ($errors->all() as $error)
      <span class="help-block">{{ $error }}</span>
  @endforeach
  <div class="panel panel-default panel-edit panel-edit--single panel-settings">
    @if(isset($media->id))
      <div class="panel-heading">
        <div class="edit__header">
          <h1 class="edit__title">Edit media</h1>
        </div>
      </div>
      {!! Form::model($media, ['route' => ['admin.medias.update', $media->id ], 'method' => 'put', 'class' => 'form-horizontal panel main-form', 'id' => 'main-form', 'files'=>'true']) !!}
    @else
      <div class="panel-heading">
        <div class="edit__header">
          <h1 class="edit__title">Create media</h1>
        </div>
      </div>
      {!! Form::model($media, ['route' => ['admin.medias.storeandlink', 'associated_model'], 'method' => 'post', 'class' => 'form-horizontal panel', 'id' => 'main-form', 'files'=>'true']) !!}
    @endif
    {!! Form::hidden('model_type', $media->model_type) !!}
    {!! Form::hidden('model_id', $media->model_id) !!}
    <div id="validation"></div>
    <div class="panel-body">
      <div class="form-group model">
        <label for="tags_general">Article lié</label>
        {!! Form::select('associated_article', $articles, '', ['class' => 'form-control select2', 'id' => 'associated_model']) !!}
      </div>
      @if(!empty($media->id))
      <div class="file">
        <img src="{{ $media->getUrl() }}" style="max-width:100%">
      </div>
      @endif
      <div class="form-group">
        {{ __('admin.select_file') }}
        {{Form::file('file')}}
      </div>
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
      @if(isset($media->id))
        @include('admin.components.delete-form', ['model' => $media, 'model_name' => 'medias'])
      @endif
    </div>
  </div>

@endsection

@section('meta')
  <meta name="csrf-token" content="{{ csrf_token() }}" />
@endsection

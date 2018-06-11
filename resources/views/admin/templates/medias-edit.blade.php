@extends('admin.app')

@section('page_title', $data['page_title'])
@section('page_class', $data['page_class'])

@section('content')
  @if(isset($media->id))
    {!! Form::model($media, ['route' => ['admin.medias.update', $media->id ], 'method' => 'put', 'class' => 'form-horizontal panel main-form', 'id' => 'main-form', 'files'=>'true']) !!}
  @else
    {!! Form::model($media, ['route' => ['admin.medias.store'], 'method' => 'post', 'class' => 'form-horizontal panel', 'id' => 'main-form', 'files'=>'true']) !!}
  @endif
  {!! Form::hidden('model_type', $media->model_type) !!}
  {!! Form::hidden('model_id', $media->model_id) !!}
  <div class="panel panel-default panel-edit panel-edit--single panel-settings">
    <div class="panel-heading">
      Edit media
    </div>
    <div id="validation"></div>
    <div class="panel-body">
      <div class="file">
        <?php // TODO: test par type de médias + style affichage media ?>
        <img src="{{ $media->getUrl() }}" style="max-width:100%">
      </div>
      <div class="form-group">
        {{ __('admin.select_file') }}
        {{Form::file('file')}}
      </div>
      <div class="form-group">
        {{ Form::label('name', 'Name') }}
        {{ Form::text('name', null, array('class' => 'form-control')) }}
        {!! $errors->first('name', '<span class="help-block">:message</span>') !!}
      </div>
      <div class="form-group">
        <label for="tags_general">Article lié</label>
        {!! Form::select('articles', $articles, '', ['class' => 'form-control select2', 'id' => 'linkto']) !!}
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

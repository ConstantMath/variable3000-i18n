@extends('admin.app')

@section('page_title', $data['page_title'])
@section('page_class', $data['page_class'])

@section('content')
  @if(isset($taxonomy->id))
    {!! Form::model($taxonomy, ['route' => ['admin.taxonomies.update', $taxonomy->id ], 'method' => 'put', 'class' => 'form-horizontal panel main-form', 'id' => 'main-form']) !!}
  @else
    {!! Form::model($taxonomy, ['route' => ['admin.taxonomies.store'], 'method' => 'post', 'class' => 'form-horizontal panel main-form', 'id' => 'main-form']) !!}
  @endif
  {!! Form::hidden('parent_id', $taxonomy->parent->id) !!}
  {!! Form::hidden('order', (!empty($taxonomy->order))? $taxonomy->order : 0) !!}

  <div class="panel panel-edit panel-edit--single panel-default">
    <div class="panel-heading">
      <div class="edit__header">
        <h1 class="edit__title">{{ $taxonomy->parent->name }}</h1>
      </div>
    </div>
    <div class="panel-body">
        {{-- Validation errors --}}
        @foreach ($errors->all() as $error)
          <span class="help-block">{{ $error }}</span>
        @endforeach
        {{-- Name --}}
        @foreach (config('translatable.locales') as $lang)
        <div class="form-group {!! $errors->has('name') ? 'has-error' : '' !!}">
        <label for="name">Name ({{ $lang }})</label>
        {!! Form::text($lang.'[name]', (!empty($taxonomy->id) && !empty($taxonomy->translate($lang)->name))? $taxonomy->translate($lang)->name : '', ['class' => 'form-control', 'placeholder' => 'Name']) !!}
        {!! $errors->first('name', '<span class="help-block">:message</span>') !!}
        <span class="slug">
          @if(isset($taxonomy->slug))
            <i class="fa fa-link "></i>&nbsp;{{ (!empty($taxonomy->id) && !empty( $taxonomy->translate($lang)->slug))? $taxonomy->translate($lang)->slug : '' }}
          @endif
        </span>
        </div>
        @endforeach
        {{-- Submit buttons --}}

    </div>
    <div class="submit">
      {!! Form::submit('save', ['class' => 'btn btn-primary', 'name' => 'finish']) !!}
    </div>
    {!! Form::close() !!}
    <div class="panel-footer">
      @if(isset($taxonomy->id))
        @include('admin.components.delete-form', ['model' => $taxonomy, 'model_name' => 'taxonomies'])
      @endif
    </div>
  </div>
@endsection

@section('meta')
  <meta name="csrf-token" content="{{ csrf_token() }}" />
@endsection

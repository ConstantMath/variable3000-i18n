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

  <div class="panel panel-default panel-taxonomy">
    <div class="panel-heading">
      {{ $taxonomy->parent->name }}
    </div>
    <div class="panel-body">
      <div class="col-sm-12">
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
        <div class="form-group submit">
          {!! Form::submit('save', ['class' => 'btn btn-invert', 'name' => 'save']) !!}
        </div>
      </div>
    </div>
  </div>
  {!! Form::close() !!}
  @if(isset($taxonomy->id))
    {!! Form::model($taxonomy, ['route' => ['admin.taxonomies.destroy', $taxonomy->id], 'method' => 'post', 'class' => 'form-horizontal', 'name' => 'delete-form']) !!}
      {{ Form::hidden('_method', 'DELETE') }}
      <a href="#" class="" data-toggle="modal" data-target="#confirm-delete"><i class="fa fa-trash"></i> delete</a>
      <div class="modal fade" id="confirm-delete" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 class="modal-title" id="myModalLabel">Are you sure ?</h4>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" onclick="document.forms['delete-form'].submit();">Delete</button>
            </div>
          </div>
        </div>
      </div>
    {{ Form::close() }}
  @endif
@endsection

@section('meta')
  <meta name="csrf-token" content="{{ csrf_token() }}" />
@endsection

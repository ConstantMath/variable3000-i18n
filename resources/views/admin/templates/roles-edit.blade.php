@extends('admin.app')

@section('page_title', $data['page_title'])
@section('page_class', $data['page_class'])

@section('content')
  <div class="panel panel-default panel-edit panel-edit--single panel-settings">
      @if(isset($role->id))
        <div class="panel-heading">
          <div class="edit__header">
            <h1 class="edit__title">Edit role</h1>
          </div>
        </div>
        {!! Form::model($role, ['route' => ['admin.roles.update', $role->id ], 'method' => 'put', 'class' => 'form-horizontal panel main-form', 'id' => 'main-form']) !!}
      @else
        <div class="panel-heading">
          <div class="edit__header">
            <h1 class="edit__title">Create role</h1>
          </div>
        </div>
        {!! Form::model($role, ['route' => ['admin.roles.store'], 'method' => 'post', 'class' => 'form-horizontal panel', 'id' => 'main-form']) !!}
      @endif
    <div id="validation"></div>
    <div class="panel-body">
        <div class="form-group">
          {{ Form::label('name', 'Name') }}
          {{ Form::text('name', null, array('class' => 'form-control')) }}
          {!! $errors->first('name', '<span class="help-block">:message</span>') !!}
        </div>
        <div class='form-group'>
          <h3>Assign Permissions</h3>
          @foreach ($permissions as $permission)
            {{ Form::checkbox('permissions[]',  $permission->id ) }}
            {{ Form::label($permission->name, ucfirst($permission->name)) }}<br>
          @endforeach
          {!! $errors->first('permissions', '<span class="help-block">:message</span>') !!}
        </div>
        {{-- Submit buttons --}}
      </div>
      <div class="submit">
        {!! Form::submit('save', ['class' => 'btn btn-primary']) !!}
      </div>
      <div class="panel-footer">
      {!! Form::close() !!}
      @if(isset($role->id))
          @include('admin.components.delete-form', ['model' => $role, 'model_name' => 'roles'])
      @endif
    </div>
  </div>

@endsection

@section('meta')
  <meta name="csrf-token" content="{{ csrf_token() }}" />
@endsection

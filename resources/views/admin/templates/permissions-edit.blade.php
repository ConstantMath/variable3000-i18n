@extends('admin.app')

@section('page_title', $data['page_title'])
@section('page_class', $data['page_class'])

@section('content')
  @if(isset($permission->id))
    {!! Form::model($permission, ['route' => ['admin.permissions.update', $permission->id ], 'method' => 'put', 'class' => 'form-horizontal panel main-form', 'id' => 'main-form']) !!}
  @else
    {!! Form::model($permission, ['route' => ['admin.permissions.store'], 'method' => 'post', 'class' => 'form-horizontal panel', 'id' => 'main-form']) !!}
  @endif
  <div class="panel panel-default">
    <div class="panel-heading">
      Edit permission
    </div>
    <div class="panel-body">
      <div class="col-sm-12">
        <div id="validation"></div>
        {{-- Name --}}
        <div class="form-group">
           {{ Form::label('name', 'Name') }}
           {!! Form::text('name', null, ['class' => 'form-control', 'placeholder' => 'Name']) !!}
           {!! $errors->first('name', '<span class="help-block">:message</span>') !!}
        </div>
        @if(!empty($roles) && !isset($permission->id))
        <div class='form-group'>
          <label for="roles">Assign Permission to Roles</label>
          <div>
          @foreach ($roles as $role)
            {{ Form::checkbox('roles[]',  $role->id ) }}
            {{ Form::label($role->name, ucfirst($role->name)) }}<br>
          @endforeach
          </div>
        </div>
        @endif
        {{-- Submit buttons --}}
        <div class="form-group submit">
          {!! Form::submit('save', ['class' => 'btn btn-invert']) !!}
        </div>
      </div>
    </div>
  </div>
  {!! Form::close() !!}
  @if(isset($permission->id))
    @include('admin.components.delete-form', ['model' => $permission, 'model_name' => 'permissions'])
  @endif
@endsection

@section('meta')
  <meta name="csrf-token" content="{{ csrf_token() }}" />
@endsection

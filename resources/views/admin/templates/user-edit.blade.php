@extends('admin.app')

@section('page_title', $data['page_title'])
@section('page_class', $data['page_class'])

@section('content')
  @if(isset($user->id))
    {!! Form::model($user, ['route' => ['admin.users.update', $user->id ], 'method' => 'put', 'class' => 'form-horizontal panel main-form', 'id' => 'main-form']) !!}
  @else
    {!! Form::model($user, ['route' => ['admin.users.store'], 'method' => 'post', 'class' => 'form-horizontal panel', 'id' => 'main-form']) !!}
  @endif
  <div class="panel panel-edit panel-edit--single panel-default">
    <div class="panel-heading">
      Edit user
    </div>
    <div id="validation"></div>
    <div class="panel-body">
        {{-- Name --}}
        <div class="form-group {!! $errors->has('name') ? 'has-error' : '' !!}">
          <label for="name">Title</label>
          {!! Form::text('name', null, ['class' => 'form-control', 'placeholder' => 'Name']) !!}
          {!! $errors->first('name', '<span class="help-block">:message</span>') !!}
        </div>
        {{-- Email --}}
        <div class="form-group {!! $errors->has('email') ? 'has-error' : '' !!}">
          <label for="email">Email</label>
          {!! Form::text('email', null, ['class' => 'form-control', 'placeholder' => 'Email address']) !!}
          {!! $errors->first('email', '<span class="help-block">:message</span>') !!}
        </div>
        {{-- Password --}}
        <div class="pw-change-container form-group">
          <div class="form-group {!! $errors->has('password') ? 'has-error' : '' !!}">
            <label for="password">Password</label>
            {!! Form::password('password', array('id' => 'password', 'class' => 'form-control ')) !!}
            {!! $errors->first('password', '<span class="help-block">:message</span>') !!}
          </div>
          <div class="form-group {!! $errors->has('password_confirmation') ? 'has-error' : '' !!}">
            <label for="password">Password confirmation</label>
            {!! Form::password('password_confirmation', array('id' => 'password_confirmation', 'class' => 'form-control')) !!}
          </div>
          <div class='form-group'>
            <label for="roles">Roles</label>
            <div>
            @foreach ($roles as $role)
              {{ Form::checkbox('roles[]',  $role->id ) }}
              {{ Form::label($role->name, ucfirst($role->name)) }}<br>
            @endforeach
            </div>
          </div>
        </div>
    </div>
    {{-- Submit buttons --}}
    <div class="submit">
      {!! Form::submit('save', ['class' => 'btn btn-primary', 'name' => 'finish']) !!}
    </div>
    {!! Form::close() !!}
    @if(isset($user->id))
      {!! Form::model($user, ['route' => ['admin.users.destroy', $user->id], 'method' => 'post', 'class' => 'form-horizontal panel-footer', 'name' => 'delete-form']) !!}
        {{ Form::hidden('_method', 'DELETE') }}
        <a href="#" class="link" data-toggle="modal" data-target="#confirm-delete">delete</a>
        <div class="modal fade" id="confirm-delete" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title" id="myModalLabel">Are you sure ?</h4>
              </div>
              <div class="modal-btn">
                <button type="button" class="btn btn-default btn-xs" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary btn-xs" onclick="document.forms['delete-form'].submit();">Delete</button>
              </div>
            </div>
          </div>
        </div>
      {{ Form::close() }}
    @endif
  </div>
@endsection

@section('meta')
  <meta name="csrf-token" content="{{ csrf_token() }}" />
@endsection

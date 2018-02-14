@extends('admin.app')

@section('page_title', $data['page_title'])
@section('page_class', $data['page_class'])

@section('content')
  @if(isset($role->id))
    {!! Form::model($role, ['route' => ['admin.permissions.update', $role->id ], 'method' => 'put', 'class' => 'form-horizontal panel main-form', 'id' => 'main-form']) !!}
  @else
    {!! Form::model($role, ['route' => ['admin.permissions.store'], 'method' => 'post', 'class' => 'form-horizontal panel', 'id' => 'main-form']) !!}
  @endif
  <div class="panel panel-default">
    <div class="panel-heading">
      Edit role
    </div>
    <div class="panel-body">
      <div class="col-sm-12">
        <div class="form-group">
          {{ Form::label('name', 'Name') }}
          {{ Form::text('name', null, array('class' => 'form-control')) }}
        </div>
        <h5><b>Assign Permissions</b></h5>
        <div class='form-group'>
          @foreach ($permissions as $permission)
            {{ Form::checkbox('permissions[]',  $permission->id ) }}
            {{ Form::label($permission->name, ucfirst($permission->name)) }}<br>
          @endforeach
        </div>
        {{-- Submit buttons --}}
        <div class="form-group submit">
          {!! Form::submit('save', ['class' => 'btn btn-invert', 'name' => 'finish']) !!}
        </div>
      </div>
    </div>
  </div>
  {!! Form::close() !!}
  @if(isset($permission->id))
    @include('admin.components.delete-form', ['model' => 'permissions'])
  @endif
@endsection

@section('meta')
  <meta name="csrf-token" content="{{ csrf_token() }}" />
@endsection

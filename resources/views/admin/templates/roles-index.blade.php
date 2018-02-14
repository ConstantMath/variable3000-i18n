@extends('admin.app')

@section('page_title', $data['page_title'])
@section('page_class', $data['page_class'])

@section('content')
  @include('admin.components.flash-message')
  <div class="panel panel-default">
    <div class="panel-heading">
      <h3>User's roles</h3>
      <a href="{{ route('admin.roles.create') }}" class="pull-right"><i class="fa fa-plus-circle"></i> Add</a>
    </div>
    <div class="panel-body table-responsive">
      <table class="table">
        <tbody>
          @foreach ($roles as $role)
          <tr>
            <td>
              <i class="fa fa-pencil"></i>
              {!! link_to_route('admin.roles.edit', $role->name, $role->id, ['class' => '']) !!}
            </td>
          </tr>
          @endforeach
        </tbody>
      </table>
    </div>
  </div>
@endsection

@section('meta')
<meta name="csrf-token" content="{{ csrf_token() }}" />
@endsection

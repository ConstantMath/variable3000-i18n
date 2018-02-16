@extends('admin.app')

@section('page_title', $data['page_title'])
@section('page_class', $data['page_class'])

@section('content')
  <div class="panel panel-default">
    <div class="panel-heading">
      <h3>User's permissions</h3>
      <a href="{{ route('admin.permissions.create') }}" class="pull-right"><i class="fa fa-plus-circle"></i> Add</a>
    </div>
    <div class="panel-body table-responsive">
      <table class="table">
        <tbody>
          @foreach ($permissions as $permission)
          <tr>
            <td>
              <span>&rarr;</span>
              {!! link_to_route('admin.permissions.edit', $permission->name, $permission->id, ['class' => '']) !!}
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

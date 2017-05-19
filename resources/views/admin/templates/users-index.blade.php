@extends('admin.app')

@section('page_title', $data['page_title'])
@section('page_class', $data['page_class'])

@section('sub_navigation')
  @include('admin.components.admin-sub-navigation')
@endsection

@section('content')
<div class="container">
  <div class="row">
    <div class="col-md-10 col-md-offset-1">
      @include('admin.components.flash-message')
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3>Users</h3>
          <a href="{{ route('users.create') }}" class="pull-right"><i class="fa fa-plus-circle"></i> Add</a>
        </div>
        <div class="panel-body table-responsive">
          <table class="table">
            <tbody>
              @if($users) @foreach ($users as $user)
              <tr>
                <td>{!! link_to_route('users.edit', $user->name, $user->id, ['class' => '']) !!}</td>
                <td class="attribute">{{ $user->email }}</td>
              </tr>
              @endforeach @endif
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>
@endsection

@section('meta')
<meta name="csrf-token" content="{{ csrf_token() }}" />
@endsection

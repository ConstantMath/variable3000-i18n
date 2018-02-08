@extends('admin.app')

@section('page_title', $data['page_title'])
@section('page_class', $data['page_class'])

@section('content')
      @include('admin.components.flash-message')
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3>Users</h3>
          <a href="{{ route('admin.users.create') }}" class="pull-right"><i class="fa fa-plus-circle"></i> Add</a>
        </div>
        <div class="panel-body table-responsive">
          <table class="table">
            <tbody>
              @if($users) @foreach ($users as $user)
              <tr>
                <td>
                  <i class="fa fa-smile-o"></i>
                  {!! link_to_route('admin.users.edit', $user->name, $user->id, ['class' => '']) !!}
                </td>
                <td class="attribute">{{ $user->email }}</td>
              </tr>
              @endforeach @endif
            </tbody>
          </table>
        </div>
      </div>
@endsection

@section('meta')
<meta name="csrf-token" content="{{ csrf_token() }}" />
@endsection

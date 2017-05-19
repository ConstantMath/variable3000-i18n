@extends('admin.app')

@section('page_title', $data['page_title'])
@section('page_class', $data['page_class'])

@section('sub_navigation')
  @include('admin.components.admin-sub-navigation')
@endsection

@section('content')
<div class="container page-tags-index">
  <div class="row">
    <div class="col-md-10 col-md-offset-1">
      @include('admin.components.flash-message')
      @if($taxonomies) @foreach ($taxonomies as $taxonomy)
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3>{{ $taxonomy->name }}</h3>
          <a href="{{ route('taxonomies.create', $taxonomy->id) }}" class="pull-right"><i class="fa fa-plus-circle"></i> Add</a>
        </div>
        <div class="panel-body table-responsive">
          <table class="table">
            <tbody>
              @if($taxonomy->children)
                @foreach ($taxonomy->children as $child)
              <tr>
                <td>{!! link_to_route('taxonomies.edit', $child->name, $child->id, ['class' => '']) !!}</td>
              </tr>
              @endforeach @endif
            </tbody>
          </table>
        </div>
      </div>
      @endforeach @endif
    </div>
  </div>
</div>
@endsection

@section('meta')
<meta name="csrf-token" content="{{ csrf_token() }}" />
@endsection

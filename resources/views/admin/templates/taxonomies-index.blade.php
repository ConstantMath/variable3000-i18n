@extends('admin.app')

@section('page_title', $data['page_title'])
@section('page_class', $data['page_class'])


@section('content')
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
            <td><i class="fa fa-tag" aria-hidden="true"></i> {!! link_to_route('taxonomies.edit', $child->name, $child->id, ['class' => '']) !!}</td>
          </tr>
          @endforeach @endif
        </tbody>
      </table>
    </div>
  </div>
  @endforeach @endif
@endsection

@section('meta')
<meta name="csrf-token" content="{{ csrf_token() }}" />
@endsection

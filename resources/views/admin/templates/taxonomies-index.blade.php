@extends('admin.app')

@section('page_title', $data['page_title'])
@section('page_class', $data['page_class'])


@section('content')
  @include('admin.components.flash-message')
  @if($taxonomies) @foreach ($taxonomies as $taxonomy)
  <div class="panel panel-default panel-index">
    <div class="panel-heading">
      <h3>{{ $taxonomy->name }}</h3>
      <a href="{{ route('admin.taxonomies.create', $taxonomy->id) }}" class="pull-right"><i class="fa fa-plus-circle"></i> Add</a>
    </div>
    <div class="panel-body table-responsive">
      <table class="table">
        <tbody id="index" class="sortable">
          @if($taxonomy->children)
            @foreach ($taxonomy->children as $child)
          <tr url="{{ route('admin.taxonomies.reorder', $child->id) }}" parent_id="{{$child->parent_id}}">
            <td><i class="fa fa-tag" aria-hidden="true"></i> {!! link_to_route('admin.taxonomies.edit', $child->name, $child->id, ['class' => '']) !!}</td>
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

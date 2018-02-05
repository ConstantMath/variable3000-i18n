@extends('admin.app')

@section('page_title', $data['page_title'])
@section('page_class', $data['page_class'])

@section('content')
  @include('admin.components.flash-message')
  <div class="panel panel-default">
    <div class="panel-heading">
      <h3>{{ $data['page_title'] }}</h3>
      <a href="{{ route('admin.articles.create') }}" class="pull-right"><i class="fa fa-plus-circle"></i> Add</a>
    </div>
    <div class="panel-body table-responsive">
      <table class="table">
        <tbody id="index" class="sortable">
          @if($articles)
            @foreach ($articles as $node)
            <tr
              class="published published-{!! $node->published !!}"
              data-parent-id="@if(!empty($node->parent_id)){{$node->parent_id}}@endif"
              data-article-id="@if(!empty($node->id)){{$node->id}}@endif"
            >
            <td>
              <i class="fa fa-circle"></i>
              {!! link_to_route('admin.articles.edit', $node->title, [$node->id], ['class' => '']) !!}
            </td>
            <td class="attribute time">{{ $node->created_at }}</td>
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

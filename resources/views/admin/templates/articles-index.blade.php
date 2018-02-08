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
          @if($articles) @foreach ($articles as $node)
            @include('admin.components.table-row')
          @endforeach @endif
        </tbody>
      </table>
    </div>
  </div>
@endsection

@section('meta')
<meta name="csrf-token" content="{{ csrf_token() }}" />
@endsection

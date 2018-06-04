<?php
  if(!empty($parent_article)):
    $parent_id = $parent_article->id;
    $page_title = $parent_article->title;
    $bt_add_label = __('admin.add_subpage');
  else:
    $parent_id = 0;
    $page_title = $data['page_title'];
    $bt_add_label = __('admin.add');
  endif;
?>

@extends('admin.app')

@section('page_title', $data['page_title'])
@section('page_class', $data['page_class'])

@section('content')
 <div class="panel panel-default">
   <div class="panel-heading">
     <h3>{{ $page_title }}</h3>
     <a href="{{ route('admin.pages.create', $parent_id) }}" class="pull-right"><i class="fa fa-plus-circle"></i> {{ $bt_add_label }}</a>
   </div>
   <div class="panel-body table-responsive">
     <table class="table">
       <tbody id="sortable" class="sortable">
         @if($articles) @foreach ($articles as $node)
           @include('admin.components.table-row-pages')
         @endforeach @endif
       </tbody>
     </table>
   </div>
 </div>
@endsection

@section('meta')
  <meta name="csrf-token" content="{{ csrf_token() }}" />
@endsection

@section('scripts')
<script>


</script>
@endsection

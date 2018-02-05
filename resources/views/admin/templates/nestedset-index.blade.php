@extends('admin.app')

@section('page_title', $data['page_title'])
@section('page_class', $data['page_class'])

@section('content')
  @include('admin.components.flash-message')

  <div class="panel panel-default">
    <div class="panel-body table-responsive">
      {{-- level 1 --}}
      @if($articles)
        <div class="dd">
          <ol class="dd-list">
            @foreach ($articles as $node)
              @include('admin.components.nestedset-node', compact('node'))
            @endforeach
          </ol>
        </div>
      @endif
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

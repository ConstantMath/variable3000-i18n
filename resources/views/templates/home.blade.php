@extends('app')

@section('content')
<div class="container">
  <div class="row">
    <div class="col-md-10 col-md-offset-1">
    @if($publications)
      <div class="page-header"><h2>Publications</h2></div>
      @foreach ($publications as $publication)
        <li><a href="{{ URL::to('/') }}/{{ $publication->parent_id }}/{{ $publication->slug }}">{{ $publication->title }}</a></li>
        </tr>
      @endforeach
    @endif
    @if($pages)
      <div class="page-header"><h2>Pages</h2></div>
      <ul>
      @foreach ($pages as $page)
        <li><a href="{{ URL::to('/') }}/{{ $page->parent_id }}/{{ $page->slug }}">{{ $page->title }}</a></li>
      @endforeach
      </ul>
    @endif
    </div>
  </div>
</div>
@endsection

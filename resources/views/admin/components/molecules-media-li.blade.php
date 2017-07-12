<li class="list-group-item @if(empty($media)) ghost @endif"
    media-id="@if(!empty($media)){{$media->id}}@endif"
    url="@if(!empty($article->id)){{ URL::to('en/admin/articles/'.$article->id.'/reordermedia') }}@endif"
    id="media-@if (!empty($media)){{$media->id}}@endif"
>
  <a href=""
     data-toggle="modal"
     data-target="#modal-media-edit"
     data-article-id="@if(!empty($article->id)){{$article->id}}@endif"
     data-media-id="@if(!empty($media)){{ $media->id }}@endif"
     data-column-name="{{ $column_name }}"
     data-media-description="@if(!empty($media)){{ $media->description }}@endif"
     data-media-alt="@if(!empty($media)){{ $media->alt }}@endif"
     data-media-url="@if(!empty($media)){{ URL::to('/') }}/imagecache/large/{{ $media->name }}@endif"
     data-delete-link="@if(!empty($article->id)){{ route('admin.articles.deleteMedia', $article->id) }}@endif">
    @if(!empty($article->id) && !empty($media))
      @if($media->type == 'jpg' or $media->type == 'png' or $media->type == 'gif' or $media->type == 'svg' or $media->type == 'jpeg')
        <i class="fa fa-image"></i>
      @elseif($media->type == 'pdf')
        <i class="fa fa-file-pdf-o"></i>
      @else
        <i class="fa fa-file"></i>
      @endif
    @endif
    <span>@if(!empty($media)){{ $media->alt }}@endif</span>
  </a>
</li>

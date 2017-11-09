<li class="list-group-item @if(empty($media)) ghost @endif"
    data-media-id="@if(!empty($media)){{ $media->id }}@endif"
    data-article-id="@if(!empty($article->id)){{$article->id}}@endif"
>
  @if(!empty($article->id) && !empty($media))
    @if($media->ext == 'jpg' or $media->ext == 'png' or $media->ext == 'gif' or $media->ext == 'svg' or $media->ext == 'jpeg')
      <i class="fa fa-image"></i>
    @elseif($media->ext == 'pdf')
      <i class="fa fa-file-pdf-o"></i>
    @else
      <i class="fa fa-file"></i>
    @endif
  @endif
  <a href=""
    class="column-title"
    data-toggle="modal"
    data-target="#modal-media-edit"
    data-media-type="@if(!empty($media)){{ $media->type }}@endif"
    data-media-id="@if(!empty($media)){{ $media->id }}@endif"
    data-media-description="@if(!empty($media)){{ $media->description }}@endif"
    data-media-alt="@if(!empty($media)){{ $media->alt }}@endif"
    data-media-url="@if(!empty($media)){{ URL::to('/') }}/imagecache/large/{{ $media->name }}@endif"
    data-delete-link="@if(!empty($article->id)){{ route('admin.articles.deleteMedia', $article->id) }}@endif"
  >
    <span>@if(!empty($media)){{ $media->alt }}@endif</span>
  </a>
</li>

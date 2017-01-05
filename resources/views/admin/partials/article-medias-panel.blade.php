<div class="panel panel-default media-panel panel-mediagallery">
  <div class="panel-heading">Galerie</div>
  <div class="panel-body">
    <ul class="list-group" id="mediagallery">
      @if (isset($medias))
        @foreach ($medias as $media)
          <li class="list-group-item" media-id="{{ $media->id }}" url="{{ URL::to('admin/articles/'.$article->id.'/reordermedia') }}">
            <img src="/imagecache/small/{{ $media->name }}" height="20" />
            <span>{{ $media->alt }}</span>
            <a href="{{ route('admin.articles.deletemedia', $article->id) }}" media-id="{{ $media->id }}" class="m-delete"><i class="fa fa-times"></i></a>
          </li>
        @endforeach
      @endif
    </ul>
    @if (isset($article->id))
      {!! Form::model($article, ['route' => ['admin.articles.addmedia', $article->id], 'method' => 'post', 'class' => 'form-horizontal', 'id' => 'article-gallery-upload', 'autocomplete' => 'off', 'enctype' => 'multipart/form-data']) !!}
    @else
      {!! Form::model($article, ['route' => ['admin.articles.addmedia', 'null'], 'method' => 'post', 'class' => 'form-horizontal', 'id' => 'article-gallery-upload', 'autocomplete' => 'off', 'enctype' => 'multipart/form-data']) !!}
    @endif
      <input type="hidden" name="type" value="mediagallery">
      <input type="file" name="image" id="gallery-image" />
      <a href="#" class="media-add"><i class="fa fa-btn fa-plus-circle"></i> Ajouter</a>
    {!! Form::close() !!}
  </div>
</div>

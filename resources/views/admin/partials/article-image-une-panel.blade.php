<div class="panel panel-default media-panel panel-mediaune">
  <div class="panel-heading">Image une</div>
  <div class="panel-body">
    <ul class="list-group" id="mediaune">
      @if (isset($image_une))
      <li class="list-group-item" media-id="{{ $image_une->id }}">
        <img src="/imagecache/small/{{ $image_une->name }}"/><span>{{ $image_une->alt }}</span>
        <a href="{{ route('admin.articles.deletemedia', $article->id) }}" media-id="{{ $image_une->id }}" class="m-delete" type="image-une"><i class="fa fa-times"></i></a>
      </li>
      @endif
    </ul>
    @if (isset($article->id))
      {!! Form::model($article, ['route' => ['admin.articles.addmedia', $article->id], 'method' => 'post', 'class' => 'form-horizontal', 'id' => 'article-image-upload', 'autocomplete' => 'off', 'enctype' => 'multipart/form-data']) !!}
    @else
      {!! Form::model($article, ['route' => ['admin.articles.addmedia', 'null'], 'method' => 'post', 'class' => 'form-horizontal', 'id' => 'article-image-upload', 'autocomplete' => 'off', 'enctype' => 'multipart/form-data']) !!}
    @endif
      <input type="hidden" name="type" value="imageune">
      <input type="file" name="image" id="image-une" />
      <a href="#" class="media-add"><i class="fa fa-btn fa-plus-circle"></i> Ajouter</a>
    {!! Form::close() !!}
  </div>
</div>

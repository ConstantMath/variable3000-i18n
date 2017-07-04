<div class="panel panel-default media-panel panel-mediagallery" id="panel-mediagallery">
  <div class="panel-heading">Gallery</div>
  <div class="panel-body">
    <ul class="list-group @if(count($article->medias) == 0) ul-empty @endif" id="mediagallery">
      <?php $media = array(); ?>
      @include('admin.components.molecules-media-li')
      @if (isset($article->medias))
        @foreach ($article->medias as $media)
          @include('admin.components.molecules-media-li')
        @endforeach
      @endif
    </ul>
    @if (isset($article->id))
      {!! Form::model($article, ['route' => ['admin.articles.addmanymedia', $article->id], 'method' => 'post', 'class' => 'form-horizontal', 'id' => 'article-gallery-upload', 'autocomplete' => 'off', 'enctype' => 'multipart/form-data']) !!}
    @else
      {!! Form::model($article, ['route' => ['admin.articles.addmanymedia', 'null'], 'method' => 'post', 'class' => 'form-horizontal', 'id' => 'article-gallery-upload', 'autocomplete' => 'off', 'enctype' => 'multipart/form-data']) !!}
    @endif
      {!! Form::hidden('column_name', 'mediagallery') !!}
      <input type="file" name="image" id="gallery-image" />
      <a href="#" class="media-add"><i class="fa fa-btn fa-plus-circle"></i> Add</a>
    {!! Form::close() !!}
  </div>
</div>

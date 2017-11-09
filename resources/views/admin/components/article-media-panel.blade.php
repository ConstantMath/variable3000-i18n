<?php
  $medias= $article->medias->where('type', $media_type);
?>
<div class="panel panel-default media-panel" id="panel-{{ $media_type }}">
  <div class="panel-heading">{{  $panel_title }}</div>
  <div class="panel-body">
    <ul
      class="
        list-group mediagallery
        @if( count($medias) == 0) ul-empty @endif
        @if (isset($article->id)) sortable @endif"
      >
      <?php $media = array(); ?>
      @include('admin.components.molecules-media-li')
      @if (isset($medias))
        @foreach ($medias as $media)
          @include('admin.components.molecules-media-li')
        @endforeach
      @endif
    </ul>
    @if (isset($article->id))
      {!! Form::model($article, ['route' => ['admin.articles.addsinglemedia', $article->id], 'method' => 'post', 'class' => 'form-horizontal single-media-form', 'autocomplete' => 'off', 'enctype' => 'multipart/form-data', 'files'=>'true']) !!}
    @else
      {!! Form::model($article, ['route' => ['admin.articles.addsinglemedia', 'null'], 'method' => 'post', 'class' => 'form-horizontal single-media-form', 'autocomplete' => 'off', 'enctype' => 'multipart/form-data', 'files'=>'true']) !!}
    @endif
    {!! Form::hidden('type', $media_type) !!}
      {{-- Toujours placer le champs file avant le submit  --}}
      <input type="file" name="image" class="input-single-media-upload" />
      <a href="#" class="media-add"><i class="fa fa-btn fa-plus-circle"></i> Add</a>
    {!! Form::close() !!}
  </div>
</div>

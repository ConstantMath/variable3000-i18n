<?php
$panel_title = 'Featured image';
$media_type = 'une';
?>
@if($article->parent->id == 1 or $article->parent->id == 2)
  @include('admin.components.article-media-panel')
@endif

@if($article->parent->id == 1 or $article->parent->id == 2)
  <?php
  $panel_title = 'Gallery';
  $media_type = 'gallery';
  ?>
  @include('admin.components.article-media-panel')
@endif

@include('admin.components.media-edit-modal')

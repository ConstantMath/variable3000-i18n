<?php
$media = (!empty($article->image_une))? $article->image_une : '';
$panel_title = 'Featured image';
$column_name = 'image_une';
?>
@include('admin.components.article-media-panel')

@if($article->parent->slug != 'pages')
  <?php $column_name = 'mediagallery'; ?>
  @include('admin.components.article-gallery-panel')
@endif

@include('admin.components.media-edit-modal')

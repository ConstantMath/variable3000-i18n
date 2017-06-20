<?php
$media = (!empty($article->image_une))? $article->image_une : '';
$panel_title = 'Featured image';
$column_name = 'image_une';
?>
@if($article->parent->slug == 'news' or $article->parent->slug == 'projects')
  @include('admin.components.article-media-panel')
@endif

@if($article->parent->slug == 'news' or $article->parent->slug == 'projects')
  <?php $column_name = 'mediagallery'; ?>
  @include('admin.components.article-gallery-panel')
@endif

@include('admin.components.media-edit-modal')

<?php
// TODO: pass var to balde include
$panel_title = 'Featured image';
$panel_type = 'single';
$media_type = 'une';
?>
@include('admin.components.article-media-panel')

<?php
$panel_title = 'Gallery';
$panel_type = 'multiple';
$media_type = 'gallery';
?>
@include('admin.components.article-media-panel')

@include('admin.components.media-edit-modal')

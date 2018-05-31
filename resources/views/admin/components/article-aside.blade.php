<?php
// TODO: pass var to balde include
$panel_title = 'Featured image';
$panel_type  = 'single';
$collection_name = 'une';
?>
@include('admin.components.article-media-panel')

<?php
$panel_title = 'Gallery';
$panel_type = 'multiple';
$collection_name = 'gallery';
?>
@include('admin.components.article-media-panel')

@include('admin.components.media-edit-modal')

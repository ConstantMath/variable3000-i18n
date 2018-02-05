<?php
$panel_title = 'Featured image';
$media_type = 'une';
?>
@include('admin.components.article-media-panel')

<?php
$panel_title = 'Gallery';
$media_type = 'gallery';
?>
@include('admin.components.article-media-panel')

@include('admin.components.media-edit-modal')

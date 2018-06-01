// ----- Declare modal ----- //
$('.media-list').on('click', 'a[data-toggle="modal"]', function(e) {
  e.preventDefault();
  var button            = $(e.currentTarget);
  var article_id        = button.data('article_id');
  var column_name       = button.data('column-name');
  var media_id          = button.data('media-id');
  var media_alt         = button.data('media-alt');
  var media_name        = button.data('media-name');
  var media_description = button.data('media-description');
  var media_ext         = button.data('media-ext');
  var media_type        = button.data('media-type');
  var media_table_type  = button.data('media-table-type');
  var modal             = $('#modal-media-edit');
  var pic_container     = modal.find('#pic');
  var vid_container     = modal.find('#vid');
  var vid_source        = modal.find('#vid > source');
  modal.find('#input_media_id').val(media_id);
  modal.find('#input_media_alt').val(media_alt);
  modal.find('#input_media_description').val(media_description);
  pic_container.attr('src', '').hide();
  vid_source.attr('src', '').hide();

  if(media_ext == 'mp4'){
    vid_container.show();
    vid_source.attr('src', '/medias/'+media_name);
    vid_container.load();
  }else{
    pic_container.show();
    pic_container.attr('src', '/imagecache/large/'+media_name);
  }
  $("#modalButton").off('click');
});

$(document).ready(function() {
  // Edit media
  var media_edit_options = {
    success:       mediaEditResponse,
    dataType:      'json'
  };

  $(".media-edit-save").click(function(e) {
    e.preventDefault();
    $(this).closest('form').ajaxForm(media_edit_options).submit();
  });

  function mediaEditResponse(response, statusText, xhr, $form){
    if(response.status == 'success'){
      getMedias(response.media_type, response.mediatable_type);
    }
  }
});

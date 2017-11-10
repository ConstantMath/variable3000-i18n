// ----- Declare modal ----- //

$('#modal-media-edit').on('show.bs.modal', function (event) {
  var button            = $(event.relatedTarget);
  var article_id        = button.data('article_id');
  var column_name       = button.data('column-name');
  var media_id          = button.data('media-id');
  var media_alt         = button.data('media-alt');
  var media_name        = button.data('media-name');
  var media_description = button.data('media-description');
  var media_ext         = button.data('media-ext');
  var media_type        = button.data('media-type');
  var modal             = $(this);
  var pic_container     = modal.find('#pic');
  var vid_container     = modal.find('#vid');
  var vid_source        = modal.find('#vid > source');
  modal.find('.media-delete').attr("href", url+'/articles/'+media_id+'/deletemedia');
  modal.find('.media-delete').attr("column_name", column_name);
  modal.find('.media-delete').attr("media_id", media_id);
  modal.find('.media-delete').attr("media_type", media_type);
  modal.find('#input_media_id').val(media_id);
  modal.find('#input_media_alt').val(media_alt);
  modal.find('#input_media_description').val(media_description);

  if(media_ext == 'mp4'){
    pic_container.attr('src', '').hide();
    vid_container.show();
    vid_source.attr('src', '/medias/'+media_name);
    vid_container.load();
  }else{
    vid_container.hide();
    vid_source.attr('src', '');
    pic_container.show();
    pic_container.attr('src', '/imagecache/large/'+media_name);
  }
  $("#modalButton").off('click');
})


$(document).ready(function() {


  // ----- Edit media ----- //

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
      getMedias(response.media_type);
    }
  }

  // ----- Delete a media ----- //

  // click sur les descendants de media panel
  $('.modal').on('click', '.media-delete', function(e){
    e.preventDefault();
    var url         = $(this).attr('href')
    var media_type  = $(this).attr('media_type');
    var media_id    = $(this).attr('media_id');

    if (url && media_id) {
      jQuery.ajax({
        url: url,
        data: {
          'media_type' : media_type,
          'media_id'   : media_id,
        },
        type: 'POST',
        success: function(response){
          if(response.success == true){
            getMedias(response.media_type);
          }
        }
      });
    }
  });
});

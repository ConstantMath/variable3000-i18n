// ----- Declare modal ----- //

$('#modal-media-edit').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget);
  var article_id = button.data('article_id');
  var data_delete_link = button.data('delete-link');
  var column_name = button.data('column-name');
  var media_id = button.data('media-id');
  var media_alt = button.data('media-alt');
  var media_url = button.data('media-url');
  var media_description = button.data('media-description');
  var modal = $(this);
  modal.find('.media-delete').attr("href", data_delete_link);
  modal.find('.media-delete').attr("column_name", column_name);
  modal.find('.media-delete').attr("media_id", media_id);
  modal.find('.single-m-delete').attr("media_id", media_id);
  modal.find('#input_media_id').val(media_id);
  modal.find('#input_media_alt').val(media_alt);
  modal.find('#input_media_description').val(media_description);
  modal.find('#pic').attr("src", media_url);
  $("#modalButton").off('click');
})


$('#modal-media-edit-custom').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget);
  var article_id = button.data('article_id');
  var data_delete_link = button.data('delete-link');
  var column_name = button.data('column-name');
  var media_id = button.data('media-id');
  var media_alt = button.data('media-alt');
  var media_url = button.data('media-url');
  var size = button.data('media-size');
  var background_color = button.data('media-background-color');
  var background_image = button.data('media-background-image');

  var modal = $(this);
  modal.find('#pic').attr("src", media_url);
  modal.find('.media-delete').attr("href", data_delete_link);
  modal.find('.media-delete').attr("column_name", column_name);
  modal.find('.media-delete').attr("media_id", media_id);
  modal.find('.single-m-delete').attr("media_id", media_id);
  modal.find('#input_media_id').val(media_id);
  modal.find('#input_media_alt').val(media_alt);
  modal.find('#size').val(size);
  modal.find('#background-color').val(background_color);
  if(background_image.endsWith("small/")){ // background_imge vide
    modal.find('#pic-background-image').hide();
  }else{
    modal.find('#pic-background-image').attr("src", background_image);
  }
  $("#modalButton").off('click');
})

$(document).ready(function() {

  // ----- Edit media (single & gallery) ----- //

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
      var media = $('li#media-'+ response.media_id);
      // Clonage de l'élément, sinon impossible de mettre à jour les attributs
      var media2 = media.clone();
      media.hide();
      var media_link = media2.find('> a');
      media2.find('span').text(response.media_alt);
      media2.find('a').attr("data-media-alt", response.media_alt);
      media2.find('a').attr("data-media-description", response.media_description);
      // Custom
      media2.find('a').attr("data-media-size", response.media_size);
      media2.find('a').attr("data-media-background-image", '/imagecache/small/'+response.media_background_image);
      media2.find('a').attr("data-media-background-color", response.media_background_color);

      media.before(media2);
      media.remove();
    }
  }


  // ----- Delete a media ----- //

  // click sur les descendants de media panel
  $('.modal').on('click', '.media-delete', function(e){
    e.preventDefault();
    var url         = $(this).attr('href')
    var column_name = $(this).attr('column_name');
    var media_id    = $(this).attr('media_id');

    if (url && media_id) {
      jQuery.ajax({
        url: url,
        data: {
          'column_name' : column_name,
          'media_id'    : media_id,
        },
        type: 'POST',
        success: function(response){
          if(response.status == 'success'){
            if(response.column_name == 'mediagallery'){
              // Galleries : Loop dans les medias & delete
              var mediagallery_val = $('#main-form #input-mediagallery').val();
              var mediagallery_arr = mediagallery_val.split(',');
              for(var i = mediagallery_arr.length - 1; i >= 0; i--) {
                if(mediagallery_arr[i] === response.media_id) {
                 mediagallery_arr.splice(i, 1);
                 $('#main-form #input-mediagallery').val(mediagallery_arr);
                }
              }
            }else{
              $('#main-form #'+ column_name).val(null);
            }
            $('#panel-' + response.column_name + ' .list-group #media-'+response.media_id).detach();
          }
        }
      });
    }
  });
});

$(document).ready(function() {

  // ----- Medias panel add & upload ----- //

  // input file > open
  $(".media-add").click(function() {
    var input = $(this).prev();
    input.attr("type", "file");
    input.trigger('click');
    return false;
  });


  // ----- Add single media w/ Ajax ----- //

  var single_media_options = {
    success:  singleMediaResponse,
    dataType: 'json'
  };

  $('body').delegate('.input-single-media-upload','change', function(){
    $('.single-media-form').ajaxForm(single_media_options).submit();
  });

  function singleMediaResponse(response, statusText, xhr, $form){
    if(response.success == false){
      // À faire
    } else {
      $('#main-form #'+ response.column_name).val(JSON.stringify(response.media_id));
      $('#panel-'+ response.column_name + ' li:not(.ghost)').detach();
      updateModalInfos(response);
    }
  }


  // ----- Add gallery media w/ Ajax ----- //

  var options = {
    success:  galleryMediaResponse,
    dataType: 'json'
  };

  $('body').delegate('#gallery-image','change', function(){
    $('#article-gallery-upload').ajaxForm(options).submit();
  });

  function galleryMediaResponse(response, statusText, xhr, $form)  {
    if(response.success == false){
      // À faire
      // var arr = response.errors;
      // $.each(arr, function(index, value){
      //   if (value.length != 0){
      //     $("#validation").append('<div class="alert alert-error"><strong>'+ value +'</strong><div>');
      //   }
      // });
      // $("#validation").show();
    } else {
      if(response.article_id == 'null'){
        var medias = [];
        var current_medias = $('#input-mediagallery').val();
        if(current_medias){
          medias = medias.concat(current_medias);
        }
        // Ajoute le media courant au tableau des médias
        medias.push(response.media_id);
        $('#main-form #input-mediagallery').val(medias);
      }
      updateModalInfos(response);
    }
  }


  // ----- Sortable ----- //

  if ( $('#mediagallery').length ){
    Sortable.create(mediagallery, {
      /* options */
      onUpdate: function (evt) {
        var article_id = evt.item.getAttribute('data-article-id');
        var media_id   = evt.item.getAttribute('data-media-id');
        var new_order   = evt.newIndex;

        if (article_id && media_id) {
          jQuery.ajax({
            url: '/admin/articles/' + article_id + '/reordermedia',
            data: {
              'mediaId' : media_id,
              'newOrder': new_order,
            },
            type: 'POST',
            success: function(response){
              if(response.status == 'success'){
            		$('<span class="message pull-right">Updated !</span>').appendTo(".panel-mediagallery .panel-heading").fadeOut(3000);
            	} else {
            	}
            }
          });
        }
      }
    });
  }

})


function updateModalInfos(data){
  var media = $('#panel-' + data.column_name + ' .ghost');
  var media2 = media.clone();
  media.before(media2);
  media2.removeClass('ghost');
  media2.attr("media-id", data.media_id);
  media2.attr("id", 'media-'+data.media_id);
  media2.attr("data-article-id", data.article_id);
  media2.attr("data-media-id", data.media_id);
  media2.find('a').attr("data-media-alt", data.media_alt);
  media2.find('a').attr("data-media-description", data.media_description);
  // Custom
  media2.find('a').attr("data-size", data.size);
  media2.find('a').attr("data-media-background-color", data.media_background_color);
  media2.find('a').attr("data-media-background-image", data.media_background_image);

  media2.find('a').attr("data-delete-link", '/en/admin/articles/'+ data.media_id +'/deletemedia');
  if(data.media_type == 'jpg' || data.media_type == 'png' || data.media_type == 'gif' || data.media_type == 'svg' || data.media_type == 'jpeg'){
    var icon = '<i class="fa fa-image"></i>';
    media2.find('a').attr("data-media-url", '/imagecache/large/'+data.media_name);
  }else if(data.media_type == 'pdf'){
    var icon = '<i class="fa fa-file-pdf-o"></i>';
    media2.find('a').attr("data-media-url", '');
  }else{
    var icon = '<i class="fa fa-file"></i>';
    media2.find('a').attr("data-media-url", '');
  }
  media2.find('i.fa').remove();
  media2.find('span').before(icon);
  media2.find('span').html(data.media_alt);
}

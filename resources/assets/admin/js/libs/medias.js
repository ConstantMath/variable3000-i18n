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
      console.log('--'+response.type);
      //$('#main-form #'+ response.media_type).val(JSON.stringify(response.media_id));
      $('#panel-'+ response.type + ' li:not(.ghost)').detach();
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
            url: '/en/admin/articles/' + article_id + '/reordermedia',
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


// ----- Mixins ----- //

function updateModalInfos(data){
  console.log(data);
  var media = $('#panel-' + data.type + ' .ghost');
  var media2 = media.clone();
  media.before(media2);
  media2.removeClass('ghost');
  media2.attr("data-article-id", data.article_id);
  media2.attr("data-media-id", data.id);
  media2.find('a').attr("data-media-id", data.id);
  media2.find('a').attr("data-media-alt", data.alt);
  media2.find('a').attr("data-media-description", data.description);
  media2.find('a').attr("data-delete-link", '/admin/articles/'+ data.article_id +'/deletemedia');
  if(data.ext == 'jpg' || data.ext == 'png' || data.ext == 'gif' || data.ext == 'svg' || data.ext == 'jpeg'){
    var icon = '<i class="fa fa-image"></i>';
    media2.find('a').attr("data-media-url", '/imagecache/large/'+data.name);
  }else if(data.ext == 'pdf'){
    var icon = '<i class="fa fa-file-pdf-o"></i>';
    media2.find('a').attr("data-media-url", '');
  }else{
    var icon = '<i class="fa fa-file"></i>';
    media2.find('a').attr("data-media-url", '');
  }
  media2.find('i.fa').remove();
  media2.find('span').before(icon);
  media2.find('span').html(data.alt);
}

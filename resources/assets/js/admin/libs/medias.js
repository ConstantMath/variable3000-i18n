$(document).ready(function() {

  // ----- Medias panel display data----- //

  if( $('.media-panel').length ){

    $('.media-panel').each(function( index ) {
      var media_type = $(this).attr('data-media-type');
      getMedias(media_type);

    });

  }

  /* manage data list */
  function getMedias(media_type) {
    var article_id = $("#main-form input[name=id]").val();
    var panel = $("#panel-"+media_type);
    if(article_id && media_type){
      $.ajax({
          dataType: 'json',
          url: url+'/articles/'+article_id+'/getmedias/'+media_type
      }).done(function(data){
        if(data.success == true){
          printList(data.medias, media_type);
          panel.removeClass('loading');
        }
      });
    }
  }

  /* manage data list */
  function printList(medias, media_type) {
    if(medias && media_type){
      var ul = $('#panel-'+media_type+' .media-list');
      var	li = '';
      console.log(medias);
      $.each( medias, function( key, value ) {
        li = li + '<li class="list-group-item">';
        // Icon
        if(value.ext == 'jpg' || value.ext == 'png' || value.ext == 'gif' || value.ext == 'svg' || value.ext == 'jpeg'){
          li = li + '<i class="fa fa-image"></i>';
        }else if(value.ext == 'pdf'){
          li = li + '<i class="fa fa-file-pdf-o"></i>';
        }else if(value.ext == 'mp4'){
          li = li + '<i class="fa fa-video-camera"></i>';
        }else{
          li = li + '<i class="fa fa-file"></i>';
        }

        li = li + '<a href="" class="column-title" data-toggle="modal" data-target="#modal-media-edit" data-media-type="'+value.type+'" data-media-id="'+value.id+'" data-media-description="'+value.description+'" data-media-alt="'+value.alt+'" data-media-url="/imagecache/large/'+value.name+'" data-delete-link="'+url+'/articles/'+value.mediatable_id+'/deleteMedia">';
        li = li + '<span>'+value.alt+'</span>';
        li = li + '</a>';
        li = li + '</li>';
      });
      ul.html(li);
    }
  }



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

  // var options = {
  //   success:  galleryMediaResponse,
  //   dataType: 'json'
  // };
  //
  // $('body').delegate('#gallery-image','change', function(){
  //   $('#article-gallery-upload').ajaxForm(options).submit();
  // });
  //
  // function galleryMediaResponse(response, statusText, xhr, $form)  {
  //   if(response.success == false){
  //     // À faire
  //     // var arr = response.errors;
  //     // $.each(arr, function(index, value){
  //     //   if (value.length != 0){
  //     //     $("#validation").append('<div class="alert alert-error"><strong>'+ value +'</strong><div>');
  //     //   }
  //     // });
  //     // $("#validation").show();
  //   } else {
  //     if(response.article_id == 'null'){
  //       var medias = [];
  //       var current_medias = $('#input-mediagallery').val();
  //       if(current_medias){
  //         medias = medias.concat(current_medias);
  //       }
  //       // Ajoute le media courant au tableau des médias
  //       medias.push(response.media_id);
  //       $('#main-form #input-mediagallery').val(medias);
  //     }
  //     updateModalInfos(response);
  //   }
  // }


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
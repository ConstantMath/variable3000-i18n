$(document).ready(function() {

  // ----- Medias panel display data----- //

  if( $('.media-panel').length ){
    $('.media-panel').each(function( index ) {
      var media_type = $(this).attr('data-media-type');
      // Build media list
      getMedias(media_type);
      // Build hidden input
      $('<input>').attr({
        type: 'hidden',
        id: media_type,
        name: media_type+'[]'
      }).appendTo('#main-form');
    });
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
    success:  mediaResponse,
    dataType: 'json'
  };

  $('body').delegate('.input-single-media-upload','change', function(){
    var panel = $(this).closest('.media-panel');
    var form = $(this).closest('.single-media-form');
    form.ajaxForm(single_media_options).submit();
    panel.addClass('loading');
  });

  function mediaResponse(response, statusText, xhr, $form){
    if(response.success == true){
      getMedias(response.type);
    }
  }

  // ----- Sortable ----- //

  if ( $('#mediagallery').length){
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
    var	dataArray = [];
    // Json Medias loop
    $.each( medias, function( key, value ) {
      // Build <li>
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
      li = li + '<a href="" class="column-title" data-toggle="modal" data-target="#modal-media-edit" data-media-type="'+value.type+'" data-media-id="'+value.id+'" data-media-description="'+value.description+'" data-media-ext="'+value.ext+'" data-media-alt="'+value.alt+'" data-media-name="'+value.name+'">';
      li = li + '<span>'+value.alt+'</span>';
      li = li + '</a>';
      li = li + '</li>';
      // Add input fields data
      dataArray.push(value.id);
    });
    ul.html(li);
    $('#' + media_type).val(dataArray);
  }
}

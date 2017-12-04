$(document).ready(function() {

  // ----- Medias panel display data----- //

  if( $('.media-panel').length ){
    $('.media-panel').each(function( index ) {
      var media_type = $(this).attr('data-media-type');
      var media_table_type = $(this).attr('data-media-table-type');
      // Build media list
      getMedias(media_type, media_table_type);
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
      addMediaInput(response.id, response.type, response.mediatable_type);
    }
  }

  // ----- Sortable ----- //

  // if ( $('#panel-gallery').length){
  //   var el = document.getElementById('panel-gallery');
  //   Sortable.create(el, {
  //     /* options */
  //     onUpdate: function (evt) {
  //       var article_id = evt.item.getAttribute('data-article-id');
  //       var media_id   = evt.item.getAttribute('data-media-id');
  //       var media_type = evt.item.getAttribute('data-media-type');
  //       var new_order  = evt.newIndex;
  //
  //       if (article_id && media_id) {
  //         jQuery.ajax({
  //           url: url+'/articles/' + article_id + '/reordermedia' + media_type,
  //           data: {
  //             'mediaId' : media_id,
  //             'mediaType' : media_type,
  //             'newOrder': new_order,
  //           },
  //           type: 'POST',
  //           success: function(response){
  //             if(response.status == 'success'){
  //           		$('<span class="message pull-right">Updated !</span>').appendTo(".panel-mediagallery .panel-heading").fadeOut(3000);
  //           	} else {
  //           	}
  //           }
  //         });
  //       }
  //     }
  //   });
  // }
})

// ----- Mixins ----- //

/* manage data list */
function getMedias(media_type, mediatable_type='articles') {
  var main_form_id = 'main-form';
  // Hack for settings many forms single page
  if(mediatable_type == 'settings'){
    main_form_id =  media_type + '-' + main_form_id;
  }
  var article_id = $('#' + main_form_id + ' input[name=id]').val();
  var current_medias = $('#' + main_form_id + '#' + media_type).val();
  var panel = $("#panel-"+media_type);
  // Get from DB
  if(article_id){
    $.ajax({
        dataType: 'json',
        url: url+'/' + mediatable_type + '/' + article_id + '/getmedias/'+ media_type
    }).done(function(data){
      if(data.success == true){
        printList(data.medias, media_type, mediatable_type);
        panel.removeClass('loading');
      }
    });
  // Get from input field
  }else if(current_medias){
    var medias = [];
    medias = medias.concat(current_medias);
    $.ajax({
        type: 'POST',
        url: url+'/medias/get',
        data: {medias}
    }).done(function(data){
      if(data.success == true){
        printList(data.medias, media_type, mediatable_type);
        panel.removeClass('loading');
      }
    });
  }else{
    panel.removeClass('loading');
  }
}

/* manage data list */
function printList(medias, media_type, mediatable_type = 'articles') {
  if(medias && media_type){
    var ul = $('#panel-'+media_type+' .media-list');
    var	li = '';
    // Json Medias loop
    $.each( medias, function( key, value ) {
      // Build <li>
      li = li + '<li class="list-group-item" data-media-id="'+value.id+'" data-article-id="'+value.mediatable_id+'" data-media-type="'+value.type+'">';
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
      li = li + '<a href="" class="column-title" data-toggle="modal" data-target="#modal-media-edit" data-media-type="'+value.type+'" data-media-table-type="'+mediatable_type+'" data-media-id="'+value.id+'" data-media-description="'+value.description+'" data-media-ext="'+value.ext+'" data-media-alt="'+value.alt+'" data-media-name="'+value.name+'">';
      li = li + '<span>'+value.alt+'</span>';
      li = li + '</a>';
      li = li + '</li>';
    });
    ul.html(li);
  }
}

/* Update hidden medias inputs */
function addMediaInput(media_id, media_type, mediatable_type = 'articles') {
  var main_form_id = 'main-form';
  // Hack for settings many forms single page
  if(mediatable_type == 'settings'){
    main_form_id =  media_type + '-' + main_form_id;
  }
  var medias = [];
  var inputField = $('#' + main_form_id + '#' + media_type);
  var current_medias = inputField.val();
  if(current_medias){medias = medias.concat(current_medias)}
  medias.push(media_id);
  inputField.val(medias);
  getMedias(media_type, mediatable_type);
}

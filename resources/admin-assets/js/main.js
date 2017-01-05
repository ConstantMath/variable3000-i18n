$(document).ready(function() {

  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
  });

  // ----- Medias panel add & upload ----- //

  // input file > open
  $(".media-add").click(function() {
      var input = $(this).prev();
      input.attr("type", "file");
      input.trigger('click');
      return false;
  });


  var options = {
    //beforeSubmit:  showRequest,
    success:       showMediaResponse,
    dataType:      'json'
  };

  $('body').delegate('#image-une','change', function(){
    $('#article-image-upload').ajaxForm(options).submit();
  });

  $('body').delegate('#gallery-image','change', function(){
    $('#article-gallery-upload').ajaxForm(options).submit();
  });


  function showMediaResponse(response, statusText, xhr, $form)  {
    if(response.success == false){
      // à faire
      var arr = response.errors;
      $.each(arr, function(index, value){
        if (value.length != 0){
          $("#validation").append('<div class="alert alert-error"><strong>'+ value +'</strong><div>');
        }
      });
      $("#validation").show();
    } else {
      // à amméliorer
      if(response.type == 'mediagallery'){
        // popularise un input field si pas d'article ID (create)

        if(response.article_id == 'null'){
          var medias = [];
          // Ajoute les medias déjà ajouttés au tableau des médias
          var current_medias = $('#post-medias').val();
          if(current_medias){
            medias = medias.concat(current_medias);
          }
          // Ajoute le media courant au tableau des médias
          medias.push(response.media_id);
          $('#post-medias').val(medias);
          //$('#post-medias').append(medias);
        }
        $('#mediagallery').append('<li class="list-group-item" media-id="'+response.media_id+'" url="/admin/articles/'+response.article_id+'/reordermedia"><img src="'+response.name+'" /><span>'+response.alt+'</span><a href="/admin/articles/'+response.article_id+'/deletemedia" media-id="'+response.media_id+'" class="m-delete"><i class="fa fa-times"></i></a></li>');
      }else {
        // popularise un input field si pas d'article ID (create)
        if(response.article_id == 'null'){
          $('#post-image-une').val(JSON.stringify(response.media_id));
        }
        $('#mediaune').html('<li class="list-group-item"><img src="'+response.name+'" /><span>'+response.alt+'</span><a href="/admin/articles/'+response.article_id+'/deletemedia" media-id="'+response.media_id+'" class="m-delete" type="image-une"><i class="fa fa-times"></i></a></li>');
      }
    }
  }


  // ----- Medias panel delete ----- //

  // click sur les descendatns de media panel (dynamic)
  $('.media-panel').on('click', '.m-delete', function(e){
    e.preventDefault();

    var url       = $(this).attr('href')
    var media_id  = $(this).attr('media-id');
    var type      = $(this).attr('type');

    if (url && media_id) {
      jQuery.ajax({
        url: url,
        data: {
          'media_id' : media_id,
          'type': type,
        },
        type: 'POST',
        success: function(response){
          if(response.status == 'success'){
            if(response.type == 'image-une'){
              $('#mediaune li').detach();
            }else{
              $('#mediagallery li[media-id = '+response.media_id+']').detach();
            }
          }
        }
      });
    }
  });

  // ----- Rich text editor ----- //

  $('#rich-editor').summernote({
    //airMode: true,
    toolbar: [
      // [groupName, [list of button]]
      ['style', ['style', 'bold', 'underline', 'clear']],
      ['para', ['ul', 'ol']],
      ['insert', ['picture','link', 'unlink']],
      ['misc', ['fullscreen','codeview','help']],
    ],
    popover: {
      image: [
        ['imagesize', ['imageSize100', 'imageSize50', 'imageSize25']],
        ['remove', ['removeMedia']]
      ],
      link: [
        ['link', ['linkDialogShow', 'unlink']]
      ],
      air: [
        ['style', ['style', 'bold', 'underline', 'clear']],
        ['para', ['ul', 'ol']],
        ['insert', ['picture','link']],
        ['misc', ['fullscreen','help']],
      ]
    },
    callbacks: {
      onImageUpload: function(files, editor, $editable) {
        sendFileToEditor(files[0],editor,$editable);
      }
    }
  });


  // ----- Tags list select ----- //

  $('#tags_general').select2({
    placeholder : 'Sélectionnez ou ajoutez un tag',
    tags        : true,
    tokenSeparators: [",", " "],
  });


  // ----- Sortable medias elements ----- //

  if ( $('#mediagallery').length ){
    Sortable.create(mediagallery, {
      /* options */
      onUpdate: function (evt) {
        var url       = evt.item.getAttribute('url');
        var mediaId   = evt.item.getAttribute('media-id');
        var newOrder  = evt.newIndex;

        if (url && mediaId) {
          jQuery.ajax({
            url: url,
            data: {
              'mediaId' : mediaId,
              'newOrder': newOrder,
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


  // ----- Sortable indexes----- //

  if ( $('#index').length ){

    Sortable.create(index, {
      onUpdate: function (evt) {
        var url          = evt.item.getAttribute('url');
        var parent_slug  = evt.item.getAttribute('parent');
        var new_order     = evt.newIndex;
        console.log(new_order);
        if (url && parent_slug) {
          jQuery.ajax({
            url: url,
            data: {
              'parent_slug' : parent_slug,
              'new_order'   : new_order,
            },
            type: 'POST',
            success: function(response){
              if(response.status == 'success'){
                //$('<span class="message pull-right">Updated !</span>').appendTo(".panel-mediagallery .panel-heading").fadeOut(3000);
              } else {
              }
            }
          });
        }
      }
    });
  }
});


// ----- Send file to the righ editor ----- //

function sendFileToEditor(file,editor,welEditable) {
  data = new FormData(); // Call jquery form
  data.append("file", file);
  jQuery.ajax({
    url: '/admin/fileupload',
    data: data,
    cache: false,
    contentType: false,
    processData: false,
    type: 'POST',
    success: function(response){
      // à refaire
      if(response.status == 'error'){
        $("#validation").append('<div class="alert alert-danger"><strong>'+ response.msg +'</strong><div>');
      } else {
         jQuery('#rich-editor').summernote("insertImage", response.name);
      }
    }
  });
}

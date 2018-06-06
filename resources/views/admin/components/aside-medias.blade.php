<?php
// TODO: pass var to blade include
$panel_title = 'Featured image';
$panel_type  = 'single';
$collection_name = 'une';
?>
@include('admin.components.article-media-panel')

<?php
$panel_title = 'Gallery';
$panel_type = 'multiple';
$collection_name = 'gallery';
?>
@include('admin.components.article-media-panel')

@include('admin.components.media-edit-modal')

@section('scripts')
<script type="text/javascript">

  $(document).ready(function() {

    // ----- Medias panel display data----- //
    if( $('.media-panel').length ){
      $('.media-panel').each(function( index ) {
        var media_collection_name = $(this).attr('data-media-collection-name');
        // Build media list
        getMedias(media_collection_name);
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
        addMediaInput(response.media);
      }else{
        var panel = $('#panel-' + response.collection);
        var message_field = $('#panel-' + response.collection + ' .message');
        panel.removeClass('loading');
        message_field.html(response.error).fadeOut(6000);
      }
    }

    // Delte media
      // ----- Declare modal ----- //
    $('.media-panel').on('click', '.link--delete', function(e) {
      e.preventDefault();
      var url = $(this).attr('href');
      var media_collection_name = $(this).attr('data-media-collection-name');
      if (url) {
        jQuery.ajax({
          url: url,
          type: 'GET',
          success: function(response){
            if(response.success == true){
              getMedias(media_collection_name);
            }
          }
        });
      }
      return false;
    });

  })

  // ----- Mixins ----- //

  /* manage data list */
  function getMedias(media_collection_name) {
    // mediatable_type = typeof mediatable_type  === 'undefined' ? 'articles' : mediatable_type;
    var main_form_id = 'main-form';
    var article_id = $('#' + main_form_id + ' input[name=id]').val();
    var current_medias = $('#' + main_form_id + ' #' + media_collection_name).val();
    var panel = $("#panel-" + media_collection_name);
    var model_name = 'articles';
    // Get from DB
    if(article_id){
      $.ajax({
          dataType: 'JSON',
          url: admin_url+'/mediasArticle/' + model_name + '/' + article_id + '/' + media_collection_name,
      }).done(function(data){
        if(data.success == true){
          printList(data.medias, media_collection_name);
          panel.removeClass('loading');
        }
      });
    // Get from input field
    }else if(current_medias){
      var medias = [];
      medias = medias.concat(current_medias);
      $.ajax({
          type: 'POST',
          url: admin_url+'/medias/get',
          data: {medias}
      }).done(function(data){
        if(data.success == true){
          printList(data.medias, media_type);
          panel.removeClass('loading');
        }
      });
    }else{
      panel.removeClass('loading');
    }
  }


  /* manage data list */
  function printList(medias, media_type) {
    var article_model_type = '{{get_class($article)}}';
    if(medias && media_type){
      var ul = $('#panel-' + media_type + ' .media-list');
      var	li = '';
      // Json Medias loop
      $.each( medias, function( key, value ) {

        // Build <li>
        li = li + '<li class="list-group-item media-list__item" data-media-table-type="' + article_model_type + '" data-media-id="' + value.id + '" data-article-id="' + value.mediatable_id + '" data-article-id="' + value.mediatable_id + '" data-media-type="' + value.type + '">';
        li = li + '<div class="media__infos"><p class="media__title">' + value.name + '</p>';
        li = li + '<p><a href="" class="link link--edit" data-toggle="modal" data-target="#modal-media-edit" data-media-collection-name="'+ media_type +'" data-media-table-type="' + article_model_type +'" data-media-id="'+ value.id+'" data-media-description="' + value.description + '" data-mime-type="' + value.mime_type + '" data-media-alt="' + value.name + '" data-media-name="' + value.file_name + '">{{ __('admin.edit') }}</a></p>';
        li = li + '<p><a href="' + admin_url + '/medias/destroy/' + value.id + '" class="link link--delete" data-media-collection-name="'+ media_type +'">{{ __('admin.delete') }}</a></p></div>';
        //media preview
        if(value.mime_type.includes("image", 0)){
          li = li + '<div class="media__preview" style="background-image:url(\'/imagecache/thumb/' + value.id + '/' + value.file_name + '\')"></div>';
        }else if(value.mime_type.includes("pdf", 0)){
          li = li + '<div class="media__preview txt"><span>PDF</span></div>';
        }else if(value.mime_type.includes("video", 0)){
          li = li + '<div class="media__preview txt"><span>VIDEO</span></div>';
        }else{
          li = li + '<div class="media__preview txt"><span>FILE</span></div>';
        }
        li = li + '</li>';
      });
      ul.html(li);
    }
  }


  /* Update hidden medias inputs */
  function addMediaInput(media) {
    var main_form_id = 'main-form';
    var medias = [];
    var inputField = $('#' + main_form_id + ' #' + media.collection_name);
    var current_medias = inputField.val();
    if(current_medias){medias = medias.concat(current_medias)}
    medias.push(media.id);
    inputField.val(medias);
    getMedias(media.collection_name, media.model_type);
  }


  /* Slugify model name */
  function slugifyModel(str) {
    str = str.replace('App\\', '').toLowerCase();
    return str;
  }

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
    var media_mime_type   = button.data('mime-type');
    var media_type        = button.data('media-type');
    var media_table_type  = button.data('media-table-type');
    var modal             = $('#modal-media-edit');
    var pic_container     = modal.find('#pic');
    var file_container    = modal.find('#file');
    var vid_container     = modal.find('#vid');
    var vid_source        = modal.find('#vid > source');
    modal.find('#input_media_id').val(media_id);
    modal.find('#input_media_alt').val(media_alt);
    modal.find('#input_media_description').val(media_description);
    pic_container.hide();
    vid_container.hide();
    file_container.hide();

    if(media_mime_type.includes("image", 0)){
      pic_container.show();
      pic_container.attr('src', '/imagecache/large/'  + media_id + '/' + media_name);
    }else if(media_mime_type.includes("video", 0)){
      vid_container.show();
      vid_source.attr('src', '/storage/' + media_id + '/' + media_name);
      vid_container.load();
    }else{
      file_container.show();
      file_container.attr('href', '/storage/' + media_id + '/' + media_name);
      file_container.text('View file');
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
</script>

@endsection

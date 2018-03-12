
if ( $('.panel.multiple').length ){

  // ----- Media gallery Sortable ----- //
  var el = $('.multiple .sortable');
  // var list = document.getElementById("sortable");
  $(el).each(function (i,e) {
    var sortable = Sortable.create(e, {
      onUpdate: function (evt) {
        var article_id = evt.item.getAttribute('data-article-id');
        var media_id   = evt.item.getAttribute('data-media-id');
        var media_type = evt.item.getAttribute('data-media-type');
        var mediatable_type = evt.item.getAttribute('data-media-table-type');
        var new_order  = evt.newIndex;
        if (article_id && media_id) {
          jQuery.ajax({
            url: admin_url + '/medias/reorder/' + media_type + '/' + mediatable_type + '/' + article_id,
            data: {
              'mediaId' : media_id,
              'mediaType' : media_type,
              'newOrder': new_order,
            },
            type: 'POST',
            success: function(response){
              if(response.status == 'success'){
                console.log(media_type+'pp');
                $('<span class="message pull-right">Updated !</span>').appendTo('#panel-' + media_type  + ' .panel-heading').fadeOut(3000);
              } else {
              }
            }
          });
        }
      }
    });
  })
}

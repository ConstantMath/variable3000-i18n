// ----- Media gallery Sortable ----- //

if ( $('#panel-gallery').length){
  console.log('3');
  var el = document.getElementById('panel-gallery').getElementsByClassName('sortable')[0];
  Sortable.create(el, {
    /* options */
    onUpdate: function (evt) {
      var article_id = evt.item.getAttribute('data-article-id');
      var media_id   = evt.item.getAttribute('data-media-id');
      var media_type = evt.item.getAttribute('data-media-type');
      var new_order  = evt.newIndex;

      if (article_id && media_id) {
        jQuery.ajax({
          url: url+'/articles/' + article_id + '/reordermedia/' + media_type,
          data: {
            'mediaId' : media_id,
            'mediaType' : media_type,
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

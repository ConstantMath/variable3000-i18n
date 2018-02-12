$(document).ready(function() {
  // ----- Sortable indexes----- //
  if ( $('table .sortable').length ){
    // Get sortables elements
    var elements = document.getElementsByClassName("sortable");
    // Loop sortable elements
    for(var i = 0; i < elements.length; i++){
      Sortable.create(elements.item(i), {
        onUpdate: function (evt) {
          var mediatable_type = evt.item.getAttribute('data-mediatable-type');
          var article_id      = evt.item.getAttribute('data-article-id');
          var parent_id       = evt.item.getAttribute('data-parent-id');
          var new_order       = evt.newIndex;
          if (article_id && mediatable_type) {
            jQuery.ajax({
              url: admin_url + '/' + mediatable_type + '/reorder',
              data: {
                'id'        : article_id,
                'parent_id' : parent_id,
                'new_order' : new_order,
              },
              type: 'POST',
              success: function(response){
                if(response.status == 'success'){
                  //$('<span class="message pull-right">Updated !</span>').appendTo(".panel-mediagallery .panel-heading").fadeOut(3000);
                }
              }
            });
          }
        }
      });
    }
  }
});

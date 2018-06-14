$(document).ready(function() {
  var previousPlaceholder;
  $('.main-content').on('mouseover', '.dataTables_filter input', function() {
    if(previousPlaceholder === undefined){
      previousPlaceholder = $(this).attr('placeholder');
    }
    $(this).attr('placeholder','Search');
  });
  $('.main-content').on('mouseout', '.dataTables_filter input', function() {
    $(this).attr('placeholder', previousPlaceholder);
    previousPlaceholder = undefined;
  });
});

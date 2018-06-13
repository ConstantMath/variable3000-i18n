$(document).ready(function() {
  var previousPlaceholder;
  $('.main-content').on('mouseover', '.dataTables_filter input', function() {
    if(previousPlaceholder === undefined){
      previousPlaceholder = $(this).attr('placeholder');
    }
    $(this).attr('placeholder','Search');
    console.log(previousPlaceholder);
  });
  $('.main-content').on('mouseout', '.dataTables_filter input', function() {
    console.log(previousPlaceholder);
    $(this).attr('placeholder', previousPlaceholder);
    previousPlaceholder = undefined;
  });
});

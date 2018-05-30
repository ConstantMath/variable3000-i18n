$('.tab-select li').click(function(e){
  $('.tab-select li').removeClass('active');
  $('.tab-content .tab-pane').removeClass('active');
  var selected_tab = $(this).data('tab');
  $(this).addClass('active');
  $('.tab-content').find('#tab'+ selected_tab).addClass('active');
});

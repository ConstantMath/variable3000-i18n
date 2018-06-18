function showSubMenu(){
  $('.js-dropdown-toggle').removeClass('js-dropdown-active');
  $('.js-dropdown-menu').html($('.js-dropdown-toggle').find('.js-dropdown-content').html());
  $('.nav--secondary').slideDown(100);
  $('.js-dropdown-toggle').addClass('js-dropdown-active');
}

$(document).ready(function() {
  if($('body').is('.tools')){
    console.log('ok');
    showSubMenu();
  }
  $('nav .js-dropdown-toggle').click(function(e){
    e.preventDefault;
    if ($(this).find('.js-dropdown-content').html() ==  $('.js-dropdown-menu').html()) {
      $('.js-dropdown-toggle').removeClass('js-dropdown-active');
      $('.nav--secondary').slideUp(100);
      $('.js-dropdown-menu').empty();
    }
    else {
      showSubMenu();
    }
  });
});

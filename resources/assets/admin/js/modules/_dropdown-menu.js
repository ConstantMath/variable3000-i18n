function contentSubMenu() {
  $('.js-dropdown-toggle').removeClass('js-dropdown-active');
  $('.js-dropdown-menu').html($('.js-dropdown-toggle').find('.js-dropdown-content').html());
  $('.js-dropdown-toggle').addClass('js-dropdown-active');
}

$(document).ready(function() {
  if($('body').is('.tools')){
    contentSubMenu();
    $('.nav--secondary').show();
  }

  $('nav .js-dropdown-toggle').click(function(e){
    e.preventDefault;
    if ($(this).find('.js-dropdown-content').html() ==  $('.js-dropdown-menu').html()) {
      $('.js-dropdown-toggle').removeClass('js-dropdown-active');
      $('.nav--secondary').slideUp(100);
      $('.js-dropdown-menu').empty();
    }
    else {
      contentSubMenu();
      $('.nav--secondary').slideDown(100);
    }
  });
});

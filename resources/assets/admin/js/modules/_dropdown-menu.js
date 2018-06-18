$(document).ready(function() {

  if($('body').is('.tools')){
    $('.js-dropdown-toggle').removeClass('js-dropdown-active');
    $('.js-dropdown-menu').html($('.js-dropdown-toggle').find('.js-dropdown-content').html());
    $('.nav--secondary').show();
    $('.js-dropdown-toggle').addClass('js-dropdown-active');
  }

  $('nav .js-dropdown-toggle').click(function(e){
    e.preventDefault;
    if ($(this).find('.js-dropdown-content').html() ==  $('.js-dropdown-menu').html()) {
      $('.js-dropdown-toggle').removeClass('js-dropdown-active');
      $('.nav--secondary').slideUp(100);
      $('.js-dropdown-menu').empty();
    }
    else {
      $('.js-dropdown-toggle').removeClass('js-dropdown-active');
      $('.js-dropdown-menu').html($('.js-dropdown-toggle').find('.js-dropdown-content').html());
      $('.nav--secondary').slideDown(100);
      $('.js-dropdown-toggle').addClass('js-dropdown-active');
    }
  });
});

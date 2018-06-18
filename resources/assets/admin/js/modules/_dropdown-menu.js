

$(document).ready(function() {
  if($('body').is('.tools')){
    $('.js-dropdown-menu').html($('.js-dropdown-toggle.tools').find('.js-dropdown-content').html());
    $('.js-dropdown-toggle.tools').addClass('js-dropdown-active');
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
      $('.js-dropdown-toggle').removeClass('js-dropdown-active');
      $('.js-dropdown-menu').html($(this).find('.js-dropdown-content').html());
      $(this).addClass('js-dropdown-active');
      $('.nav--secondary').slideDown(100);
    }
  });
});

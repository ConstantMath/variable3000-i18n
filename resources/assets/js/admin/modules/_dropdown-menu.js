$('nav .js-dropdown-toggle').click(function(e){
  e.preventDefault;
  if ($(this).find('.js-dropdown-content').html() ==  $('.js-dropdown-menu').html()) {
    $(this).removeClass('js-dropdown-active');
    $('.nav--secondary').slideUp(100);
    $('.js-dropdown-menu').empty();
  }
  else {
    $('.js-dropdown-toggle').removeClass('js-dropdown-active');
    $('.js-dropdown-menu').html($(this).find('.js-dropdown-content').html());
    $('.nav--secondary').slideDown(100);
    $(this).addClass('js-dropdown-active');
  }
});

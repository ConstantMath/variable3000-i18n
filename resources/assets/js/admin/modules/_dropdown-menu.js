$('nav .js-dropdown').click(function(e){
  if ($(this).hasClass('.js-dropdown--opened')) {
    $(this).find('.js-dropdown-menu').slideUp(250);
    $(this).find('.js-dropdown-icon').removeClass('fa-angle-up').addClass('fa-angle-down');
    $(this).removeClass('.js-dropdown--opened');
  }
  else {
    $(this).find('.js-dropdown-menu').slideDown(250);
    $(this).find('.js-dropdown-icon').removeClass('fa-angle-down').addClass('fa-angle-up');
    $(this).addClass('.js-dropdown--opened');
  }
});

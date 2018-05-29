$(document).on('click', 'a[data-toggle="modal"]', function(e) {
  e.preventDefault();
  $($(this).attr('data-target')).fadeIn(250);
});

$(document).on('click', '*[data-dismiss="modal"]', function(e) {
  e.preventDefault();
  $(this).parents('.modal').fadeOut(250);
});

$(document).keyup(function(e) {
     if (e.keyCode == 27) { // escape key maps to keycode `27`
       $(".modal").fadeOut(250);
    }
});

$(document).ready(function() {
  if($('.select-admin-layout').length ) {

    form_layout($('.select-admin-layout'));

    $(".select-admin-layout").change(function() {
      form_layout($(this));
    });


  }
});


function form_layout(el){
  var clss = el.val();
  var parent = el.parent().parent();
  parent.children('.form-group.opt').each(function () {
    // $(this).addClass(clss);
    if($(this).hasClass(clss)){
      $(this).show();
    }else{
      $(this).hide();
    }

  });
}

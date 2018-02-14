$(document).ready(function() {

  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
  });

  // ----- Date picker ----- //
  // http://eonasdan.github.io/bootstrap-datetimepicker/

  if ( $('.datepicker').length ){
    $('.datepicker').datetimepicker({
      locale: 'en',
      format: 'DD/MM/YYYY'
    });
  }


  // ----- Tags list select ----- //
  if ( $('.select2').length ){
    $('.select2').select2({
      placeholder : 'Select or add something',
      tags        : true,
      tokenSeparators: [","],
      allowClear: true,
    });
  }


  // ----- Display created at ----- //
  $('.tip.created_at').on('click',function(){
    $(this).addClass('show');
  });


  // ----- Color picker ----- //
  if ( $('.sortable').length ){
    $('.color-picker').colorpicker({ /*options...*/ });
  }

  // ----- Hide index alerts ----- //
  $(".alert").delay(2000).fadeOut(300);


  // ----- Login logo  ----- //

  // var top = Math.floor(Math.random() * (90 - 2 + 1)) + 2;
  // var left = Math.floor(Math.random() * (90 - 2 + 1)) + 2;
  // var n = Math.floor(Math.random() * (11 - 1 + 1)) + 1;
  // var oizo = $('#oizo');
  // oizo.css("left", left + "%");
  // oizo.css("top", top + "%");
  // oizo.css("display", "block");
  // oizo.html('<img src="/assets/admin/images/'+ n +'.png"/>');


});


// ----- Login fantom  ----- //

function getRandomY(bottom, top){
  return Math.floor( Math.random() * ( 1 + top - bottom ) ) + bottom;
}

// fantom
var div = document.getElementById('fantom');

if (typeof(div) != 'undefined' && div != null){
  // screen limits
  var maxY = $(window).height();
  var maxX = $(window).width();
  var x = 0;
  // move around up and down y
  var range = 20;
  var start_y = getRandomY(range, maxY - range);
  // calculate the sin-values from the angle variable
  // since the Math.sin function is working in radiants
  // we must increase the angle value in small steps -> anglespeed
  // the bigger the anglespeed value is, the wider the sine gets
  var angle = 0;
  var anglespeed = 0.10;
  // speed of the movement - 1 means it increases the x value
  var speed = 1;
  // go
  animate();
}

function animate() {
  x += speed;
  // increase value for sin calculation
  angle += anglespeed;
  // always add to a fixed value
  // multiply with range, sine only delivers values between -1 and 1
  y = start_y + Math.sin(angle) * range;
  if(x > (maxX + 30)) {
    maxY = $(window).height();
    maxX = $(window).width();
    x = 0;
    // increase range
    range += 0.10;
    start_y = getRandomY(range, maxY - range);
  }
  div.style.top = y + "px";
  div.style.left = x + "px";
  setTimeout(animate, 33);
}

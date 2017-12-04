var url = '/en/admin';

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


  // ----- Markdown editor ----- //
  // https://github.com/NextStepWebs/simplemde-markdown-editor

  if ( $('.md-editor').length ){
    // Loop editors
    $('.md-editor').each(function() {
      var simplemde = new SimpleMDE({
        element: this,
        toolbar: [
          "heading-3", "bold", "italic", "|", "quote", "ordered-list", "unordered-list", "link", "|", "preview", "side-by-side", "fullscreen", "|",
          {
            name: "help",
            action: function customFunction(editor){
              window.open('http://variable.club/_docs/markdown-guide.html', '_blank');
            },
            className: "fa fa-question-circle",
            title: "Help",
          }
        ],
      });
      // simplemde.render();

      inlineAttachment.editors.codemirror4.attach(simplemde.codemirror, {
        uploadUrl: '/en/admin/fileupload',
        allowedTypes: ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'application/pdf'],
        extraHeaders: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        // Controller Response
        onFileUploadResponse: function(xhr) {
          var result = JSON.parse(xhr.responseText),
          filename = result[this.settings.jsonFieldName];

          if (result && filename) {
            var newValue;
            // Test si pdf > change l'insert Markdown
            if(result.extension == 'pdf'){
              urlText = '['+result.name+']({filename})';
            }else{
              urlText = this.settings.urlText;
            }
            if (typeof urlText === 'function') {
              newValue = urlText.call(this, filename, result);
            } else {
              newValue = urlText.replace(this.filenameTag, filename);
            }
            var text = this.editor.getValue().replace(this.lastValue, newValue);
            this.editor.setValue(text);
            this.settings.onFileUploaded.call(this, filename);
          }
          return false;
        }
      });
      // Relaunch simplemde on tab change
      $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
      	setTimeout(function() { simplemde.codemirror.refresh(); }, 10);
      });
    })
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


  // ----- Sortable indexes----- //

  if ( $('table .sortable').length ){
    // Get sortables elements
    var elements = document.getElementsByClassName("sortable");
    // Loop sortable elements
    for(var i = 0; i < elements.length; i++){
      Sortable.create(elements.item(i), {
        onUpdate: function (evt) {
          var article_id   = evt.item.getAttribute('data-article-id');
          var parent_id    = evt.item.getAttribute('data-parent-id');
          var new_order    = evt.newIndex;
          if (article_id && parent_id) {
            jQuery.ajax({
              url: '/admin/articles/' + article_id + '/reorder',
              data: {
                'parent_id' : parent_id,
                'new_order' : new_order,
              },
              type: 'POST',
              success: function(response){
                if(response.status == 'success'){
                  //$('<span class="message pull-right">Updated !</span>').appendTo(".panel-mediagallery .panel-heading").fadeOut(3000);
                }
              }
            });
          }
        }
      });
    }
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
  $("main .alert").delay(2000).fadeOut(300);


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

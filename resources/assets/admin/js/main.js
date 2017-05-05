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

  if ( $('#rich-editor').length ){
    // Define
    var simplemde = new SimpleMDE({
      element: $("#rich-editor")[0],
      toolbar: [
        "heading-2", "bold", "italic", "|", "quote", "ordered-list", "unordered-list", "link", "|", "preview", "side-by-side", "fullscreen", "|",
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

    // Markdown Editor > File upload w/ inline attachment & codemirror
    inlineAttachment.editors.codemirror4.attach(simplemde.codemirror, {
      uploadUrl: '/admin/fileupload',
      extraHeaders: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      },

      onFileUploadResponse: function(xhr) {
        var result = JSON.parse(xhr.responseText),
        filename = result[this.settings.jsonFieldName];
        if (result && filename) {
          var newValue;
          if (typeof this.settings.urlText === 'function') {
            newValue = this.settings.urlText.call(this, filename, result);
          } else {
            newValue = this.settings.urlText.replace(this.filenameTag, filename);
          }
          var text = this.editor.getValue().replace(this.lastValue, newValue);
          this.editor.setValue(text);
          this.settings.onFileUploaded.call(this, filename);
        }
        return false;
      }
    });
  }


  // ----- Tags list select ----- //

  $('.select2').select2({
    placeholder : 'Select or add something',
    tags        : true,
    tokenSeparators: [","],
    allowClear: true,
  });


  // ----- Sortable indexes----- //

  if ( $('.sortable').length ){
    var el = document.getElementById("index");
    Sortable.create(el, {
      onUpdate: function (evt) {
        var url          = evt.item.getAttribute('url');
        var parent_slug  = evt.item.getAttribute('parent');
        var new_order    = evt.newIndex;
        if (url && parent_slug) {
          jQuery.ajax({
            url: url,
            data: {
              'parent_slug' : parent_slug,
              'new_order'   : new_order,
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

  // ----- Display created at ----- //

  $('.tip.created_at').on('click',function(){
    $(this).addClass('show');
  });


  // ----- Color picker ----- //

  $('.color-picker').colorpicker({ /*options...*/ });


});

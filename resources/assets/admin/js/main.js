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
        uploadUrl: '/admin/fileupload',
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
        var parent_id  = evt.item.getAttribute('parent_id');
        var new_order    = evt.newIndex;
        if (url && parent_id) {
          jQuery.ajax({
            url: url,
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

  // ----- Display created at ----- //

  $('.tip.created_at').on('click',function(){
    $(this).addClass('show');
  });


  // ----- Color picker ----- //

  $('.color-picker').colorpicker({ /*options...*/ });


});

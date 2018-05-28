$(document).ready(function() {

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
        uploadUrl: admin_url + '/fileupload',
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

});

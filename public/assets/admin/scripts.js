$(document).ready(function() {
    if ($('.select-admin-layout').length) {

        form_layout($('.select-admin-layout'));

        $(".select-admin-layout").change(function() {
            form_layout($(this));
        });


    }
});


function form_layout(el) {
    var clss = el.val();
    var parent = el.parent().parent();
    parent.children('.form-group.opt').each(function() {
        // $(this).addClass(clss);
        if ($(this).hasClass(clss)) {
            $(this).show();
        } else {
            $(this).hide();
        }

    });
}

$(document).ready(function() {

    // ----- Medias panel add & upload ----- //

    // input file > open
    $(".media-add").click(function() {
        var input = $(this).prev();
        input.attr("type", "file");
        input.trigger('click');
        return false;
    });


    // ----- Add single media w/ Ajax ----- //

    var single_media_options = {
        success: singleMediaResponse,
        dataType: 'json'
    };

    $('body').delegate('.input-single-media-upload', 'change', function() {
        $('.single-media-form').ajaxForm(single_media_options).submit();
    });

    function singleMediaResponse(response, statusText, xhr, $form) {
        if (response.success == false) {
            // À faire
        } else {
            $('#main-form #' + response.column_name).val(JSON.stringify(response.media_id));
            $('#panel-' + response.column_name + ' li:not(.ghost)').detach();
            updateModalInfos(response);
        }
    }


    // ----- Add gallery media w/ Ajax ----- //

    var options = {
        success: galleryMediaResponse,
        dataType: 'json'
    };

    $('body').delegate('#gallery-image', 'change', function() {
        $('#article-gallery-upload').ajaxForm(options).submit();
    });

    function galleryMediaResponse(response, statusText, xhr, $form) {
        if (response.success == false) {
            // À faire
            // var arr = response.errors;
            // $.each(arr, function(index, value){
            //   if (value.length != 0){
            //     $("#validation").append('<div class="alert alert-error"><strong>'+ value +'</strong><div>');
            //   }
            // });
            // $("#validation").show();
        } else {
            if (response.article_id == 'null') {
                var medias = [];
                var current_medias = $('#input-mediagallery').val();
                if (current_medias) {
                    medias = medias.concat(current_medias);
                }
                // Ajoute le media courant au tableau des médias
                medias.push(response.media_id);
                $('#main-form #input-mediagallery').val(medias);
            }
            updateModalInfos(response);
        }
    }

    // ----- Sortable ----- //

    if ($('#mediagallery').length) {
        Sortable.create(mediagallery, {
            /* options */
            onUpdate: function(evt) {
                var url = evt.item.getAttribute('url');
                var mediaId = evt.item.getAttribute('media-id');
                var newOrder = evt.newIndex;

                if (url && mediaId) {
                    jQuery.ajax({
                        url: url,
                        data: {
                            'mediaId': mediaId,
                            'newOrder': newOrder,
                        },
                        type: 'POST',
                        success: function(response) {
                            if (response.status == 'success') {
                                $('<span class="message pull-right">Updated !</span>').appendTo(".panel-mediagallery .panel-heading").fadeOut(3000);
                            } else {}
                        }
                    });
                }
            }
        });
    }

})


function updateModalInfos(data) {
    var media = $('#panel-' + data.column_name + ' .ghost');
    var media2 = media.clone();
    media.before(media2);
    media2.removeClass('ghost');
    media2.attr("media-id", data.media_id);
    media2.attr("id", 'media-' + data.media_id);
    media2.find('a').attr("data-article-id", data.article_id);
    media2.find('a').attr("data-media-id", data.media_id);
    media2.find('a').attr("data-media-alt", data.media_alt);
    media2.find('a').attr("data-media-description", data.media_description);
    // Custom
    media2.find('a').attr("data-size", data.size);
    media2.find('a').attr("data-media-background-color", data.media_background_color);
    media2.find('a').attr("data-media-background-image", data.media_background_image);

    media2.find('a').attr("data-delete-link", '/admin/articles/' + data.media_id + '/deletemedia');
    if (data.media_type == 'jpg' || data.media_type == 'png' || data.media_type == 'gif' || data.media_type == 'svg' || data.media_type == 'jpeg') {
        var icon = '<i class="fa fa-image"></i>';
        media2.find('a').attr("data-media-url", '/imagecache/large/' + data.media_name);
    } else if (data.media_type == 'pdf') {
        var icon = '<i class="fa fa-file-pdf-o"></i>';
        media2.find('a').attr("data-media-url", '');
    } else {
        var icon = '<i class="fa fa-file"></i>';
        media2.find('a').attr("data-media-url", '');
    }
    media2.find('i.fa').remove();
    media2.find('span').before(icon);
    media2.find('span').html(data.media_alt);
}

// ----- Declare modal ----- //

$('#modal-media-edit').on('show.bs.modal', function(event) {
    var button = $(event.relatedTarget);
    var article_id = button.data('article_id');
    var data_delete_link = button.data('delete-link');
    var column_name = button.data('column-name');
    var media_id = button.data('media-id');
    var media_alt = button.data('media-alt');
    var media_url = button.data('media-url');
    var media_description = button.data('media-description');
    var modal = $(this);
    modal.find('.media-delete').attr("href", data_delete_link);
    modal.find('.media-delete').attr("column_name", column_name);
    modal.find('.media-delete').attr("media_id", media_id);
    modal.find('.single-m-delete').attr("media_id", media_id);
    modal.find('#input_media_id').val(media_id);
    modal.find('#input_media_alt').val(media_alt);
    modal.find('#input_media_description').val(media_description);
    modal.find('#pic').attr("src", media_url);
    $("#modalButton").off('click');
})

$('#modal-media-edit-custom').on('show.bs.modal', function(event) {
    var button = $(event.relatedTarget);
    var article_id = button.data('article_id');
    var data_delete_link = button.data('delete-link');
    var column_name = button.data('column-name');
    var media_id = button.data('media-id');
    var media_alt = button.data('media-alt');
    var media_url = button.data('media-url');
    var size = button.data('media-size');
    var background_color = button.data('media-background-color');
    var background_image = button.data('media-background-image');

    var modal = $(this);
    modal.find('#pic').attr("src", media_url);
    modal.find('.media-delete').attr("href", data_delete_link);
    modal.find('.media-delete').attr("column_name", column_name);
    modal.find('.media-delete').attr("media_id", media_id);
    modal.find('.single-m-delete').attr("media_id", media_id);
    modal.find('#input_media_id').val(media_id);
    modal.find('#input_media_alt').val(media_alt);
    modal.find('#size').val(size);
    modal.find('#background-color').val(background_color);
    if (background_image.endsWith("small/")) { // background_imge vide
        modal.find('#pic-background-image').hide();
    } else {
        modal.find('#pic-background-image').attr("src", background_image);
    }
    $("#modalButton").off('click');
})

$(document).ready(function() {

    // ----- Edit media (single & gallery) ----- //

    var media_edit_options = {
        success: mediaEditResponse,
        dataType: 'json'
    };

    $(".media-edit-save").click(function(e) {
        e.preventDefault();
        $(this).closest('form').ajaxForm(media_edit_options).submit();
    });

    function mediaEditResponse(response, statusText, xhr, $form) {
        if (response.status == 'success') {
            var media = $('li#media-' + response.media_id);
            // Clonage de l'élément, sinon impossible de mettre à jour les attributs
            var media2 = media.clone();
            media.hide();
            var media_link = media2.find('> a');
            media2.find('span').text(response.media_alt);
            media2.find('a').attr("data-media-alt", response.media_alt);
            media2.find('a').attr("data-media-description", response.media_description);
            // Custom
            media2.find('a').attr("data-media-size", response.media_size);
            media2.find('a').attr("data-media-background-image", '/imagecache/small/' + response.media_background_image);
            media2.find('a').attr("data-media-background-color", response.media_background_color);

            media.before(media2);
            media.remove();
        }
    }


    // ----- Delete a media ----- //

    // click sur les descendants de media panel
    $('.modal').on('click', '.media-delete', function(e) {
        e.preventDefault();
        var url = $(this).attr('href')
        var column_name = $(this).attr('column_name');
        var media_id = $(this).attr('media_id');

        if (url && media_id) {
            jQuery.ajax({
                url: url,
                data: {
                    'column_name': column_name,
                    'media_id': media_id,
                },
                type: 'POST',
                success: function(response) {
                    if (response.status == 'success') {
                        if (response.column_name == 'mediagallery') {
                            // Galleries : Loop dans les medias & delete
                            var mediagallery_val = $('#main-form #input-mediagallery').val();
                            var mediagallery_arr = mediagallery_val.split(',');
                            for (var i = mediagallery_arr.length - 1; i >= 0; i--) {
                                if (mediagallery_arr[i] === response.media_id) {
                                    mediagallery_arr.splice(i, 1);
                                    $('#main-form #input-mediagallery').val(mediagallery_arr);
                                }
                            }
                        } else {
                            $('#main-form #' + column_name).val(null);
                        }
                        $('#panel-' + response.column_name + ' .list-group #media-' + response.media_id).detach();
                    }
                }
            });
        }
    });
});

$(document).ready(function() {

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });



    // ----- Date picker ----- //
    // http://eonasdan.github.io/bootstrap-datetimepicker/

    if ($('.datepicker').length) {
        $('.datepicker').datetimepicker({
            locale: 'en',
            format: 'DD/MM/YYYY'
        });
    }


    // ----- Markdown editor ----- //
    // https://github.com/NextStepWebs/simplemde-markdown-editor

    if ($('.md-editor').length) {
        // Loop editors
        $('.md-editor').each(function() {
            var simplemde = new SimpleMDE({
                element: this,
                toolbar: [
                    "heading-3", "bold", "italic", "|", "quote", "ordered-list", "unordered-list", "link", "|", "preview", "side-by-side", "fullscreen", "|",
                    {
                        name: "help",
                        action: function customFunction(editor) {
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
                        if (result.extension == 'pdf') {
                            urlText = '[' + result.name + ']({filename})';
                        } else {
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
            $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
                setTimeout(function() {
                    simplemde.codemirror.refresh();
                }, 10);
            });
        })
    }

    // ----- Tags list select ----- //

    $('.select2').select2({
        placeholder: 'Select or add something',
        tags: true,
        tokenSeparators: [","],
        allowClear: true,
    });


    // ----- Sortable indexes----- //

    if ($('.sortable').length) {
        var el = document.getElementById("index");
        Sortable.create(el, {
            onUpdate: function(evt) {
                var url = evt.item.getAttribute('url');
                var parent_id = evt.item.getAttribute('parent_id');
                var new_order = evt.newIndex;
                if (url && parent_id) {
                    jQuery.ajax({
                        url: url,
                        data: {
                            'parent_id': parent_id,
                            'new_order': new_order,
                        },
                        type: 'POST',
                        success: function(response) {
                            if (response.status == 'success') {
                                //$('<span class="message pull-right">Updated !</span>').appendTo(".panel-mediagallery .panel-heading").fadeOut(3000);
                            }
                        }
                    });
                }
            }
        });
    }

    // ----- Display created at ----- //

    $('.tip.created_at').on('click', function() {
        $(this).addClass('show');
    });


    // ----- Color picker ----- //

    $('.color-picker').colorpicker({ /*options...*/ });


});
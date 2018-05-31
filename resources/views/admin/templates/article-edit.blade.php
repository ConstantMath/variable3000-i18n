@extends('admin.app')

@section('page_title', $data['page_title'])
@section('page_class', $data['page_class'])

@section('content')
      @if(isset($article->id))
        {!! Form::model($article, ['route' => ['admin.articles.update', $article->id], 'method' => 'put', 'class' => 'panel panel-edit main-form', 'id' => 'main-form', 'files' => true]) !!}
      @else
        {!! Form::model($article, ['route' => ['admin.articles.store'], 'method' => 'post', 'class' => 'panel panel-edit main-form', 'id' => 'main-form', 'files' => true]) !!}
      @endif
        <div class="panel-heading">
          {{$parent->title or 'Edit' }}
          @if(isset($article->id))
          <div class="tip pull-right created_at">
            {!! Form::text('created_at', null, ['class' => 'form-control created_at']) !!}
          </div>
          @endif
        </div>
        <div id="validation"></div>
        @include('admin.components.article-form', ['submitButtonText' => 'Save'])
    {!! Form::close() !!}
    </div>
    <div class="article-aside">
      @include('admin.components.article-aside')
    </div>

    @if(isset($article->id))
      <ul class="article-options">
        <li>
          @include('admin.components.delete-form', ['model' => $article, 'model_name' => 'articles'])
        </li>
        <li>
          <a href="{{ url('/') }}/{{ $article->slug }}" class="link" target="_blank"> preview</a>
        </li>
      </ul>
    @endif
  </div>
@endsection

@section('meta')
  <meta name="csrf-token" content="{{ csrf_token() }}" />
@endsection

@section('scripts')
<script type="text/javascript">
$(document).ready(function() {

  // ----- Medias panel display data----- //

  if( $('.media-panel').length ){
    $('.media-panel').each(function( index ) {
      var media_collection_name = $(this).attr('data-media-collection-name');
      var article_model_type = $(this).attr('data-article-model_type');
      // Build media list
      getMedias(media_collection_name, article_model_type);
    });
  }


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
    success:  mediaResponse,
    dataType: 'json'
  };

  $('body').delegate('.input-single-media-upload','change', function(){
    var panel = $(this).closest('.media-panel');
    var form = $(this).closest('.single-media-form');
    form.ajaxForm(single_media_options).submit();
    panel.addClass('loading');
  });

  function mediaResponse(response, statusText, xhr, $form){
    if(response.success == true){
      addMediaInput(response.media);
    }else{
      var panel = $('#panel-' + response.type);
      var message_field = $('#panel-' + response.type + ' .message');
      panel.removeClass('loading');
      message_field.html(response.error).fadeOut(6000);
    }
  }

})

// ----- Mixins ----- //

/* manage data list */
function getMedias(media_collection_name, article_model_type) {
  // mediatable_type = typeof mediatable_type  === 'undefined' ? 'articles' : mediatable_type;
  var main_form_id = 'main-form';
  var article_id = $('#' + main_form_id + ' input[name=id]').val();
  var current_medias = $('#' + main_form_id + ' #' + media_collection_name).val();
  var panel = $("#panel-" + media_collection_name);
  var model_name = slugifyModel(article_model_type);
  console.log(model_name);
  // Get from DB
  if(article_id){
    $.ajax({
        dataType: 'JSON',
        url: admin_url+'/mediasArticle/' + model_name + '/' + article_id + '/' + media_collection_name,
    }).done(function(data){
      if(data.success == true){
        printList(data.medias, media_collection_name, article_model_type);
        panel.removeClass('loading');
      }
    });
  // Get from input field
  }else if(current_medias){
    var medias = [];
    medias = medias.concat(current_medias);
    $.ajax({
        type: 'POST',
        url: admin_url+'/medias/get',
        data: {medias}
    }).done(function(data){
      if(data.success == true){
        printList(data.medias, media_type, mediatable_type);
        panel.removeClass('loading');
      }
    });
  }else{
    panel.removeClass('loading');
  }
}


/* manage data list */
function printList(medias, media_type, mediatable_type) {
  mediatable_type = typeof mediatable_type  === 'undefined' ? 'articles' : mediatable_type;
  if(medias && media_type){
    var ul = $('#panel-'+media_type+' .media-list');
    var	li = '';
    // Json Medias loop
    $.each( medias, function( key, value ) {
      // Build <li>
      li = li + '<li class="list-group-item media-list__item" data-media-table-type="' + mediatable_type + '" data-media-id="' + value.id + '" data-article-id="' + value.mediatable_id + '" data-article-id="' + value.mediatable_id + '" data-media-type="' + value.type + '">';
      li = li + '<div class="media__infos"><p class="media__title">'+value.alt+'</p>';
      li = li + '<p><a href="" class="link link--edit" data-toggle="modal" data-target="#modal-media-edit" data-media-type="'+value.type+'" data-media-table-type="'+mediatable_type+'" data-media-id="'+value.id+'" data-media-description="'+value.description+'" data-media-ext="'+value.ext+'" data-media-alt="'+value.alt+'" data-media-name="'+value.name+'">edit</a></p>';
      li = li + '<p><a href="' + admin_url + '/medias/destroy/' + mediatable_type + '/' + value.id + '" class="link link--delete">delete</a></p></div>';
      //media preview
      if(value.ext == 'jpg' || value.ext == 'png' || value.ext == 'gif' || value.ext == 'svg' || value.ext == 'jpeg'){
        li = li + '<div class="media__preview" style="background-image:url(\'/imagecache/thumb/' + value.name + '\')"></div>';
      }else if(value.ext == 'pdf'){
        li = li + '<div class="media__preview"><span>PDF</span></div>';
      }else if(value.ext == 'mp4'){
        li = li + '<div class="media__preview"><span>VIDEO</span></div>';
      }else{
        li = li + '<div class="media__preview">FILE</div>';
      }
      li = li + '</li>';
    });
    ul.html(li);
  }
}


/* Update hidden medias inputs */
function addMediaInput(media) {
  var main_form_id = 'main-form';
  var medias = [];
  var inputField = $('#' + main_form_id + ' #' + media.collection_name);
  var current_medias = inputField.val();
  if(current_medias){medias = medias.concat(current_medias)}
  medias.push(media.id);
  inputField.val(medias);
  getMedias(media.collection_name, media.model_type);
}


/* Slugify model name */
function slugifyModel(str) {
  str = str.replace('App\\', '').toLowerCase();
  return str;
}
</script>

@endsection

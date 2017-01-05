{!! Form::hidden('parent_id', $parent_id) !!}
{!! Form::hidden('post_image_une', null, ['id' => 'post-image-une']) !!}
{!! Form::hidden('post_medias[]', null, ['id' => 'post-medias']) !!}
<div class="form-group">
  <div class="checkbox">
    <label>
      {!! Form::checkbox('published', 1, null) !!}Published
    </label>
  </div>
</div>
<div class="form-group {!! $errors->has('name') ? 'has-error' : '' !!}">
  <label for="title">Titre</label>
  {!! Form::text('title', null, ['class' => 'form-control', 'placeholder' => 'Titre']) !!}
  {!! $errors->first('title', '<span class="help-block">:message</span>') !!}
</div>
<div class="form-group {!! $errors->has('name') ? 'has-error' : '' !!}">
  <label for="intro">Intro</label>
  {!! Form::textarea('intro', null, ['class' => 'form-control', 'placeholder' => 'Intro', 'rows' => '3']) !!}
</div>
<div class="form-group {!! $errors->has('name') ? 'has-error' : '' !!}">
  <label for="text">Texte</label>
  {!! Form::textarea('text', null, ['class' => 'form-control', 'id' => 'rich-editor', 'placeholder' => 'Texte']) !!}
</div>
<div class="form-group">
  <label for="tags_general">General tags</label>
  {!! Form::select('tag_list[]', $tags_general, null, ['class' => 'form-control', 'id' => 'tags_general', 'multiple', 'style' => 'width:100%']) !!}
</div>
<div class="form-group">
  {!! Form::submit($submitButtonText, ['class' => 'btn btn-primary']) !!}
</div>

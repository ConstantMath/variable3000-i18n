<?php $medias = ($article->medias) ? $article->medias->where('type', $media_type) :'' ;?>
<div
class="panel panel-default media-panel loading {{ $panel_type }}"
  id="panel-{{ $media_type }}"
  data-media-type="{{ $media_type }}"
  data-media-table-type="{{ $article->getTable() }}"
  >
  <div class="panel-heading">{{ $panel_title }}</div>
  <div class="panel-body">
    <ul class="list-group sortable media-list">
    </ul>
    <i class="fa fa-ellipsis-h blink"></i>
    <span class="message" class="hidden"></span>
    @if (isset($article->id))
      {!! Form::model($article, ['route' => ['admin.medias.store', $article->getTable(), $article->id], 'method' => 'post', 'class' => 'form-horizontal single-media-form', 'autocomplete' => 'off', 'enctype' => 'multipart/form-data', 'files'=>'true']) !!}
    @else
      {!! Form::model($article, ['route' => ['admin.medias.store', $article->getTable(), 'null'], 'method' => 'post', 'class' => 'form-horizontal single-media-form', 'autocomplete' => 'off', 'enctype' => 'multipart/form-data', 'files'=>'true']) !!}
    @endif
    {!! Form::hidden('type', $media_type) !!}
      {{-- Always put file form before submit bt  --}}
      <input type="file" name="image" class="input-single-media-upload" />
      <a href="#" class="media-add"><i class="fa fa-btn fa-plus-circle"></i> Add</a>
    {!! Form::close() !!}
  </div>
</div>

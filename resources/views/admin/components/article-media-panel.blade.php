
<div
class="panel panel-default media-panel loading {{ $panel_type }}"
  id="panel-{{ $collection_name }}"
  data-media-collection-name="{{ $collection_name}}"
  data-article-model_type="get_class($article)"
  >
  <div class="panel-heading">
    {{ $panel_title }}
    @if (isset($article->id))
      {!! Form::model($article, ['route' => ['admin.medias.storeandlink', $article->getTable(), $article->id], 'method' => 'post', 'class' => 'form-horizontal single-media-form', 'autocomplete' => 'off', 'enctype' => 'multipart/form-data', 'files'=>'true']) !!}
    @else
      {!! Form::model($article, ['route' => ['admin.medias.storeandlink', $article->getTable(), 'null'], 'method' => 'post', 'class' => 'form-horizontal single-media-form', 'autocomplete' => 'off', 'enctype' => 'multipart/form-data', 'files'=>'true']) !!}
    @endif
    {!! Form::hidden('collection_name', $collection_name) !!}
      {{-- Always put file form before submit bt  --}}
      <input type="file" name="image" class="input-single-media-upload" />
      <a href="#" class="media-add btn btn-primary btn-xs"> Add</a>
    {!! Form::close() !!}
  </div>
  <div class="panel-body">
    <ul class="list-group sortable media-list">
    </ul>
    <i class="fa fa-ellipsis-h blink"></i>
    <?php // TODO: position du message (dans le header fantom ?) ?>
    <span class="message" class="hidden"></span>
  </div>
  <div class="panel-action">

  </div>
</div>

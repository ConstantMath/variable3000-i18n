
<div
class="panel panel-default media-panel loading {{ $panel_type }}"
  id="panel-{{ $collection_name }}"
  data-media-collection-name="{{ $collection_name}}"
  data-article-model_type="{{ get_class($article) }}"
  >
  <div class="panel-heading">
    <h2>{{ $panel_title }}</h2>
    @if (isset($article->id))
      {!! Form::model($article, ['route' => ['admin.medias.storeandlink', $article->getTable(), $article->id], 'method' => 'post', 'class' => 'form-horizontal single-media-form', 'autocomplete' => 'off', 'enctype' => 'multipart/form-data', 'files'=>'true']) !!}
      {!! Form::hidden('collection_name', $collection_name) !!}
        {{-- Always put file form before submit bt  --}}
        <input type="file" name="image" class="input-single-media-upload" />
        <a href="#" class="media-add btn btn-primary btn-xs"> {{__('admin.add')}}</a>
      {!! Form::close() !!}
    @else
      <a href="#" class="media-add btn btn-primary btn-disabled btn-xs"> {{__('admin.add')}}</a>
    @endif
  </div>
  <div class="panel-body">
    @if (isset($article->id))
      <ul class="list-group sortable media-list">
      </ul>
      <i class="fa fa-ellipsis-h blink"></i>
    @else
      <p class="advice">{{__('admin.save_this_first')}}</p>
    @endif

  </div>
</div>

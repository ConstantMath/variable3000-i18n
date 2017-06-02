<div class="panel panel-default media-panel" id="panel-{{ $column_name }}">
  <div class="panel-heading">{{  $panel_title }}</div>
  <div class="panel-body">
    <ul class="list-group">
      @if (!empty($media))
        @include('admin.components.molecules-media-li')
      @endif
      <?php unset($media); ?>
      {{-- ajoute le ghost --}}
      @include('admin.components.molecules-media-li')
    </ul>
    @if (isset($article->id))
      {!! Form::model($article, ['route' => ['admin.articles.addsinglemedia', $article->id], 'method' => 'post', 'class' => 'form-horizontal single-media-form', 'autocomplete' => 'off', 'enctype' => 'multipart/form-data', 'files'=>'true']) !!}
    @else
      {!! Form::model($article, ['route' => ['admin.articles.addsinglemedia', 'null'], 'method' => 'post', 'class' => 'form-horizontal single-media-form', 'autocomplete' => 'off', 'enctype' => 'multipart/form-data', 'files'=>'true']) !!}
    @endif
    {!! Form::hidden('column_name', $column_name) !!}
      {{-- Toujours placer le champs file avant le submit  --}}
      <input type="file" name="image" class="input-single-media-upload" />
      <a href="#" class="media-add"><i class="fa fa-btn fa-plus-circle"></i> Add</a>
    {!! Form::close() !!}
  </div>
</div>

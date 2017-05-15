<div class="media" id="panel-{{ $column_name }}">
  <label for="{{ $column_name }}">{{  $panel_title }}</label>
  <?php
    $media = $media_;
    $media_name = (empty($media_))? '' : $media->name;
  ?>
  @if (!empty($media))
    <ul class="list-group">
    @include('admin.components.molecules-media-li')
    </ul>
  @endif
  {!! Form::file($column_name.'_file', ['class' => 'input-single-media-upload']) !!}
  {!! Form::hidden($column_name, $media_name, ['id' => $column_name]) !!}
</div>

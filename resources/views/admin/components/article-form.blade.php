{!! Form::hidden('parent_id', $article->parent->id) !!}
{!! Form::hidden('order', (!empty($article->order))? $article->order : 0) !!}
{!! Form::hidden('image_une', (!empty($article->image_une))? $article->image_une->id : '', ['id' => 'image_une']) !!}
{!! Form::hidden('mediagallery[]', null, ['id' => 'input-mediagallery']) !!}

{!! $errors->first('title', '<span class="help-block">:message</span>') !!}

{{-- Is published ? --}}
<div class="form-group">
  <div class="checkbox">
    <label>{!! Form::checkbox('published', 1, null) !!}Published</label>
  </div>
</div>
<div class="tabbable">
  {{-- tabs --}}
  @if(count(config('translatable.locales')) > 1 )
  <ul class="nav nav-tabs">
    @foreach (config('translatable.locales') as $lang)
      <li role="presentation" @if(App::getLocale() == $lang) class="active" @endif><a href="#tab{{ $lang }}" role="tab" id="dropdown{{ $lang }}-tab" data-toggle="tab" aria-controls="dropdown{{ $lang }}">{{ $lang }}</a></li>
    @endforeach
  </ul>
  @endif
  <div class="tab-content">
    {{-- lang panels  --}}
    @foreach (config('translatable.locales') as $lang)
    <div id="tab{{ $lang }}" class="tab-pane @if(App::getLocale() == $lang) active @endif">
      {{-- Title --}}
      <div class="form-group {!! $errors->has('title') ? 'has-error' : '' !!}">
        <label for="title">Title ({{$lang}})</label>
        {!! Form::text($lang.'[title]', (!empty($article->id) && !empty($article->translate($lang)->title))? $article->translate($lang)->title : old('title'), ['class' => 'form-control', 'placeholder' => 'Title']) !!}
        <span class="slug">
          @if(isset($article->slug))
          <i class="fa fa-link "></i>&nbsp;{{ (!empty($article->id) && !empty( $article->translate($lang)->slug))? $article->translate($lang)->slug : '' }}
          @endif
        </span>
      </div>
      {{-- Intro --}}
      <div class="form-group {!! $errors->has('intro') ? 'has-error' : '' !!}">
        <label for="intro">Intro ({{$lang}})</label>
        {!! Form::textarea($lang.'[intro]', (!empty($article->id) && !empty($article->translate($lang)->intro))? $article->translate($lang)->intro : old('intro'), ['class' => 'form-control md-editor', 'placeholder' => 'Infos', 'rows' => '5']) !!}
      </div>
      {{-- Text --}}
      <div class="form-group {!! $errors->has('text') ? 'has-error' : '' !!}">
        <label for="text">Text ({{$lang}})</label>
        {!! Form::textarea($lang.'[text]', (!empty($article->id) && !empty($article->translate($lang)->text))? $article->translate($lang)->text : old('text'), ['class' => 'form-control md-editor', 'id' => '', 'placeholder' => 'Text']) !!}
      </div>
    </div>
    @endforeach
  </div>
</div>

<hr>

{{-- Taxonomy: category --}}
<div class="form-group">
  <label for="category">Category</label>
  {!! Form::select('categories[]', $article->taxonomiesDropdown(1,1), null, ['class' => 'form-control select2', 'id' => '']) !!}
</div>

{{-- Taxonomy: tags --}}
<div class="form-group">
  <label for="tags_general">Tags</label>
  {!! Form::select('tag_list[]', $article->taxonomiesDropdown(2), null, ['class' => 'form-control select2', 'multiple', 'style' => 'width:100%']) !!}
</div>

{{-- Submit buttons --}}
<div class="form-group submit">
  {!! Form::submit('save', ['class' => 'btn btn-invert', 'name' => 'save']) !!}
  @if(isset($article->id))
  {!! Form::submit('save & close', ['class' => 'btn btn-primary', 'name' => 'finish']) !!}
  @endif
</div>

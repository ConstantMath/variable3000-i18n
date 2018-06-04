{!! Form::hidden('id', (!empty($article->id))? $article->id : '') !!}
{!! Form::hidden('parent_id', (!empty($article->parent) ? $article->parent->id : 0)) !!}
{!! Form::hidden('order', (!empty($article->order))? $article->order : 0) !!}
{!! Form::hidden('une[]', null, ['id' => 'une']) !!}
{!! Form::hidden('gallery[]', null, ['id' => 'gallery']) !!}


{{-- Validation errors --}}
@foreach ($errors->all() as $error)
    <span class="help-block">{{ $error }}</span>
@endforeach

    {{-- tabs --}}
    <div class="panel-heading">
      @if(count(config('translatable.locales')) > 1 )
      <ul class="tab-select">
        @foreach (config('translatable.locales') as $lang)
          <li role="presentation" data-tab="{{$lang}}" @if(App::getLocale() == $lang) class="active" @endif><a href="#" role="tab">{{ $lang }}</a></li>
        @endforeach
      </ul>
      <div class="edit-details">
        @if(isset($article->id))
        <div class="created_at">
          {!! Form::text('created_at', null, ['class' => 'form-control']) !!}
        </div>
        @endif
        {{-- Is published ? --}}
        <div class="is-published">
          <div class="checkbox">
            <label>{!! Form::checkbox('published', 1, null) !!}Published</label>
          </div>
        </div>
      </div>
    </div>
    @endif
    <div class="panel-body">
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
@include('admin.components.form-submit')

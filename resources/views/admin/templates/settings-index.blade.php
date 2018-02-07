@extends('admin.app')

@section('page_title', $data['page_title'])
@section('page_class', $data['page_class'])

@section('content')
  <div class="panel panel-default panel-settings">
    <div class="panel-heading">
      Settings
    </div>
    <div class="panel-body">
      <div class="col-sm-12">
      @foreach ($settings as $setting)
        <?php $translations = $setting->getTranslationsArray(); ?>
        {!! Form::model($setting, ['route' => ['admin.settings.update', $setting->id ], 'method' => 'put', 'class' => 'form-horizontal ']) !!}
        @foreach ($translations as $key => $value)
        <div class="form-group">
          <label for="content" class="col-sm-3 control-label">
            {{ $setting->translate($key)->name }}
            @if(count($translations)>1) [{{$key}}] @endif
            <span class="description">{{ $setting->translate($key)->description }}</span>
          </label>
          <div class="col-sm-6">
            <?php $form_type = $setting->translate($key)->name == 'Google analytics' ? 'text' :'textarea'; ?>
            {!! Form::$form_type($key.'[content]', $setting->translate($key)->content, ['class' => 'form-control', 'rows' => '4']) !!}
          </div>
          <div class="col-sm-3">
            {!! Form::submit('save', ['class' => 'btn btn-invert small', 'name' => 'finish']) !!}
          </div>
        </div>
        @endforeach
        {!! Form::close() !!}
      @endforeach
      </div>
    </div>
  </div>
@endsection

@section('meta')
  <meta name="csrf-token" content="{{ csrf_token() }}" />
@endsection

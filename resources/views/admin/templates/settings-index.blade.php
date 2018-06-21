@extends('admin.app')

@section('page_title', $data['page_title'])
@section('page_class', $data['page_class'])

@section('content')
  <div class="panel panel-default panel-edit panel-edit--single panel-settings">
    <div class="panel-heading">
      <div class="edit__header">
        <h1 class="edit__title">{{__('admin.settings')}}</h1>
      </div>
    </div>
      @foreach ($settings as $setting)
        <?php $translations = $setting->getTranslationsArray(); ?>
        {!! Form::model($setting, ['route' => ['admin.settings.update', $setting->id ], 'method' => 'put', 'class' => 'form-horizontal']) !!}
        @foreach ($translations as $key => $value)
        <div class="panel-body">
          <div class="form-group">
            <label for="content" class="control-label">
              {{ $setting->translate($key)->name }}
              @if(count($translations)>1) [{{$key}}] @endif
              <span class="description">{{ $setting->translate($key)->description }}</span>
            </label>
            <div class="">
              <?php $form_type = $setting->translate($key)->name == 'Google analytics' ? 'text' :'textarea'; ?>
              {!! Form::$form_type($key.'[content]', $setting->translate($key)->content, ['class' => 'form-control', 'rows' => '4']) !!}
            </div>
          </div>
        </div>
        {!! Form::submit(__('admin.save'), ['class' => 'btn btn-primary small', 'name' => 'finish']) !!}
        @endforeach
        {!! Form::close() !!}
      @endforeach
  </div>
@endsection

@section('meta')
  <meta name="csrf-token" content="{{ csrf_token() }}" />
@endsection

<a href="#" class="link link--delete" data-toggle="modal" data-target="#confirm-delete"></i> {{ __('admin.delete') }}</a> {{ __('admin.this') }} {{ str_singular($model_name) }}
{!! Form::model($model, ['route' => ['admin.'.$model_name.'.destroy', $model->id], 'method' => 'post', 'class' => 'form-horizontal', 'name' => 'delete-form']) !!}
  {{ Form::hidden('_method', 'DELETE') }}
  <div class="modal fade" id="confirm-delete" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" id="myModalLabel">{{ __('admin.are_you_sure') }}</h4>
          <div class="modal-btn">
            <button type="button" class="btn btn-cancel btn-xs" data-dismiss="modal">{{ __('admin.cancel') }}</button>
            <button type="button" class="btn btn-primary btn-xs" onclick="document.forms['delete-form'].submit();">{{ __('admin.delete') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
{{ Form::close() }}

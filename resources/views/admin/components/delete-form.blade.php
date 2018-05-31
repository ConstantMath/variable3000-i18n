<a href="#" class="link link--delete" data-toggle="modal" data-target="#confirm-delete"></i> delete</a>
{!! Form::model($model, ['route' => ['admin.'.$model_name.'.destroy', $model->id], 'method' => 'post', 'class' => 'form-horizontal', 'name' => 'delete-form']) !!}
  {{ Form::hidden('_method', 'DELETE') }}
  <div class="modal fade" id="confirm-delete" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" id="myModalLabel">Are you sure ?</h4>
          <div class="modal-btn">
            <button type="button" class="btn btn-default btn-xs" data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary btn-xs" onclick="document.forms['delete-form'].submit();">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
{{ Form::close() }}

{{-- Submit buttons --}}
<div class="submit panel-action btn-container">
  {!! Form::submit(__('admin.save'), ['class' => 'btn btn-primary', 'name' => 'save']) !!}
  {!! Form::submit(__('admin.saveclose'), ['class' => 'btn btn-default', 'name' => 'finish']) !!}
</div>

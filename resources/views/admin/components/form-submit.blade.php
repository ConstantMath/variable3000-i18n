{{-- Submit buttons --}}
<div class="submit panel-action btn-container">
  {!! Form::submit('Save', ['class' => 'btn btn-primary', 'name' => 'save']) !!}
  @if(isset($article->id))
  {!! Form::submit('Save & close', ['class' => 'btn btn-default', 'name' => 'finish']) !!}
  @endif
</div>

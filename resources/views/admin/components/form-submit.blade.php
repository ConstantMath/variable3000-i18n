{{-- Submit buttons --}}
<div class="submit panel-action btn-container">
  {!! Form::submit('save', ['class' => 'btn btn-primary', 'name' => 'save']) !!}
  @if(isset($article->id))
  {!! Form::submit('save & close', ['class' => 'btn btn-primary', 'name' => 'finish']) !!}
  @endif
</div>

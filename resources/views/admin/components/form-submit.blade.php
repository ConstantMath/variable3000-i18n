{{-- Submit buttons --}}
<div class="submit btn-container">
  {!! Form::submit('save', ['class' => 'btn btn-default', 'name' => 'save']) !!}
  @if(isset($article->id))
  {!! Form::submit('save & close', ['class' => 'btn btn-primary', 'name' => 'finish']) !!}
  @endif
</div>

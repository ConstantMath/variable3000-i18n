{{-- Submit buttons --}}
<div class="submit">
  {!! Form::submit('save', ['class' => 'btn btn-invert', 'name' => 'save']) !!}
  @if(isset($article->id))
  {!! Form::submit('save & close', ['class' => 'btn btn-primary', 'name' => 'finish']) !!}
  @endif
</div>

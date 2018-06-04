@extends('admin.app')
@section('page_class', 'reset_mail')
@section('content')

@if (session('status'))
    <div class="alert alert-success">
        {{ session('status') }}
    </div>
@endif
<div class="panel panel-default">
  <form class="form-horizontal" role="form" method="POST" action="{{ route('password.email') }}">
      {{ csrf_field() }}
      <div class="form__content">
        <div class="form__body">
          <div class="form-group{{ $errors->has('email') ? ' has-error' : '' }}">

              <input id="email" type="email" class="form-control" name="email" value="{{ old('email') }}" required placeholder="Email">

              @if ($errors->has('email'))
                  <span class="help-block">
                      <strong>{{ $errors->first('email') }}</strong>
                  </span>
              @endif
          </div>
        </div>
      </div>
    <button type="submit" class="btn btn-primary">
        Send Password Reset Link
    </button>
  </form>
</div>


@endsection

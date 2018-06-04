@extends('admin.app')

@section('page_class', 'login')

@section('content')
<div class="form__container panel panel-default ">
  <form class="form-horizontal" role="form" method="POST" action="{{ route('login') }}">
    {{ csrf_field() }}
    <div class="form__content">
      <div class="login__body form__body">
        <div class="form-group">
          <input id="email" type="email" class="form-control" name="email" value="{{ old('email') }}" required autofocus placeholder="Email">
        </div>
          @if ($errors->has('email'))
            <span class="help-block">
              <strong>{{ $errors->first('email') }}</strong>
            </span>
          @endif
        <div class="form-group">
          <input id="password" type="password" class="form-control" name="password" required placeholder="Password">
        </div>
          @if ($errors->has('password'))
            <span class="help-block"><strong>{{ $errors->first('password') }}</strong></span>
          @endif
      </div>
    </div>
    <div class="login__footer">
      <button type="submit" class="btn btn-primary">Login</button>
    </div>
  </form>
  <div class="panel-footer">
    <a class="link" href="{{ route('password.request') }}">Forgot password ?</a>
  </div>
</div>
<div id="fantom" class="fantom"></div>
@endsection
{{-- Movement  --}}
{{-- http://jsfiddle.net/denisenepraunig/XEZEq/ --}}

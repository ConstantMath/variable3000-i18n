@extends('admin.app')

@section('page_class', 'login')

@section('content')
<div class="form__container panel panel-default ">
  <header class="login__header">
    <h2 class="login__title">admin variable</h2>
  </header>
  <form class="form-horizontal" role="form" method="POST" action="{{ route('login') }}">
    {{ csrf_field() }}
    <div class="form__content panel-body">
      <div class="login__body form__body">
        <div class="form-group">
          <label for="email" class="control-label">E-Mail Address</label>
          <input id="email" type="email" class="form-control" name="email" value="{{ old('email') }}" required autofocus placeholder="Email">
        </div>
          @if ($errors->has('email'))
            <span class="help-block">
              <strong>{{ $errors->first('email') }}</strong>
            </span>
          @endif
        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" type="password" class="form-control" name="password" required placeholder="Password">
        </div>
          @if ($errors->has('password'))
            <span class="help-block"><strong>{{ $errors->first('password') }}</strong></span>
          @endif
        <div class="form-group remember">
          <label>
            <input type="checkbox" name="remember" checked > Remember Me
          </label>
          <a class="" href="{{ route('password.request') }}">Forgot password ?</a>
        </div>
      </div>
    </div>
    <div class="login__footer">
      <button type="submit" class="btn btn-primary">Login</button>
    </div>
  </form>
</div>
<div id="fantom" class="fantom"></div>
@endsection
{{-- Movement  --}}
{{-- http://jsfiddle.net/denisenepraunig/XEZEq/ --}}

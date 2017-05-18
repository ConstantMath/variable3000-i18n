@extends('admin.app')

@section('page_class', 'login')

@section('content')
<div class="login__container">
  <form class="form-horizontal" role="form" method="POST" action="{{ route('login') }}">
    {{ csrf_field() }}
    <header class="login__header">
      <h2 class="login__title">Variable 3000</h2>
    </header>
    <div class="login__body">
        <label for="email" class="col-md-4 control-label">E-Mail Address</label>
        <input id="email" type="email" class="form-control" name="email" value="{{ old('email') }}" required autofocus placeholder="Email">
        @if ($errors->has('email'))
          <span class="help-block">
            <strong>{{ $errors->first('email') }}</strong>
          </span>
        @endif
        <label for="password">Password</label>
        <input id="password" type="password" class="form-control" name="password" required placeholder="Password">
        @if ($errors->has('password'))
          <span class="help-block"><strong>{{ $errors->first('password') }}</strong></span>
        @endif
      <label class="remember">
        <input type="checkbox" name="remember" checked > Remember Me
      </label>
      <div class="row login__footer">
        <div class="col-md-6 login__password">
          <a class="" href="{{ route('password.request') }}">Forgot password ?</a>
        </div>
        <div class="col-md-6 login__btn">
          <button type="submit" class="btn btn-invert">Login</button>
        </div>
      </div>
    </div>
  </form>
</div>
<div id="oizo" class="oizo"></div>
@endsection

@extends('admin.app')

@section('page_class', 'login')

@section('content')
<div class="form__container">
  <form class="form-horizontal" role="form" method="POST" action="{{ route('login') }}">
    {{ csrf_field() }}
    <div class="login__body form__body">
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
    </div>
      <label class="remember">
        <input type="checkbox" name="remember" checked > Remember Me
      </label>
      <div class="login__btn">
        <button type="submit" class="btn btn-invert">Login</button>
      </div>
      <div class="login__password">
        <a class="" href="{{ route('password.request') }}">Forgot password ?</a>
      </div>
    
  </form>
</div>
<div id="fantom" class="fantom"></div>
@endsection
{{-- Movement  --}}
{{-- http://jsfiddle.net/denisenepraunig/XEZEq/ --}}

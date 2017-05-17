@extends('admin.app')
@section('page_class', 'reset_mail')
@section('content')


  <div class="panel panel-default">
    <header class="login__header">
      <h2 class="login__title">Reset Password</h2>
    </header>
      <div class="panel-body login__body">
          @if (session('status'))
              <div class="alert alert-success">
                  {{ session('status') }}
              </div>
          @endif

          <form class="form-horizontal" role="form" method="POST" action="{{ route('password.email') }}">
              {{ csrf_field() }}

              <div class="form-group{{ $errors->has('email') ? ' has-error' : '' }}">
                  <label for="email" class="col-md-4 control-label">E-Mail Address</label>

                  <input id="email" type="email" class="form-control" name="email" value="{{ old('email') }}" required placeholder="Email">

                  @if ($errors->has('email'))
                      <span class="help-block">
                          <strong>{{ $errors->first('email') }}</strong>
                      </span>
                  @endif
              </div>

              <div class="form-group login__footer">
                <button type="submit" class="btn btn-invert">
                    Send Password Reset Link
                </button>
              </div>
          </form>
      </div>
  </div>


@endsection

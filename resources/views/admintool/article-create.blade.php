@extends('admintool.layouts.main')
@section('content')
    <div class="col-sm-offset-4 col-sm-4">
		<div class="panel panel-primary">
			<div class="panel-heading">Modifier</div>
			<div class="panel-body">
				<div class="col-sm-12">
					{!! Form::open(['url' => 'articles','class' => 'form-horizontal panel']) !!}
            @include('admintool.article-form', ['submitButtonText' => 'Save'])
					{!! Form::close() !!}
				</div>
			</div>
		</div>
	</div>
@endsection

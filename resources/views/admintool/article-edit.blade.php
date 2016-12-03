@extends('admintool.layouts.main')
@section('content')
    <div class="col-sm-offset-4 col-sm-4">
		<div class="panel panel-primary">
			<div class="panel-heading">Modifier</div>
			<div class="panel-body">
				<div class="col-sm-12">
					{!! Form::model($article, ['route' => ['articles.update', $article->id], 'method' => 'put', 'class' => 'form-horizontal panel']) !!}
           @include('admintool.article-form')
					{!! Form::close() !!}
				</div>
			</div>
		</div>
		<a href="javascript:history.back()" class="btn btn-primary">
			<span class="glyphicon glyphicon-circle-arrow-left"></span> Retour
		</a>
	</div>
@endsection

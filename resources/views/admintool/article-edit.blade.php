@extends('admintool.layouts.main')
@section('content')
    <div class="col-sm-offset-4 col-sm-4">
		<div class="panel panel-primary">
			<div class="panel-heading">Modifier</div>
			<div class="panel-body">
				<div class="col-sm-12">
					{!! Form::model($article, ['route' => ['articles.update', $article->id], 'method' => 'put', 'class' => 'form-horizontal panel']) !!}
          <div class="form-group">
						<div class="checkbox">
							<label>
								{!! Form::checkbox('published', 1, null) !!}Published ?
							</label>
						</div>
					</div>
					<div class="form-group {!! $errors->has('name') ? 'has-error' : '' !!}">
				  	{!! Form::text('title', null, ['class' => 'form-control', 'placeholder' => 'Nom']) !!}
				  	{!! $errors->first('title', '<small class="help-block">:message</small>') !!}
					</div>
          <div class="form-group {!! $errors->has('name') ? 'has-error' : '' !!}">
				  	{!! Form::textarea('description', null, ['class' => 'form-control', 'placeholder' => 'Description']) !!}
				  	{!! $errors->first('description', '<small class="help-block">:message</small>') !!}
					</div>
					{!! Form::submit('Envoyer', ['class' => 'btn btn-primary pull-right']) !!}
					{!! Form::close() !!}
				</div>
			</div>
		</div>
		<a href="javascript:history.back()" class="btn btn-primary">
			<span class="glyphicon glyphicon-circle-arrow-left"></span> Retour
		</a>
	</div>
@endsection

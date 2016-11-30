@extends('admintool.layouts.main')

@section('content')
<div class="container">
    <div class="row">
      <div class="col-sm-offset-4 col-sm-4">
      <br>
  		<div class="panel panel-primary">
  			<div class="panel-heading">Article</div>
  			<div class="panel-body">
          <p>Titre : {{ $article->title }}</p>
          <p>Description : {!! $article->description !!}</p>
  			</div>
  		</div>
  		<a href="javascript:history.back()" class="btn btn-default">
  			<span class="glyphicon glyphicon-circle-arrow-left"></span> Retour
  		</a>
  	</div>
    </div>
</div>
@endsection

@extends('admintool.layouts.main')

@section('content')
<div class="container">
  <div class="row">
    <div class="col-md-10 col-md-offset-1">
      <div class="panel panel-default">
        <div class="panel-heading">Dashboard</div>
        <div class="panel-body table-responsive">
          <table class="table">
            <caption>Index</caption>
            <thead>
              <tr>
                <th>#</th>
                <th>Nom</th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            @foreach ($articles as $article)
              <tr>
                <th scope="row published-{!! $article->published !!}">•</th>
                <td><strong>{!! $article->title !!}</strong></td>
                <td>{!! link_to_route('articles.show', 'Voir', [$article->id], ['class' => '']) !!}</td>
                <td>{!! link_to_route('articles.edit', 'Modifier', [$article->id], ['class' => '']) !!}<td>
              </tr>
            @endforeach
            </tbody>
          </table>
        </div>
      </div>
      {!! link_to_route('articles.create', 'Ajouter', [], ['class' => 'btn btn-default pull-right']) !!}
    </div>
  </div>
</div>
@endsection

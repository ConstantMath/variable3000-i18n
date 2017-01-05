@extends('admintool.layouts.main')

@section('content')
<style media="screen">

  tbody span{
    color: Tomato;
    margin-right: 10px;
  }
  th,
  td{
    width: 50%;
  }
  .published-1 span{
    color: LightGreen;
  }
  .actions a{
    display: inline-block;
    margin-left: 10px;
  }
</style>
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
                <th>Title</th>
                <th></th>
            </thead>
            <tbody>
            @foreach ($articles as $article)
              <tr class="published-{!! $article->published !!}">
                <th><span>•</span>&nbsp;<strong>{!! $article->title !!}</strong></th>
                <td class="actions">
                  {!! link_to_route('articles.show', 'Voir', [$article->id], ['class' => '']) !!}
                  {!! link_to_route('articles.edit', 'Modifier', [$article->id], ['class' => '']) !!}
                <td>
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

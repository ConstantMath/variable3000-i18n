@extends('admin.layouts.app')

@section('content')
<div class="container page-index">
  <div class="row">
    <div class="col-md-10 col-md-offset-1">
        <div class="panel panel-default">
            <div class="panel-heading">
              {{-- {{ $main_title }} --}}
            </div>
            <div class="panel-body table-responsive">
              @include('admin.partials.flash-message')
              <table class="table">
                <thead>
                  <tr>
                    <td>Titre</td>
                    <td>
                      <a href="#" class="pull-right"><i class="fa fa-plus-circle"></i> Ajouter</a>
                    </td>
                </thead>
                <tbody id="index">
                @if($articles)
                  @foreach ($articles as $article)
                    <tr class="published-{!! $article->published !!}" url="{{ URL::to('/') }}/admin/articles/{{$article->id}}/reorder" parent="">
                      <td><i class="fa fa-circle"></i>&nbsp;{!! link_to_route('admin.articles.edit', $article->title, [$article->id, $article->id], ['class' => '']) !!}</td>
                      <td class="time">{{ $article->updated_at }}</td>
                    </tr>
                  @endforeach
                @endif
                </tbody>
              </table>
            </div>
        </div>
    </div>
  </div>
</div>
@endsection

@section('meta')
<meta name="csrf-token" content="{{ csrf_token() }}" />
@endsection

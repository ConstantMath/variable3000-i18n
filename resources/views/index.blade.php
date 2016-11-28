@extends('layouts.front')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-10 col-md-offset-1">
            <div class="panel panel-default">
                <div class="panel-body">
                    Index page
                </div>

                @foreach ($articles as $article)
                    <tr>
                        <td>{!! $article->id !!}</td>
                        <td class="text-primary"><strong>{!! $article->title !!}</strong></td>
                    </tr>
                @endforeach

            </div>
        </div>
    </div>
</div>
@endsection

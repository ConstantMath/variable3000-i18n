@extends('admintool.layouts.main')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-10 col-md-offset-1">
            <div class="panel panel-default">
                <div class="panel-heading">Dashboard</div>
                <div class="panel-body">
                    You are logged in!<br>
                    <ul>
                      <li>Projects</li>
                    </ul>
                    <table>
                    @foreach ($articles as $article)
                        <tr>
                            <td>{!! $article->id !!}</td>
                            <td class="text-primary"><strong>{!! $article->title !!}</strong></td>
                        </tr>
                    @endforeach
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

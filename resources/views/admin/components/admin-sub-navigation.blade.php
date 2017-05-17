<nav class="navbar navbar-sub">
  <div class="container">

      <ul class="nav navbar-nav">
        @foreach ($parent_articles as $parent_article)
        <li><a href="{{ url('/admin/'.$parent_article->id.'/articles') }}">{{ $parent_article->title }}</a></li>
        @endforeach
      </ul>

    </div>
  </div>
</nav>

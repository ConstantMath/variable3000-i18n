<nav class="nav-secondary col-sm-3 col-md-2 sidebar">
  <ul class="nav nav-sidebar">
    <li class="nav-item">
      Content
      @if(!empty($parent_articles))
      <ul>
        @foreach ($parent_articles as $parent_article)
        <li class="nav-item"><a href="{{ url('/admin/'.$parent_article->id.'/articles') }}" class="@if($data['page_class'] == 'index-'.$parent_article->id) active @endif">{{ $parent_article->title }}</a></li>
        @endforeach
      </ul>
      @endif
    </li>
  </ul>
  <ul class="nav nav-sidebar">
    <li>
      Admin
      <ul>
        <li class="nav-item">
          <a href="{{ url('/admin/taxonomies') }}" class="@if($data['page_class'] == 'taxonomies-index' or $data['page_class'] == 'taxonomies-edit') active @endif">Categories</a>
        </li>
        <li class="nav-item">
          <a href="{{ url('/admin/users') }}" class="@if($data['page_class'] == 'users-index' or $data['page_class'] == 'users-edit') active @endif">Users</a>
        </li>
      </ul>
    </li>
  </ul>
</nav>

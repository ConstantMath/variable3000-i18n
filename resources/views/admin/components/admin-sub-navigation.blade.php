<nav class="navbar navbar-sub">
  <div class="container">
      <ul class="nav navbar-nav">
        <li><a href="{{ url('/admin/taxonomies') }}" class="@if($data['page_class'] == 'taxonomies-index' or $data['page_class'] == 'taxonomies-edit') active @endif">Categories</a></li>
        <li><a href="{{ url('/admin/users') }}" class="@if($data['page_class'] == 'users-index' or $data['page_class'] == 'users-edit') active @endif">Users</a></li>
      </ul>
    </div>
  </div>
</nav>

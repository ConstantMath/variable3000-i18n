<nav class="navbar navbar-sub">
  <div class="container">
      <ul class="nav navbar-nav">
        <li><a href="{{ url('/admin/taxonomies') }}" class="@if($data['page_class'] == 'index-taxonomies') active @endif">Categories</a></li>
        <li><a href="{{ url('/admin/users') }}" class="@if($data['page_class'] == 'index-users') active @endif">Users</a></li>
      </ul>
    </div>
  </div>
</nav>

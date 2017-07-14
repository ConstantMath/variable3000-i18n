<nav class="nav-secondary col-sm-3 col-md-2 sidebar">
  <ul class="nav nav-sidebar">
    <li class="nav-item">
      Content
      @if(!empty($parent_articles))
      <ul>
        @foreach ($parent_articles as $parent_article)
        <li class="nav-item">
          <?php $index_active = ($data['page_class'] == 'index-'.$parent_article->id) ? 'active' : ''; ?>
          {!! link_to_route('admin.index', $parent_article->title , $parent_article->id, ['class' => $index_active]) !!}
        </li>
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
          <?php $categories_active = (strpos($data['page_class'], 'taxonomies') !== false) ? 'active' : ''; ?>
          {!! link_to_route('taxonomies.index', 'Categories', '', ['class' => $categories_active] ) !!}
        </li>
        <li class="nav-item">
          <?php $users_active = (strpos($data['page_class'], 'users') !== false) ? 'active' : ''; ?>
          {!! link_to_route('users.index', 'Users', '', ['class' => $users_active] ) !!}
        </li>
      </ul>
    </li>
  </ul>
</nav>

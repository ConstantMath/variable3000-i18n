<nav class="nav-secondary col-sm-3 col-md-2 sidebar">
  <ul class="nav nav-sidebar">
    <li class="nav-item">
      Content
      <ul>
        <li>{!! link_to_route('admin.articles.index', 'Articles') !!}</li>
        <li>
          {!! link_to_route('admin.pages.index', 'Pages', 0) !!}
          @if(!empty($parent_pages))
          <ul>
            @foreach ($parent_pages as $node)
            <li class="nav-item">
              <?php $index_active = ($data['page_id'] == 'index-'.$node->id) ? 'active' : '';?>
              {!! link_to_route('admin.pages.index', $node->title , [$node->id], ['class' => $index_active]) !!}
            </li>
            @endforeach
          </ul>
          @endif
        </li>
      </ul>
    </li>
  </ul>
  <ul class="nav nav-sidebar">
    <li>
      Admin
      <ul>
        <li class="nav-item">
          <?php $categories_active = (strpos($data['page_id'], 'taxonomies') !== false) ? 'active' : ''; ?>
          {!! link_to_route('taxonomies.index', 'Categories', '', ['class' => $categories_active] ) !!}
        </li>
        <li class="nav-item">
          <?php $users_active = (strpos($data['page_id'], 'users') !== false) ? 'active' : ''; ?>
          {!! link_to_route('admin.users.index', 'Users', '', ['class' => $users_active] ) !!}
        </li>
        <li class="nav-item">
          <?php $settings_active = (strpos($data['page_id'], 'settings') !== false) ? 'active' : ''; ?>
          {!! link_to_route('admin.settings.index', 'Settings', '', ['class' => $settings_active] ) !!}
        </li>

      </ul>
    </li>
  </ul>
</nav>

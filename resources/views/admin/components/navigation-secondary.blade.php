<nav class="nav-secondary col-sm-3 col-md-2 sidebar">
  <ul class="nav nav-sidebar">
    <li class="nav-item">
      Content
      <ul>
        @can('Admin articles')
        <li>{!! link_to_route('admin.articles.index', 'Articles') !!}</li>
        @endcan
        @can('Admin pages')
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
        @endcan
      </ul>
    </li>
  </ul>
  <ul class="nav nav-sidebar">
    <li>
      Admin
      <ul>
        @can('Admin categories')
        <li class="nav-item">
          <?php $categories_active = (strpos($data['page_id'], 'taxonomies') !== false) ? 'active' : ''; ?>
          {!! link_to_route('admin.taxonomies.index', 'Categories', '', ['class' => $categories_active] ) !!}
        </li>
        @endcan

        @can('Admin users')
        <li class="nav-item">
          <?php $users_active = (strpos($data['page_id'], 'users') !== false) ? 'active' : ''; ?>
          {!! link_to_route('admin.users.index', 'Users', '', ['class' => $users_active] ) !!}
          @if(!empty($data['page_type']) && $data['page_type'] == 'users') @can('Admin roles & permissions')
          <ul>
            <li class="nav-item">
              <?php $role_active = (strpos($data['page_id'], 'roles') !== false) ? 'active' : ''; ?>
              {!! link_to_route('admin.roles.index', 'Roles', '', ['class' => $role_active] ) !!}
            </li>
            <li class="nav-item">
              <?php $permission_active = (strpos($data['page_id'], 'permissions') !== false) ? 'active' : ''; ?>
              {!! link_to_route('admin.permissions.index', 'Permissions', '', ['class' => $permission_active] ) !!}
            </li>
          </ul>
          @endcan @endif
        </li>
        @endcan
        @can('Admin settings')
        <li class="nav-item">
          <?php $settings_active = (strpos($data['page_id'], 'settings') !== false) ? 'active' : ''; ?>
          {!! link_to_route('admin.settings.index', 'Settings', '', ['class' => $settings_active] ) !!}
        </li>
        @endcan
      </ul>
    </li>
  </ul>
</nav>

<nav class="navbar navbar--fixed-top nav--primary">
    <div class="navbar__header">
      <a class="navbar__brand" href="{{ url('/admin') }}">
        <img src="{{ url('/assets/admin/images/fantom.gif') }}" alt="Admin">
      </a>
    </div>
    <div class="navbar__nav">
      <ul class="navbar__list navbar__list--left">
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
      <!-- Right Side Of Navbar -->
      <ul class="navbar__list navbar__list--right">
        {{-- <!-- Authentication Links --> --}}
        @if (Auth::guest())
          <li><a href="{{ url('/login') }}">Login</a></li>
          <li><a href="{{ url('/register') }}">Register</a></li>
        @else
          <li class="js-dropdown">
            <a href="#" class="dropdown-toggle" role="button">
              Admin&nbsp;<i class="fa fa-angle-down js-dropdown-icon"></i>
            </a>
            <ul class="js-dropdown-menu" role="menu">
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
          <li class="js-dropdown">
            <a href="#" class="dropdown-toggle" role="button">
              {{ Auth::user()->name }}&nbsp;<i class="fa fa-angle-down js-dropdown-icon"></i>
            </a>
            <ul class="js-dropdown-menu" role="menu">
              <li><a href="{{ route('logout') }}" onclick="event.preventDefault(); document.getElementById('logout-form').submit();"><i class="fa fa-btn fa-sign-out"></i>Logout</a></li>
            </ul>
          </li>
          {{-- lang dropdown --}}
          @if(count(config('translatable.locales')) > 1 )
          <li class="js-dropdown">
            <a href="#" class="dropdown-toggle" role="button">
              {{app()->getLocale()}}&nbsp;<i class="fa fa-angle-down js-dropdown-icon"></i>
            </a>
            <ul class="js-dropdown-menu" role="menu">
            @foreach (config('translatable.locales') as $lang)
              <li class="lang__item @if (app()->getLocale() ==  $lang) active @endif"><a href="{{ route('lang.switch', $lang) }}" class="lang__link">{{ $lang }}</a></li>
            @endforeach
            </ul>
          </li>
          @endif
        @endif
      </ul>
    </div>
</nav>
{{-- Logout form since Lrvl 5.3 arr This prevents other web applications from logging your users out of your application. --}}
<form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">{{ csrf_field() }}</form>

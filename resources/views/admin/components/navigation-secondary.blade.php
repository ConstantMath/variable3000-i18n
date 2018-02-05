<nav class="nav-secondary col-sm-3 col-md-2 sidebar">
  <ul class="nav nav-sidebar">
    <li class="nav-item">
      Content

      <ul>

        {{-- @if(!empty($parent_articles)) --}}
        {{-- @foreach ($parent_articles as $parent_article) --}}
        {{-- <li class="nav-item"> --}}
          <?php /*$index_active = ($data['page_id'] == 'index-'.$parent_article->id) ? 'active' : '';*/ ?>
          {{-- {!! link_to_route('admin.index', $parent_article->title , $parent_article->id, ['class' => $index_active]) !!} --}}
        {{-- </li> --}}
        {{-- @endforeach --}}
        {{-- @endif --}}
        <li>{!! link_to_route('admin.articles.index', 'Articles') !!}</li>
        <li>{!! link_to_route('admin.pages.index', 'Pages') !!}</li>
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
          {!! link_to_route('users.index', 'Users', '', ['class' => $users_active] ) !!}
        </li>

      </ul>
    </li>
  </ul>
</nav>

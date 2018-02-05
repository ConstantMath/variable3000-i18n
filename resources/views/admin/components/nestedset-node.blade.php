<li>
  <div class="dd-content @if($node->parent_id == null) root @endif">
    {!! link_to_route('admin.pages.edit', $node->title, $node->id) !!}
  </div>
  <ol class="dd-list">
    @foreach($node->children as $child)
      @include('admin.components.nestedset-node', ['node' => $child])
    @endforeach
  </ol>
</li>

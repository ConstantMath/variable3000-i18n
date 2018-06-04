@extends('admin.app')

@section('page_title', $data['page_title'])
@section('page_class', $data['page_class'])


@section('content')
  {{-- @if($taxonomies) @foreach ($taxonomies as $taxonomy)
  <div class="panel panel-default panel-index">
    <div class="panel-heading">
      <h3>{{ $taxonomy->name }}</h3>
      <a href="{{ route('admin.taxonomies.create', $taxonomy->id) }}" class="pull-right"><i class="fa fa-plus-circle"></i> Add</a>
    </div>
    <div class="panel-body table-responsive">
      <table class="table">
        <tbody id="index" class="sortable">
          @if($taxonomy->children)
            @foreach ($taxonomy->children as $child)
          <tr url="{{ route('admin.taxonomies.reorder', $child->id) }}" parent_id="{{$child->parent_id}}">
            <td><i class="fa fa-tag" aria-hidden="true"></i> {!! link_to_route('admin.taxonomies.edit', $child->name, $child->id, ['class' => '']) !!}</td>
          </tr>
          @endforeach @endif
        </tbody>
      </table>
    </div>
  </div> --}}
  @if($taxonomies) @foreach ($taxonomies as $taxonomy)
  <div class="panel panel-default">
    <div class="table-responsive">
      <a href="{{ route('admin.taxonomies.create', $taxonomy->id) }}" class="btn btn-primary btn-xs"> Add</a>

      <table class="panel-body table table-hover table-bordered table-striped" style="width:100%">
          <thead>
            <tr>
              <th>{{ $taxonomy->name }}</th>
              <th>Updated</th>
              <th></th>
            </tr>
          </thead>
      </table>
    </div>
  </div>
  @endforeach @endif
@endsection

@section('meta')
<meta name="csrf-token" content="{{ csrf_token() }}" />
@endsection

@section('scripts')
<script src="https://cdn.datatables.net/1.10.12/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/rowreorder/1.2.3/js/dataTables.rowReorder.min.js"></script>
<script type="text/javascript">
$(document).ready(function() {
    var table = $('.table').DataTable({
      responsive: true,
      processing: true,
      serverSide: true,
      rowReorder: false,
      colReorder: false,
      "paging":   false,
      dom       : '<"panel-heading"f> <"panel-body"t> <"panel-footer"<li>p>',
      ajax: '{{ route('admin.' .$data['table_type']. '.getdata') }}',
      language: {
        "search": '',
        searchPlaceholder: "Search",
        "paginate": {
          "previous": '&larr;',
          "next": '&rarr;'
        },
      },
      columns: [
        {data: 'name', name: 'name', orderable: false, width: '60%'},
        {data: 'updated_at', name: 'title', searchable: false, orderable: false},
        {data: 'action', name: 'action', orderable: false, searchable: false, class:'faded'}
      ]
    });

    $.fn.dataTable.ext.errMode = 'throw';
});
</script>
@endsection

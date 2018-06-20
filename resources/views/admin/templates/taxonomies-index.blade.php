@extends('admin.app')

@section('page_title', $data['page_title'])
@section('page_class', $data['page_class'])


@section('content')
  @if($taxonomies) @foreach ($taxonomies as $taxonomy)
  <div class="panel panel-default">
    <div class="table-responsive">
      @include('admin.components.datatable-loading')
      <a href="{{ route('admin.taxonomies.create', $taxonomy->id) }}" class="btn btn-primary btn-xs"> Add</a>
      <table class="panel-body table table-hover table-bordered table-striped table-reorderable" style="width:100%" id="datatable-{{$taxonomy->id}}">
        <thead class="hidden">
          <tr>
            <th>{{ $taxonomy->name }}</th>
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
    @if($taxonomies) @foreach ($taxonomies as $taxonomy)
      var table_{{$taxonomy->id}} = $('#datatable-{{$taxonomy->id}}').DataTable({
        'responsive': false,
        'processing': true,
        'serverSide': true,
        'rowReorder': {
            selector: '.reorder'
        },
        'colReorder': false,
        'paging':   false,
        'dom'       : '<"panel-heading"f> <"panel-body"t> <"panel-footer">',
        'initComplete': function(settings, json) {
            $('#datatable-{{$taxonomy->id}}_wrapper').siblings('.datatable-loading').hide();
          },
        'ajax': {
          'url': '{{ route('admin.' .$data['table_type']. '.getdata') }}',
          'data': function ( d ) {
              d.parent_id = {{$taxonomy->id}};
          }
        },
        language: {
          'search': '',
          'searchPlaceholder': '{{ $taxonomy->name }}',
          'paginate': {
            'previous': '&larr;',
            'next': '&rarr;'
          },
          lengthMenu: "{{__('admin.datatable_lengthMenu')}}",
          zeroRecords: "{{__('admin.datatable_zeroRecords')}}",
          info: "{{__('admin.datatable_info')}}",
        },
        columns: [
          {data: 'name', render: function ( data, type, row, meta ) {
            return '<div class="text-content">'+ data + '</div>';
          }, name: 'name', orderable: false, class: 'main-column'},
          {data: 'action', render: function ( data, type, row, meta ) {
            return data + '<i class="fa fa-sort reorder"></i>';
          }, name: 'action', orderable: false, searchable: false, class:'faded'}
        ]
      });

      $.fn.dataTable.ext.errMode = 'throw';

      table_{{$taxonomy->id}}.on( 'row-reorder', function ( e, diff, edit ) {
        var articlesArray = [];
        for ( var i=0, ien=diff.length ; i<ien ; i++ ) {

          var rowData = table_{{$taxonomy->id}}.row( diff[i].node ).data();
          var newOrder = diff[i].newPosition;
          articlesArray.push({
            id: rowData.id,
            position: newOrder
          });
        }
        var jsonString = JSON.stringify(articlesArray);
        $.ajax({
          url     : '{{ route('admin.reorder', ['table_type' => $data['table_type']]) }}',
          type    : 'POST',
          data    : jsonString,
          dataType: 'json',
          success : function ( json ) {
            $('#datatable-{{$taxonomy->id}}').DataTable().ajax.reload(); // refresh datatable
              $.each(json, function (key, msg) {
              // handle json response
            });
          }
        });
      });
      $.fn.dataTable.ext.errMode = 'throw';
    @endforeach @endif
});
</script>
@endsection

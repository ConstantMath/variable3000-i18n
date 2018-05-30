@extends('admin.app')

@section('page_title', $data['page_title'])
@section('page_class', $data['page_class'])

@section('content')
<div class="panel panel-default">
  <div class="table-responsive">
    <a href="{{ route('admin.articles.create') }}" class="pull-right"> Add</a>

    <table class="panel-body table table-hover table-bordered table-striped" id="datatable" style="width:100%">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Updated</th>
            <th><a href="{{ route('admin.articles.create') }}" class="btn btn-primary btn-xs">Add</a></th>
          </tr>
        </thead>
    </table>
  </div>
</div>
@endsection

@section('meta')
<meta name="csrf-token" content="{{ csrf_token() }}" />
@endsection

@section('scripts')
<link href="https://cdn.datatables.net/rowreorder/1.2.3/css/rowReorder.dataTables.min.css" rel="stylesheet">
<script src="https://cdn.datatables.net/1.10.12/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/rowreorder/1.2.3/js/dataTables.rowReorder.min.js"></script>
<script type="text/javascript">
$(document).ready(function() {
    var table = $('#datatable').DataTable({
      responsive: true,
      processing: true,
      serverSide: true,
      rowReorder: true,
      colReorder: false,
        dom       : '<"search"f> <"panel-body"t> <"panel-footer"lip>',
        ajax: '{{ route('admin.' .$data['table_type']. '.getdata') }}',
        columns: [
          {data: 'order', name: 'order', searchable: false, width: '5%'},
          {data: 'title', name: 'title', orderable: false, width: '70%'},
          {data: 'updated_at', name: 'title', searchable: false, orderable: false},
          {data: 'action', name: 'action', orderable: false, searchable: false, class:'faded'}
        ]
    });

    table.on( 'row-reorder', function ( e, diff, edit ) {
      var articlesArray = [];
      for ( var i=0, ien=diff.length ; i<ien ; i++ ) {

        var rowData = table.row( diff[i].node ).data();
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
          $('#datatable').DataTable().ajax.reload(); // refresh datatable
            $.each(json, function (key, msg) {
        	  // handle json response
          });
        }
      });
    });

});
</script>
@endsection

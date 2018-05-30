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
              <th>Id</th>
              <th>Order</th>
              <th>Title</th>
              <th>Updated</th>
              <th></th>
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
        order: [ [1, 'asc'] ],
        ajax: '{{ route('admin.articles.getdata') }}',
        columns: [
          {data: 'id', name: 'id', searchable: false},
          {data: 'order', name: 'order', searchable: false},
          {data: 'title', name: 'title'},
          {data: 'updated_at', name: 'title', searchable: false},
          {data: 'action', name: 'action', orderable: false, searchable: false}
        ]
    });

    table.on( 'row-reorder', function ( e, diff, edit ) {
      var myArray = [];
      for ( var i=0, ien=diff.length ; i<ien ; i++ ) {

        var rowData = table.row( diff[i].node ).data();
        var newOrder = diff[i].newPosition;
        myArray.push({
          id: rowData.id,
          position: newOrder
        });
      }
      var jsonString = JSON.stringify(myArray);
      console.log(myArray);
      $.ajax({
        url     : '{{ URL::to('myurl/reorder') }}',
        type    : 'POST',
        data    : jsonString,
        dataType: 'json',
        success : function ( json ) {
          $('#dataTableBuilder').DataTable().ajax.reload(); // refresh datatable
            $.each(json, function (key, msg) {
        	  // handle json response
          });
        }
      });
    });

});
</script>
@endsection

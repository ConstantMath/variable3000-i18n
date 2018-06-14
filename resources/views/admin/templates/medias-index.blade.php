@extends('admin.app')

@section('page_title', $data['page_title'])
@section('page_class', $data['page_class'])

@section('content')
<div class="panel panel-default">
  <div class="table-responsive">
    @include('admin.components.datatable-loading')
    <a href="{{ route('admin.medias.create') }}" class="btn btn-primary btn-xs"> Add</a>
    <table class="panel-body table table-hover table-bordered table-striped" id="datatable" style="width:100%">
        <thead class="hidden">
          <tr>
            <th class="media-preview"></th>
            <th class="main-column">Name</th>
            <th class="hidden-small">Dimensions</th>
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
<script src="https://cdn.datatables.net/1.10.12/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/rowreorder/1.2.3/js/dataTables.rowReorder.min.js"></script>
<script type="text/javascript">
$(document).ready(function() {
    var table = $('#datatable').DataTable({
      responsive: true,
      autoWidth: false,
      processing: true,
      serverSide: true,
      rowReorder: false,
      colReorder: false,
      dom       : '<"panel-heading"f> <"panel-body"t> <"panel-footer"<li>p>',
      initComplete: function(settings, json) {
          $('.datatable-loading').hide();
        },
      ajax: '{{ route('admin.' .$data['table_type']. '.getdata') }}',
      language: {
        "search": '',
        searchPlaceholder: "Medias",
        "paginate": {
          "previous": '&larr;',
          "next": '&rarr;'
        },
      },
      columns: [
        {data: 'img', render: function ( data, type, row, meta ) {
          if(row.mime_type.includes("image", 0)){
            return '<img src="'+ data +'">';
          }else if(row.mime_type.includes("pdf", 0)){
            return '<div><span>PDF</span></div>';
          }else if(row.mime_type.includes("video", 0)){
            return '<div><span>VIDEO</span></div>';
          }else{
            return '<div><span>FILE</span></div>';
          }
        }, class: 'media-preview'},
        {data: 'name', render: function ( data, type, row, meta ) {
          return '<div class="text-content">'+ data + '</div>';
        }, name: 'name', orderable: false, class: 'main-column'},
        {data: 'custom_properties', render: function ( data, type, row, meta ) { if(data.width){return data.width +' &times; '+ data.height}else{return null}}, name: 'custom_properties', orderable: false, class: 'hidden-small'},
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
    $.fn.dataTable.ext.errMode = 'throw';

});
</script>
@endsection

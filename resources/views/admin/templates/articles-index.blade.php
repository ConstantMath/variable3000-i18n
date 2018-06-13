@extends('admin.app')

@section('page_title', $data['page_title'])
@section('page_class', $data['page_class'])

@section('content')
<div class="panel panel-default">
  <div class="table-responsive">
    <a href="{{ route('admin.articles.create') }}" class="btn btn-primary btn-xs"> Add</a>
    <table class="panel-body table table-hover table-bordered table-striped table-reorderable" id="datatable" style="width:100%">
        <thead>
          <tr>
            <th class="is-published"></th>
            <th class="main-column">Title</th>
            <th class="hidden-small">Updated</th>
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
      rowReorder: true,
      colReorder: false,
      dom       : '<"panel-heading"f> <"panel-body"t> <"panel-footer"<li>p>',
      ajax: '{{ route('admin.' .$data['table_type']. '.getdata') }}',
      language: {
        "search": '',
        searchPlaceholder: "Articles",
        "paginate": {
          "previous": '&larr;',
          "next": '&rarr;'
        },
      },
      columns: [
        //IDEA: Ajouter column de contenu cachée pour recherche (texte d'article ect)?
        {data: 'order', render: function ( data, type, row, meta ) {
          if(row.published == 1){
            return '<i class="fa fa-circle icon-published"></i>';
          }else {
            return '<i class="fa fa-circle-o icon-published"></i>';
          }
        }, name: 'order', searchable: false, class: 'is-published'},
        {data: 'title', render: function ( data, type, row, meta ) {
          return '<div class="text-content">'+ data + '</div>';
        }, name: 'title', orderable: false, class: 'main-column'},
        {data: 'updated_at', render: function ( data, type, row, meta ) {
          return '<div class="text-content">'+ data + '</div>';
        }, name: 'updated_at', searchable: false, orderable: false, class: 'hidden-small'},
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

@extends('admin.app')

@section('page_title', $data['page_title'])
@section('page_class', $data['page_class'])

@section('content')
  <div class="panel panel-default">
    <div class="table-responsive">
      @include('admin.components.datatable-loading')
      <a href="{{ route('admin.users.create') }}" class="btn btn-primary btn-xs">{{__('admin.add')}}</a>
      <table class="panel-body table table-hover table-bordered table-striped" id="datatable" style="width:100%">
          <thead class="hidden">
            <tr>
              <th>Name</th>
              <th>Email</th>
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
        searchPlaceholder: "Users",
        "paginate": {
          "previous": '&larr;',
          "next": '&rarr;'
        },
      },
      columns: [
        {data: 'name', name: 'name', orderable: false, class:'main-column'},
        {data: 'email', render: function ( data, type, row, meta ) {
          return '<div class="text-content">'+ data + '</div>';
        }, name: 'email', searchable: false, orderable: false},
        {data: 'action', name: 'action', orderable: false, searchable: false, class:'faded'}
      ]
    });

    $.fn.dataTable.ext.errMode = 'throw';

});
</script>
@endsection

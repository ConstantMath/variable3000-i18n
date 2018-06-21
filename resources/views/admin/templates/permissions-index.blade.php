@extends('admin.app')

@section('page_title', $data['page_title'])
@section('page_class', $data['page_class'])

@section('content')
  <div class="panel panel-default">
    <div class="table-responsive">
      <a href="{{ route('admin.permissions.create') }}" class="btn btn-primary btn-xs">{{__('admin.add')}}</a>
      <table class="panel-body table table-hover table-bordered table-striped" style="width:100%" id="datatable">
        <thead>
          <tr>
            <th>Permissions</th>
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
      paging:   false,
      dom       : '<"panel-heading"f> <"panel-body"t> <"panel-footer"<li>p>',
      ajax: '{{ route('admin.' .$data['table_type']. '.getdata') }}',
      language: {
        "search": '',
        searchPlaceholder: "Permissions",
        "paginate": {
          "previous": '&larr;',
          "next": '&rarr;'
        },
        lengthMenu: "{{__('admin.datatable_lengthMenu')}}",
        zeroRecords: "{{__('admin.datatable_zeroRecords')}}",
        info: "{{__('admin.datatable_info')}}",
      },
      columns: [
        {data: 'name', name: 'name', orderable: false, width: '60%'},
        {data: 'action', name: 'action', orderable: false, searchable: false, class:'faded'}
      ]
    });
    $.fn.dataTable.ext.errMode = 'throw';

});
</script>
@endsection

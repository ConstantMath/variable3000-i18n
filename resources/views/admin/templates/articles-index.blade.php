@extends('admin.app')

@section('page_title', $data['page_title'])
@section('page_class', $data['page_class'])

@section('content')
  <div class="panel panel-default">
    <div class="panel-body table-responsive">
      <table class="table table-hover table-bordered table-striped datatable" style="width:100%">
          <thead>
            <tr>
              <th>Id</th>
              <th>Title</th>
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
<script type="text/javascript">
$(document).ready(function() {
    $('.datatable').DataTable({
        responsive: true,
        processing: true,
        serverSide: true,
        ajax: '{{ route('admin.datatable/getdata') }}',
        columns: [
            {data: 'id', name: 'id'},
            {data: 'title', name: 'title'},
        ]
    });
});
</script>
@endsection

{!! Form::model($article, ['route' => ['admin.articles.destroy', $article->id], 'method' => 'post', 'class' => 'form-horizontal', 'name' => 'delete-form']) !!}
  {{ Form::hidden('_method', 'DELETE') }}
  <input type="button" name="btn" value="Delete this article" id="submitBtn" data-toggle="modal" data-target="#confirm-submit" class="btn btn-default" />
  <div class="modal fade" id="confirm-submit" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title" id="myModalLabel">Are you sure ?</h4>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" onclick="document.forms['delete-form'].submit();">Delete</button>
        </div>
      </div>
    </div>
  </div>
{{ Form::close() }}

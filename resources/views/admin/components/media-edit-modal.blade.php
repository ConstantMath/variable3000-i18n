<div class="modal fade" id="modal-media-edit" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      {!! Form::model($article,
        ['route' => ['admin.medias.update', $article->getTable()],
        'method' => 'post',
        'class' => 'form-horizontal media-edit-form',
        'name' => 'media-edit-form',
        'enctype' => 'multipart/form-data']) !!}
        {!! Form::hidden('media_id', '', ['id' => 'input_media_id'])
      !!}
        <div class="modal-header">
          <h4 class"modal-title">Edit media</h4>
          <div class="modal-btn">
            <button type="button" class="btn btn-default btn-xs" data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary btn-xs media-edit-save" data-dismiss="modal">Save</button>
          </div>
        </div>
        <div class="modal-body">
          <div class="modal-media">
            <img src="" id="pic">
            <video width="320" height="240" controls id="vid">
              <source src="" type="video/mp4">
            </video>
          </div>
          <div class="modal-desc">
            <div class="form-group">
              <label for="alt">Title</label>
              <input class="form-control" name="alt" type="text" value="" id="input_media_alt">
            </div>
            <div class="form-group">
              <label for="description">Description</label>
              <textarea class="form-control" placeholder="Intro" rows="5" name="description" id="input_media_description"></textarea>
            </div>
          </div>
        </div>
      {{ Form::close() }}
    </div>
  </div>
</div>

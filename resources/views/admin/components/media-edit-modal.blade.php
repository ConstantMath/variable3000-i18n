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
        <div class="modal-body">
          <div class="modal-media">
            <figure><img src="" id="pic"></figure>
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
        <div class="modal-footer">
          <a href="#" class="media-delete btn btn-tr" data-dismiss="modal" media_type="" media_id=""> delete</a>
          <div class="btn-container">
            <button type="button" class="btn btn-primary media-edit-save" data-dismiss="modal">Save</button>
            <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
          </div>
        </div>
      {{ Form::close() }}
    </div>
  </div>
</div>

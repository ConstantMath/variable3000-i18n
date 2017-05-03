  <div class="modal fade" id="modal-media-edit" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        {!! Form::model($article, ['route' => ['admin.medias.update'], 'method' => 'post', 'class' => 'form-horizontal media-edit-form', 'name' => 'media-edit-form']) !!}
          {!! Form::hidden('media_id', '', ['id' => 'input_media_id']) !!}
          <div class="modal-body">
            <div class="container-fluid">
              <div class="row">
                <div class="col-md-6">
                  <figure><img src="" id="pic"></figure>
                </div>
                <div class="col-md-6">
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
            </div>
          </div>
          <div class="modal-footer">
            <a href="#" class="media-delete btn" data-dismiss="modal" column_name="" media_id=""><i class="fa fa-trash"></i> delete</a>
            <div class="pull-right">
              <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary media-edit-save" data-dismiss="modal">Save</button>
            </div>
          </div>
        {{ Form::close() }}
      </div>
    </div>
  </div>

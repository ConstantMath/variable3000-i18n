<?php

namespace App\Http\Controllers\Admin;
use Validator;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\DB;
use Spatie\MediaLibrary\HasMedia\HasMediaTrait;
use Spatie\MediaLibrary\HasMedia\HasMedia;
use Spatie\MediaLibrary\Helpers\File;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\Admin\MediaRequest;
use App\Article;
use App\Media;

class MediasController extends AdminMediasController {

  use HasMediaTrait;

  public function __construct(){
    $this->table_type = 'medias';
    $this->middleware(['auth', 'permissions'])->except('index');
    parent::__construct();
  }


  /**
   * List all medias by parent
   *
   * @return \Illuminate\Http\Response
   */

  public function index(){
    $data = array(
      'page_class' => 'medias',
      'page_title' => 'Medias',
      'page_id'    => 'index-medias',
      'table_type' => $this->table_type,
    );
    $medias = Media::all();
    return view('admin/templates/medias-index', compact('medias', 'data'));
  }


  /**
  * Get articles for datatables (ajax)
  *
  * @return \Illuminate\Http\Response
  */

  public function getDataTable(){
    return \DataTables::of(Media::get())
                        ->addColumn('img', function ($article) {
                          return '/imagecache/thumb/' . $article->id . '/' . $article->file_name;
                        })
                        ->addColumn('action', function ($article) {
                          return '<a href="' . route('admin.medias.edit', $article->id) . '" class="link">Edit</a>';
                        })
                        ->make(true);
  }


  /**
  * Show the form for editing the specified resource.
  *
  * @param  int  $id
  * @return \Illuminate\Http\Response
  */

  public function edit($id){
    $media = Media::findOrFail($id);
    $data = array(
      'page_class' => 'media',
      'page_title' => 'Media edit',
      'page_id'    => 'edit',
    );
    // Dropdown: Loop through models that has medias
    $media_models = config('admin.media_models');
    if($media_models){
      foreach($media_models as $model){
        $model_name = str_plural(str_replace('App\\','', $model));
        $articles[$model_name] = $model::all()->pluck('title', 'model_title')->toArray();
      }
    }
    $articles = Article::listAll();
    return view('admin/templates/medias-edit',  compact('media', 'data', 'articles'));
  }


  /**
  * Show the form for creating a new resource.
  *
  * @param  string  $parent_slug
  * @return \Illuminate\Http\Response
  */

  public function create($parent_id = 0){
    $media = new Media;
    $data = array(
      'page_class' => 'media',
      'page_title' => 'Media create',
      'page_id'    => 'create'
    );
    $articles = Article::listAll();
    return view('admin.templates.medias-edit', compact('media', 'data', 'articles'));
  }


  /**
  * Update the specified resource in storage.
  *
  * @param  \Illuminate\Http\Request  $request
  * @param  int  $id
  */

  public function update(Media $media, MediaRequest $request){
    // Save article
    return $this->saveObject($media, $request);

    // $this->linkRelatedArticle($request);
    // dd($request);
    // if($media->model_id && $media->model_type){
    //   $article = $media->model_type::find($media->model_id);
    //   dd($article);
    // };
    // $file                 = $request->file('file');
    // if(!empty($file)){
    //   $fileSystem           = app(\Spatie\MediaLibrary\Filesystem\Filesystem::class);
    //   $fileSystem->removeAllFiles($media);
    //   $path                 = $file->path();
    //   list($width, $height) = getimagesize($file);
    //   // Copy the new file
    //   $fileSystem->copyToMediaLibrary($path, $media, false, $media->file_name);
    // }
    // $media->name = $request['name'];
    // $media->save();
    // return redirect()->route('admin.medias.edit', $media->id);

  }


  /**
  * Store a newly created resource in storage.
  *
  * @param  \Illuminate\Http\Request  $request
  * @return \Illuminate\Http\Response
  */

  public function store(MediaRequest $request){
    // Create article
    return $this->saveObject(null, $request);
  }


  /**
  * Return article's medias
  *
  * @param  string  $media_type
  * @param  string  $mediatable_type
  * @param  int  $article_id
  * @return \Json\Response
  */

  public function mediasArticle($model_type, $article_id, $collection_name){
    $class = $this->getClass($model_type);
    $article = $class::findOrFail($article_id);
    $medias = $article->getMedia($collection_name);
    return response()->json([
    'success' => true,
    'medias' => $medias,
    ]);
  }


  /**
  * Store media related to an article
  *
  * @param  \Illuminate\Http\Request  $request
  * @param  string  $mediatable_type
  * @param  int  $article_id
  * @return JSON\Response
  */

  public function storeAndLink(Request $request, $mediatable_type, $article_id){
    // Validator conditions
    $validator = Validator::make($request->all(), [
     'image' => 'required|mimes:jpeg,jpg,png,gif,pdf,mp4|max:3000',
    ]);
    // Validator test
    if ($validator->fails()) {
     return response()->json([
       'status'      => 'error',
       // TODO: Trad
       'error'       =>  'Error while uploading file, please check file format and size.',
       'collection'  => $request->collection_name,
       'article_id'  => $article_id,
     ]);
    }else{
     $class = $this->getClass($mediatable_type);
     $article = $class::findOrFail($article_id);
     // Champs requests
     $file = $request->file('image');
     if($file && !empty($article_id) && $article_id != 'null'){
       list($width, $height) = getimagesize($file);
       $file_name = $file->getClientOriginalName();
       $orig_name = pathinfo($file_name, PATHINFO_FILENAME);
       $extension = $file->getClientOriginalExtension();
       $name = str_slug($orig_name).'.'.$extension;
       $media = $article->addMediaFromRequest('image')->usingFileName($name)->withCustomProperties(['width' => $width, 'height' => $height])->toMediaCollection($request->collection_name);

       return response()->json([
         'success'          => true,
         'media'            => $media,
       ]);
     }
    }
  }



  /**
  * Remove the specified resource from storage.
  *
  * @param  int  $id
  * @return \Illuminate\Http\Response
  */

  public function destroy(Media $media){
    return $this->destroyObject($media);
  }


  /**
  * Quick Destroy (no form)
  *
  * @param  \Illuminate\Http\Request  $request
  * @return \Illuminate\Http\Response
  */

  public function quickDestroy($id){
    // Media::deleteMediaFile($id);
    $media = Media::find($id)->delete();
    return response()->json([
     'success'         => true,
    ]);
  }


  /**
  * Reorder medais related to an article
  *
  * @param  \Illuminate\Http\Request  $request
  * @param  int  $id
  * @return \Illuminate\Http\Response
  */

  public function reorder(Request $request, $media_type, $model, $article_id){
    $class = $this->getClass($model);
    $article = $class::findOrFail($article_id);
    $media_id  = $request->mediaId;

    $new_order = $request->newOrder;
    $v = 1;
    $medias = $article->getMedia($media_type);
    if(isset($medias)){
     $v = 0;
     // loop in related medias
     foreach ($medias as $media) {
       $media = Media::findOrFail($media->id);
       if($v == $new_order){$v++;}
       if($media->id == $media_id){
         $media->order_column = $new_order;
       }else{
         $media->order_column = $v;
         $v++;
       }
       $media->timestamps = false;
       // Update Media with new order
       $media->update();
     }
    }
    return response()->json([
     'status' => 'success',
    ]);
  }


  /**
  * Update the specified resource in storage.
  *
  * @param  \Illuminate\Http\Request  $request
  * @return \Illuminate\Http\Response
  */

  public function ajaxUpdate(Request $request, $mediatable_type){
    $id = $request->media_id;
    $media = Media::findOrFail($id);
    $file = $request->file('background_image_file');
    if($file){
     // Upload
     $background_image = Media::uploadMediaFile($file);
     $media->update(['background_image' => $background_image['name']]);
    }
    $media->update($request->all());
    return response()->json([
     'status'                  => 'success',
     'media_id'                => $media->id,
     'media_alt'               => $media->alt,
     'media_description'       => $media->description,
     'media_type'              => $media->type,
     'mediatable_type'         => $mediatable_type,
    ]);
  }

  /**
  * Upload de fichier simple (pour les champs texte)
  *
  * @param  \Illuminate\Http\Request  $request
  * @return \Illuminate\Http\Response
  */

  public function fileUpload($file){
    $file_name = $file->getClientOriginalName();
    $orig_name = pathinfo($file_name, PATHINFO_FILENAME);
    $extension = $file->getClientOriginalExtension();
    $name = time() .'-'. str_slug($orig_name).'.'.$extension;
    $mediapath = public_path().'/medias/';
    $file->move('medias', $name);

    return response()->json([
      'status'     => 'success',
      'filename'   => $file_url,
      'name'       => $file_name,
      'extension' =>  $extension
    ]);
  }

  /**
  * Sanitize media name
  *
  * @param  file
  * @return string
  */

  public function fileName($file){
    $file_name = $file->getClientOriginalName();
    $orig_name = pathinfo($file_name, PATHINFO_FILENAME);
    $extension = $file->getClientOriginalExtension();
    $name = str_slug($orig_name).'.'.$extension;
    return $name;
  }


  /**
  * Link Related Article id exists
  *
  * @param  \Illuminate\Http\Request  $request
  * @return true
  */

  static function linkRelatedArticle($request){
    if(!empty($request->associated_article)):
      $article = explode(',', $request->associated_article);
      $article_model = $article[0];
      $article_id = $article[1];
      if(!empty($article_model) && !empty($article_id) && $article_id != 'null'):
        $request['model'] = $article_model;
        $request['article_id'] = $article_id;
      endif;
    else:
      $request['model'] = null;
      $request['article_id'] = null;
    endif;
    return true;
  }

}

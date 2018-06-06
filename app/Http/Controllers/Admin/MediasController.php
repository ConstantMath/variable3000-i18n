<?php

namespace App\Http\Controllers\Admin;
use Validator;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Spatie\MediaLibrary\Models\Media;
use App\DB;
use Spatie\MediaLibrary\HasMedia\HasMediaTrait;
use Spatie\MediaLibrary\HasMedia\HasMedia;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\Admin\MediaRequest;

class MediasController extends AdminController {

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
      $article = Media::findOrFail($id);
      $data = array(
        'page_class' => 'media',
        'page_title' => 'Media edit',
        'page_id'    => 'index-',
      );
    	return view('admin/templates/medias-edit',  compact('article', 'data'));
    }


    /**
     * Show the form for creating a new resource.
     *
     * @param  string  $parent_slug
     * @return \Illuminate\Http\Response
     */

    public function create($parent_id = 0){
      $data = array(
        'page_class' => 'media create',
        'page_title' => 'Media create',
        'page_id'    => 'index-'.$parent_id,
      );
      $article = new Media;
      return view('admin.templates.medias-edit', compact('article', 'data'));
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
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    public function store(MediaRequest $request){
      // Create article
      return $this->createObject(Media::class, $request, 'redirect');
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

   public function reorder(Request $request, $media_type, $mediatable_type, $article_id){
     $class = $this->getClass($mediatable_type);
     $article = $class::findOrFail($article_id);
     $media_id  = $request->mediaId;
     $media_type  = $request->mediaType;
     $new_order = $request->newOrder;
     $v = 1;
     $medias = $article->medias->where('type', $media_type);
     if(isset($medias)){
       $v = 0;
       // loop in related medias
       foreach ($medias as $media) {
         $media = Media::findOrFail($media->id);
         if($v == $new_order){$v++;}
         if($media->id == $media_id){
           $media->order = $new_order;
         }else{
           $media->order = $v;
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
   * Upload de fichier simple (pour les champs texte)
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */

   public function fileUpload(Request $request){
     // Validator conditions
     $validator = Validator::make($request->all(), [
       'file' => 'required|mimes:jpeg,jpg,png,gif,pdf,mp4',
     ]);
     // Validator test
     if ($validator->fails()) {
       return response()->json([
         'status' => 'error',
         'error'    =>  'Error while uploading file, please check file format and size.'
       ]);
     }else{
       $file = $request->file;
       $file_name = $file->getClientOriginalName();
       $orig_name = pathinfo($file_name, PATHINFO_FILENAME);
       $extension = $file->getClientOriginalExtension();
       $name = time() .'-'. str_slug($orig_name).'.'.$extension;
       $mediapath = public_path().'/medias/';
       // Store the file
       //$path = $file->storeAs('public', $name);
       if($extension == 'pdf'){
         $file_url = '/medias/'.$name;
       }else{
         $file_url = '/imagecache/large/'.$name;
       }
       $file->move('medias', $name);

       return response()->json([
         'status'     => 'success',
         'filename'   => $file_url,
         'name'       => $file_name,
         'extension' =>  $extension
       ]);
     }
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
   * GEt all medias from id array
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */

  // public function getFromArray(Request $request){
  //   $medias_array = explode( ',', $request->medias[0]);
  //   $medias = Media::whereIn('id', $medias_array)->get();
  //   return response()->json([
  //     'success' => true,
  //     'medias' => $medias,
  //     'medias_array' => $medias_array,
  //   ]);
  // }

}

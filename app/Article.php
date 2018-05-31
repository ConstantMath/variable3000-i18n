<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Spatie\MediaLibrary\HasMedia\HasMediaTrait;
use Spatie\MediaLibrary\HasMedia\HasMedia;

class Article extends Model implements HasMedia{

  use HasMediaTrait;
  use Mediatable;
  use \Dimsav\Translatable\Translatable;
  protected $table = 'articles';
  public $translatedAttributes = ['title', 'intro', 'text', 'slug'];
  protected $fillable = ['created_at', 'order', 'parent_id', 'published'];

  // Medialibrary collections define
  public function registerMediaCollections(){
    $this->addMediaCollection('une')->singleFile();
    $this->addMediaCollection('gallery');
  }

  /**
   * Construct : default Locale
   *
   */

  public function __construct(array $attributes = []){
    parent::__construct($attributes);
    // $this->defaultLocale = 'en';
  }


  /**
   * Fetch all medias by type for the model ordered
   * @param string  $type
   *
   * @return \Illuminate\Database\Eloquent\Relations\MorphMany
   */

  public function mediasByType(){
    return $this->morphMany(Media::class, 'mediatable')
                ->orderBy('order', 'asc');
  }


  /**
   * Retourne les articles enfants
   *
   */

  public function children(){
    return $this->hasMany('App\Article', 'parent_id')
                ->orderBy('order', 'asc');
  }


  /**
   * Get the parent article
   * @param int  $id
	 *
   */

   public function parent(){
     return $this->belongsTo('App\Article', 'parent_id');
   }


  /**
   * Returns the child/nested articles
   *
   */

  public function publishedChildren(){
    return $this->hasMany('App\article', 'parent_id')
                ->where('published', 1)
                ->orderBy('order', 'asc');
  }



  /**
  * Returns the featured image
  */

  public function imageUne(){
    return $this->morphOne('App\Media', 'mediatable');
  }


  /**
  * Returns the category (unique)
  */

  public function category(){
    return $this->belongsToMany('App\Taxonomy')->where('parent_id', 1)->withTimestamps();
  }


  /**
   * Returns the tags (n)
   *
   */

  public function taxonomies(){
    return $this->belongsToMany('App\Taxonomy')->withTimestamps();
  }


  /**
   * Returns all the tags
   *
   */

  public function tags(){
    return $this->belongsToMany('App\Taxonomy')->where('parent_id', 2)->withTimestamps();
  }


  /**
   * Returns the categories for a select
   *
   */

  public function taxonomiesDropdown($parent_id, $appendEmpty=0){
    if($appendEmpty){
      return Taxonomy::where('parent_id', $parent_id)->get()->pluck('name', 'id')->prepend('', '');
    }else{
      return Taxonomy::where('parent_id', $parent_id)->get()->pluck('name', 'id');
    }
  }


  /**
   * Retourne l'id de l'article sur base du slug
   * @param string  $title
   *
   */

  public static function getSlugFromId($id){
    $article = Article::find($id);
    if($article){
      return $article->slug;
    }
  }


  /**
   * Réécrit la date d'update
   * @param string  $value (date)
	 *
   */

  public function getUpdatedAtAttribute($value){
    if(!empty($value)){
      Carbon::setLocale('fr');
      $date = Carbon::parse($value)->diffForHumans();
    }else{
      $date = "";
    }
    return $date;
  }


  /**
   * Retourne une liste de catégories associées à l'article
   * Nécessaire pour le dropdown select
   *
   */

   public function getCategoriesAttribute() {
    return $this->taxonomies->pluck('id')->all();
 	}

  /**
   * Retourne une liste des tags associées à l'article
   * Nécessaire pour le dropdown select
   *
   */

    public function getTagsAttribute() {
     return $this->taxonomies->pluck('id')->all();
  	}

    /**
     * GET: Formate le champs 'created_at'
     * @param date  $date
  	 *
     */

    public function getCreatedAtAttribute($date){
      if(empty($date)){
        $date = Carbon::now('Europe/Paris');
      }
      $date = Carbon::createFromFormat('Y-m-d H:i:s', $date)->format('d.m.Y');
      return $date;
    }


    /**
    * Create formated date-time
    */

    public function dateTime($date){
      if(!empty($date)){
        return Carbon::createFromFormat('d.m.Y', $date)->format('Y-m-d');
      }else{
        return null;
      }
    }

}

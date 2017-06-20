<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;


class Article extends Model{

  use Mediatable;
  use \Dimsav\Translatable\Translatable;
  protected $table = 'articles';

  public $translatedAttributes = ['title', 'intro', 'text', 'slug'];
  protected $fillable = [
    'created_at',
    'order',
    'parent_id',
    'published',
    'image_une',
  ];


  /**
   * Construct : default Locale
   *
   */

  public function __construct(array $attributes = []){
    parent::__construct($attributes);
    // $this->defaultLocale = 'en';
  }


  /**
   * Retourne les articles enfants
   *
   */

  public function children(){
    return $this->hasMany('App\article', 'parent_id')
                ->orderBy('order', 'asc');
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
   * Add sub attributes to articles
   *
   * @param string  $parent_slug
   * @return Builder
   */

  public static function mapElements($articles){
    $articles->map(function ($item, $key) {
      // Year
      // $year = $item->tags()->where('parent_id', 1)->first();
      // $item['year'] = $year['name'];
      // Add main image
      $item['media'] =  ($item->image_une)? Media::find($item->image_une) : null;
    });
    return $articles;
  }


  /**
  * Returns the featured image
  */

  public function imageUne(){
    return $this->hasOne('App\Media', 'id', 'image_une');
  }


  /**
  * Returns the category (unique)
  */

  public function category(){
    return $this->belongsToMany('App\Tag')->where('parent_id', 1)->withTimestamps();
  }


  /**
   * Returns the tags (n)
   *
   */

  public function tags(){
    return $this->belongsToMany('App\Tag')->withTimestamps();
  }


  /**
   * Returns éall the taxono
   *
   */

  public function theTags(){
    return $this->belongsToMany('App\Tag')->where('parent_id', 2)->withTimestamps();
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
    return $this->tags->pluck('id')->all();
 	}

  /**
   * Retourne une liste des tags associées à l'article
   * Nécessaire pour le dropdown select
   *
   */

    public function getTagListAttribute() {
     return $this->tags->pluck('id')->all();
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
}

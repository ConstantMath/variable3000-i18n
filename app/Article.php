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
  * Retourne l'image une
  */
  public function imageUne(){
    return $this->hasOne('App\Media', 'id', 'image_une');
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

  // /**
  //  * Retourne l'id de l'article sur base du slug
  //  * @param string  $slug
  //  *
  //  */
  //
  // public static function getIdFromSlug($slug){
  //   $article = Article::where('slug', $slug)->pluck('id');
  //   if($article){
  //     return $article[0];
  //   }
  // }

  // /**
  //  * Ajoute titre & slug,  lancé lorsque un titre est créé
  //  * @param string  $title
	//  *
  //  */
  //
  //  public function setTitleAttribute($title){
  //    $this->attributes['title'] = $title;
  //    $article_id = (isset($this->attributes['id'])) ? $this->attributes['id'] : 0;
  //    if (empty($this->attributes['slug'])){
  //      $this->attributes['slug'] = Self::makeSlugFromTitle($title, $article_id);
  //    }
  //  }


  //  /**
  //   * Ajoute un attirbut order si absent
  //   * @param string  $order
 // 	 *
  //   */
   //
  //   public function setOrderAttribute($order){
  //     if(!isset($order) or $order == ''):
  //       $parent_id = $this->attributes['parent_id'];
  //       $increments = Article::where('parent_id', $parent_id)->increment('order');
  //       $this->attributes['order'] = 0;
  //     else:
  //       $this->attributes['order'] = $order;
  //     endif;
  //   }


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


  // /**
  //  * Réécrit le parent id > parent slug
  //  * @param int  $id
	//  *
  //  */
  //
  // public function getParentIdAttribute($id){
  //   $parent = Article::find($id);
  //   return $parent->slug;
  // }

  // /**
  //  * Crée un slug unique
  //  * @param string  $title
  //  *
  //  */
  //
  // public function makeSlugFromTitle($title, $article_id = 0){
  //   $slug = str_slug($title);
  //   $count = Article::whereRaw("slug RLIKE '^{$slug}(-[0-9]+)?$'")->where('id', '!=' , $article_id)->count();
  //   if($count){
  //     $count += 1;
  //     $new_slug = $slug.'-'.$count;
  //   }else{
  //     $new_slug = $slug;
  //   }
  //   return $new_slug;
  // }


  /**
   * Retourne les articles enfants
   *
   */
  public function children(){
    return $this->hasMany('App\article', 'parent_id')->orderBy('order', 'asc');
  }


  /**
   * Retourne tous les tags
   *
   */

  public function tags(){
    return $this->belongsToMany('App\Tag')->withTimestamps();
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

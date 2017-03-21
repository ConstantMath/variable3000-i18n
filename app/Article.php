<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;


class Article extends Model{

  use Mediatable;
  protected $table = 'articles';

  protected $fillable = [
      'title',
      'intro',
      'text',
      'slug',
      'order',
      'parent_id',
      'published',
      'image_une',
  ];


  /**
	 * Liste des articles par parent
	 *
	 * @param string  $parent_slug
	 * @return Builder
	 */
	public static function getByParent($parent_slug){
    $parent_id = Article::where('slug', $parent_slug)->pluck('id');
    if(!empty($parent_id)){
      $articles = Article::where('parent_id', $parent_id)->orderBy('order', 'asc')->get();
    }else{
      $articles = '';
    }
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

  /**
   * Retourne l'id de l'article sur base du slug
   * @param string  $slug
   *
   */

  public static function getIdFromSlug($slug){
    $article = Article::where('slug', $slug)->pluck('id');
    if($article){
      return $article[0];
    }
  }

  /**
   * Ajoute titre & slug,  lancé lorsque un titre est créé
   * @param string  $title
	 *
   */

   public function setTitleAttribute($title){
     $this->attributes['title'] = $title;
     $article_id = (isset($this->attributes['id'])) ? $this->attributes['id'] : 0;
     if (empty($this->attributes['slug'])){
       $this->attributes['slug'] = Self::makeSlugFromTitle($title, $article_id);
     }
   }


   /**
    * Ajoute un attirbut order si absent
    * @param string  $order
 	 *
    */

    public function setOrderAttribute($order){
      if(!isset($order) or $order == ''):
        $parent_id = $this->attributes['parent_id'];
        $increments = Article::where('parent_id', $parent_id)->increment('order');
        $this->attributes['order'] = 0;
      else:
        $this->attributes['order'] = $order;
      endif;
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
   * Réécrit le parent id > parent slug
   * @param int  $id
	 *
   */

  public function getParentIdAttribute($id){
    $parent = Article::find($id);
    return $parent->slug;
  }

  /**
   * Crée un slug unique
   * @param string  $title
   *
   */

  public function makeSlugFromTitle($title, $article_id = 0){
    $slug = str_slug($title);
    $count = Article::whereRaw("slug RLIKE '^{$slug}(-[0-9]+)?$'")->where('id', '!=' , $article_id)->count();
    if($count){
      $count += 1;
      $new_slug = $slug.'-'.$count;
    }else{
      $new_slug = $slug;
    }
    return $new_slug;
  }


  /**
   * Retourne les articles enfants
   *
   */
  public function children(){
    return $this->hasMany('App\article', 'parent_id')->orderBy('order', 'asc');
  }
}

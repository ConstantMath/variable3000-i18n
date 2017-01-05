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
      'published'
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
   * Ajoute titre & slug,  lancé lorsque un titre est créé
   * @param string  $title
	 *
   */

  public function setTitleAttribute($title){
    $this->attributes['title'] = $title;
    $this->attributes['slug'] = Self::makeSlugFromTitle($title);
  }

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

  public function makeSlugFromTitle($title){
    $slug = str_slug($title);
    $count = Article::whereRaw("slug RLIKE '^{$slug}(-[0-9]+)?$'")->count();
    if($count){
      $count += 1;
      $new_slug = $slug.'-'.$count;

    }else{
      $new_slug = $slug;
    }
    return $new_slug;
  }


  /**
   * Retourne les tags
   *
   */

  public function tags(){
    return $this->belongsToMany('App\tag')->withTimestamps();
  }

  /**
   * Retourne une liste de tags (id) associés à l'article
   *
   */
   public function getTagListAttribute() {
    return $this->tags->lists('id')->all();
 	}
}

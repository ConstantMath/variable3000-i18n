<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;

class Tag extends Model{

  use Sluggable;
  use \Dimsav\Translatable\Translatable;

  protected $table = 'tags';
  public $translatedAttributes = ['name', 'slug'];
  protected $fillable = ['parent_id', 'order',];


  /**
   * Return the sluggable configuration array for this model.
   *
   * @return array
   */

  public function sluggable(){
    return [
      'slug' => [
        'source' => 'name',
                'onUpdate' => true
      ]
    ];
  }

  /**
   * Retourne les articles associés au tag
   *
   */

  public function articles(){
    return $this->belongsToMany('App\Article');
  }


  /**
   * Ajoute nom & slug, lancé lorsque un nom est créé
   * @param array  $new_tags
	 *
   */

  public static function detachOldAddNew($new_tags, $tag_parent_id, $article_id){
    $article = Article::findOrFail($article_id);
    $all_tags = Tag::where('parent_id', $tag_parent_id)->get();
    if(!$all_tags->isEmpty()){
      $article->tags()->detach($all_tags);
    }
    if($new_tags && !empty($new_tags[0])){
      $article->tags()->syncWithoutDetaching($new_tags);
    }
  }


  /**
   * Ajoute les tags en fonction du tableau retourné par Select2.js
   *
   * @param  $tags
   * @return Aray
   */

  public static function processTags($tags, $parent_tag_id){

    // sépare le tableau retourné en numeric (tags existant) et string (nouveaux tags)
    $currentTags = array_filter($tags, 'is_numeric');
    $newTags = array_filter($tags, 'is_string');

    // crée un nouveau tag pour chaque string retournée et l'ajoute au tableau ‘tags' courant
    foreach ($newTags as $newTag):
      // check si le tag n'es tpas déjà dans les tags existants
      if(in_array($newTag, $currentTags)):
        continue;
      endif;
      // check si le tag exsite déjà
      $tag = Tag::where("name", "=", $newTag)->first();
      // sinon, création du nouveau tag
      if(!$tag):
        $tag = Tag::create([
          'name' => $newTag,
          'parent_id' => $parent_tag_id,
        ]);
      endif;
      // et ajoute le nouvel ID au tableau
      $currentTags[] = $tag->id;
    endforeach;
    return $currentTags;
  }


  /**
   * Get all children
   *
   */
  public function children(){
    return $this->hasMany('App\tag', 'parent_id')->orderBy('order', 'asc');
  }


  /**
   * Get the parent Taxonomy
   * @param int  $id
	 *
   */

   public function parent(){
     return $this->belongsTo('App\Tag', 'parent_id');
   }

}

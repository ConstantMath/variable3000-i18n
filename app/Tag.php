<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;

class Tag extends Model{

  use \Dimsav\Translatable\Translatable;

  protected $table = 'tags';
  public $translatedAttributes = ['name', 'slug'];
  protected $fillable = ['parent_id', 'order',];



  /**
   * Retourne les articles associés au tag
   *
   */

  public function articles(){
    return $this->belongsToMany('App\Article')
            ->where('published', 1)
            ->orderBy('order');
  }


  /**
   * Ajoute nom & slug, lancé lorsque un nom est créé
   * @param array  $new_tags
	 *
   */

  public static function detachOldAddNew($taxonomies_input, $taxonomy_parent_id, $article_id){
    if(!empty($taxonomies_input)){
      // Add new taxonomies
      $new_taxonomies = Tag::processTags($taxonomies_input, $taxonomy_parent_id);
    }else{
      $new_taxonomies = "";
    }
    $article = Article::findOrFail($article_id);
    $all_tags = Tag::where('parent_id', $taxonomy_parent_id)->get();
    if(!$all_tags->isEmpty()){
      $article->tags()->detach($all_tags);
    }
    if($new_taxonomies && !empty($new_taxonomies[0])){
      //dd($new_taxonomies);
      $article->tags()->syncWithoutDetaching($new_taxonomies);
    }
  }


  /**
   * Ajoute les tags en fonction du tableau retourné par Select2.js
   *
   * @param  $tags
   * @return Aray
   */

  public static function processTags($tags, $tag_parent_id){
    // sépare le tableau retourné en numeric (tags existant) et string (nouveaux tags)
    $currentTags = array_filter($tags, 'is_numeric');
    $newTags = array_filter($tags, 'is_string');

    // crée un nouveau tag pour chaque string retournée et l'ajoute au tableau ‘tags' courant
    foreach ($newTags as $newTag):
      // check si le tag n'est pas déjà dans les tags existants
      if(in_array($newTag, $currentTags)):
        continue;
      endif;
      // check si le tag existe déjà
      $tag = Tag::whereTranslation("name", "=", $newTag)->first();
      // sinon, création du nouveau tag
      if(!$tag):
        $tag = Tag::create([
          'name' => $newTag,
          'parent_id' => $tag_parent_id,
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

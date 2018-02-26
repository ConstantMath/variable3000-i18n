<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;

class Taxonomy extends Model{

  use \Dimsav\Translatable\Translatable;

  protected $table = 'taxonomies';
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

  public static function detachOldAddNew($taxonomies_input, $taxonomy_parent_id, $article_id, $model = 'App\Article'){
    if(!empty($taxonomies_input)){
      // Add new taxonomies
      $new_taxonomies = Taxonomy::processTaxonomies($taxonomies_input, $taxonomy_parent_id);
    }else{
      $new_taxonomies = "";
    }
    $article = $model::findOrFail($article_id);
    $all_taxonomies = Taxonomy::where('parent_id', $taxonomy_parent_id)->get();
    if(!$all_taxonomies->isEmpty()){
      $article->taxonomies()->detach($all_taxonomies);
    }
    if($new_taxonomies && !empty($new_taxonomies[0])){
      $article->taxonomies()->syncWithoutDetaching($new_taxonomies);
    }
  }


  /**
   * Ajoute les tags en fonction du tableau retourné par Select2.js
   *
   * @param  $tags
   * @return Aray
   */

  public static function processTaxonomies($taxonomies, $taxonomy_parent_id){
    // sépare le tableau retourné en numeric (tags existant) et string (nouveaux tags)
    $currentTaxonomies = array_filter($taxonomies, 'is_numeric');
    $newTaxonomies = array_filter($taxonomies, 'is_string');
    // crée un nouveau tag pour chaque string retournée et l'ajoute au tableau ‘tags' courant
    foreach ($newTaxonomies as $newTaxonomy):
      // check si le tag n'est pas déjà dans les tags existants
      if(in_array($newTaxonomy, $currentTaxonomies)):
        continue;
      endif;
      // check si le tag existe déjà
      $taxonomy = Taxonomy::whereTranslation("name", "=", $newTaxonomy)->first();
      // sinon, création du nouveau tag
      if(!$taxonomy):
        $taxonomy = Taxonomy::create([
          'name' => $newTaxonomy,
          'parent_id' => $taxonomy_parent_id,
        ]);
      endif;
      // et ajoute le nouvel ID au tableau
      $currentTaxonomies[] = $taxonomy->id;
    endforeach;
    return $currentTaxonomies;
  }


  /**
   * Get all children
   *
   */
  public function children(){
    return $this->hasMany('App\Taxonomy', 'parent_id')->orderBy('order', 'asc');
  }


  /**
   * Get the parent Taxonomy
   * @param int  $id
	 *
   */

   public function parent(){
     return $this->belongsTo('App\Taxonomy', 'parent_id');
   }

}

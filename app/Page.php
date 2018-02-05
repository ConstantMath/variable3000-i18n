<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Cviebrock\EloquentSluggable\Sluggable;

class Page extends Model{
  protected $table = 'pages';
  use \Dimsav\Translatable\Translatable;
  public $translatedAttributes = ['title', 'intro', 'text', 'slug'];
  protected $fillable = [
    'created_at',
    'order',
    'published',
  ];


  /**
   * Get children articles
   *
   */

  public function children(){
    return $this->hasMany('App\Article', 'parent_id')
                ->orderBy('order', 'asc');
  }
}

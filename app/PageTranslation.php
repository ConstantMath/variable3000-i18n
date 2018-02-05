<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;

class PageTranslation extends Model{
  use Sluggable;
  public $timestamps = false;
  protected $fillable = ['title', 'slug', 'intro', 'text',];

  /**
   * Return the sluggable configuration array for this model.
   *
   * @return array
   */

  public function sluggable(){
    return [
      'slug' => [
        'source' => 'title',
                'onUpdate' => true
      ]
    ];
  }


  /**
   * Add a title if not set
   * @param string  $order
  *
   */

   public function setTitleAttribute($value){
     if(!isset($value) or $value == ''):
       $this->attributes['title'] = null;
     else:
       $this->attributes['title'] = $value;
     endif;
   }

}

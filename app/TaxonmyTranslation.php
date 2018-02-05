<?php

namespace App;
use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;

class TaxonomyTranslation extends Model{

  use Sluggable;
  public $timestamps = false;
  protected $fillable = ['name', 'slug'];

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
   * Add a title if not set
   * @param string  $order
  *
   */

   public function setNameAttribute($value){
     if(!isset($value) or $value == ''):
      $this->attributes['name'] = null;
     else:
       $this->attributes['name'] = $value;
     endif;
   }

}

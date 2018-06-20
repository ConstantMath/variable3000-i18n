<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Cviebrock\EloquentSluggable\Sluggable;
use Spatie\MediaLibrary\HasMedia\HasMediaTrait;
use Spatie\MediaLibrary\HasMedia\HasMedia;

class Page extends Model implements HasMedia{

  use HasMediaTrait;
  use \Dimsav\Translatable\Translatable;
  protected $table = 'pages';
  public $translatedAttributes = ['title', 'intro', 'text', 'slug'];
  protected $fillable = ['created_at', 'order', 'published', 'parent_id'];


  /**
   * Get children articles
   *
   */

  public function children(){
    return $this->hasMany('App\Page', 'parent_id')
                ->orderBy('order', 'asc');
  }


  /**
   * Réécrit la date d'update
   * @param string  $value (date)
	 *
   */
  public function getUpdatedAtAttribute($value){
    if(!empty($value)){
      Carbon::setLocale(config('app.locale'));
      $date = Carbon::parse($value)->diffForHumans();
    }else{
      $date = "";
    }
    return $date;
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


  /**
   * Set default parent_id
   *
   */

  public function setParentIdAttribute($parent_id){
    if (empty($parent_id)){
      $this->attributes['parent_id'] = 0;
    }else{
      $this->attributes['parent_id'] = $parent_id;
    }
  }


  /**
   * Concact mdoel + title for related dropdown
   * @param date  $date
   *
   */

   public function getModelTitleAttribute(){
     $data = get_class().', '.$this->id;
     return $data;
   }
}

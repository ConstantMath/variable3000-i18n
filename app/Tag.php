<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model{

  protected $fillable = [
    'name',
    'parent_id',
  ];

  /**
   * Retourne les articles associés au tag
   *
   */

  public function articles(){
    return $this->belongsToMany('App\Article');
  }
}

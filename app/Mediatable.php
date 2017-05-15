<?php
namespace App;

trait Mediatable{

  /**
   * Fetch all medias for the model ordered
   *
   * @return \Illuminate\Database\Eloquent\Relations\MorphMany
   */

  public function medias(){
    return $this->morphMany(Media::class, 'mediatable')->orderBy('order', 'asc');
  }

  /**
   * Fetch last media from article
   *
   * @return \Illuminate\Database\Eloquent\Relations\MorphMany
   */

  public function lastMediaId(){
    return $this->morphMany(Media::class, 'mediatable')->orderBy('order', 'desc')->pluck('order')->first();
  }

}

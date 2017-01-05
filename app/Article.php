<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
  protected $table = 'articles';

  protected $fillable = [
      'title',
      'description',
      'slug',
      'published'
  ];


  public function setTitleAttribute($value){
    $this->attributes['title'] = $value;
    $this->attributes['slug'] = Self::makeSlugFromTitle($value);
  }

  /**
   * Create a unique slug.
   */

  public function makeSlugFromTitle($title){
    $slug = str_slug($title);
    $count = Article::whereRaw("slug RLIKE '^{$slug}(-[0-9]+)?$'")->count();
    return $count ? "{$slug}-{$count}" : $slug;
    return ($slugCount > 0) ? "{$slug}-{$slugCount}" : $slug;
  }
}

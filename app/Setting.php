<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
  use \Dimsav\Translatable\Translatable;
  protected $table = 'settings';
  protected $fillable = ['order'];
  public $translatedAttributes = ['name', 'description', 'content'];
}

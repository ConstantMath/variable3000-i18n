<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
  use Notifiable;
  use HasRoles;   // Spatie laravel-permission
  protected $fillable = ['name', 'email', 'password'];
  // The attributes that should be hidden for arrays.
  protected $hidden = ['password', 'remember_token'];

  /**
   * Hash the password field
   *
   */

  public function setPasswordAttribute($password){
    if (!empty($password)){
      $this->attributes['password'] = bcrypt($password);
    }
  }
}

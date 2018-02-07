<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;
    protected $fillable = ['name', 'email', 'password'];
    // The attributes that should be hidden for arrays.
    protected $hidden = ['password', 'remember_token'];
}

<?php

namespace App\Http\Controllers\Admin;
use Validator;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Media;
use App\Tag;


class AdminMediasController extends Controller
{

  public function __construct(){
    $this->middleware('auth');
  }




}

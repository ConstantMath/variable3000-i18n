<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\User;
use Validator;
use App\Http\Requests\Admin\UserRequest;
use Illuminate\Support\Facades\Hash;

class UsersController extends AdminController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function index(){
      $data = array(
        'page_class' => 'users-index',
        'page_title' => 'Users index',
        'page_id'    => 'users',
      );
      $users = User::all();
      return view('admin/templates/users-index', compact('users', 'data'));
    }


    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function create()
    {
      $data = array(
        'page_class' => 'users-edit',
        'page_title' => 'Create a user',
        'page_id'    => 'users',
      );
      $user = collect(new User);
      return view('admin/templates/user-edit', compact('data', 'user'));
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    public function store(UserRequest $request){
      return $this->createObject(User::class, $request);
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    public function show($id)
    {
        //
    }


    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    public function edit($id){
      $data = array(
        'page_class' => 'users-edit',
        'page_title' => 'Edit a user',
        'page_id'    => 'users',
      );
      $user = User::findOrFail($id);
      return view('admin/templates/user-edit', compact('user', 'data'));
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    public function update(User $user, UserRequest $request){
      return $this->saveObject($user, $request);
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    public function destroy($id){
      $user = User::findOrFail($id);
      $user->delete();
      session()->flash('flash_message', 'Deleted');
      return redirect()->route('admin.users.index');
    }
}

<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\User;
use Validator;
use App\Http\Requests\Admin\UserRequest;
use Illuminate\Support\Facades\Hash;
//Importing laravel-permission models
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

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
      $roles = Role::get();
      return view('admin/templates/user-edit', compact('data', 'user', 'roles'));
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    public function store(UserRequest $request){
      $roles = $request['roles']; //Retrieving the roles field
      //Checking if a role was selected
      if (isset($roles)) {
        foreach ($roles as $role) {
          $role_r = Role::where('id', '=', $role)->firstOrFail();
          $user->assignRole($role_r); //Assigning role to user
        }
      }
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
      $roles = Role::get();
      return view('admin/templates/user-edit', compact('user', 'data', 'roles'));
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    public function update(User $user, UserRequest $request){
      $roles = $request['roles']; //Retreive all roles
      if (isset($roles)) {
        $user->roles()->sync($roles);  //If one or more role is selected associate user to roles
      }
      else {
        $user->roles()->detach(); //If no role is selected remove exisiting role associated to a user
      }
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

<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Auth;
//Importing laravel-permission models
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Session;

class PermissionController extends AdminController{

  public function __construct() {
      $this->middleware(['auth']); //isAdmin middleware lets only users with a //specific permission permission to access these resources
  }

  /**
  * Display a listing of the resource.
  *
  * @return \Illuminate\Http\Response
  */

  public function index() {
    $data = array(
      'page_class' => 'persmissions-index',
      'page_title' => 'Persmissions index',
      'page_id'    => 'persmissions',
    );
    $permissions = Permission::all(); //Get all permissions
    return view('admin.templates.permissions-index', compact('permissions', 'data'));
  }


  /**
  * Show the form for creating a new resource.
  *
  * @return \Illuminate\Http\Response
  */

  public function create() {
    $data = array(
      'page_class' => 'users-edit',
      'page_title' => 'Create a user',
      'page_id'    => 'users',
    );
    $permission = collect(new Permission);
    $roles = Role::get(); //Get all roles
    return view('admin.templates.permissions-edit', compact('roles', 'permission', 'data'));
  }

  /**
  * Store a newly created resource in storage.
  *
  * @param  \Illuminate\Http\Request  $request
  * @return \Illuminate\Http\Response
  */
  public function store(Request $request) {
      $this->validate($request, [
          'name'=>'required|max:40',
      ]);

      $name = $request['name'];
      $permission = new Permission();
      $permission->name = $name;

      $roles = $request['roles'];

      $permission->save();

      if (!empty($request['roles'])) { //If one or more role is selected
          foreach ($roles as $role) {
              $r = Role::where('id', '=', $role)->firstOrFail(); //Match input role to db record

              $permission = Permission::where('name', '=', $name)->first(); //Match input //permission to db record
              $r->givePermissionTo($permission);
          }
      }

      return redirect()->route('admin.permissions.index')
          ->with('flash_message',
           'Permission'. $permission->name.' added!');

  }

  /**
  * Display the specified resource.
  *
  * @param  int  $id
  * @return \Illuminate\Http\Response
  */
  public function show($id) {
      return redirect('permissions');
  }

  /**
  * Show the form for editing the specified resource.
  *
  * @param  int  $id
  * @return \Illuminate\Http\Response
  */
  public function edit($id) {
      $permission = Permission::findOrFail($id);

      return view('admin.permissions.edit', compact('permission'));
  }

  /**
  * Update the specified resource in storage.
  *
  * @param  \Illuminate\Http\Request  $request
  * @param  int  $id
  * @return \Illuminate\Http\Response
  */
  public function update(Request $request, $id) {
      $permission = Permission::findOrFail($id);
      $this->validate($request, [
          'name'=>'required|max:40',
      ]);
      $input = $request->all();
      $permission->fill($input)->save();

      return redirect()->route('admin.permissions.index')
          ->with('flash_message',
           'Permission'. $permission->name.' updated!');

  }

  /**
  * Remove the specified resource from storage.
  *
  * @param  int  $id
  * @return \Illuminate\Http\Response
  */
  public function destroy($id) {
      $permission = Permission::findOrFail($id);

  //Make it impossible to delete this specific permission
  if ($permission->name == "Administer roles & permissions") {
          return redirect()->route('admin.permissions.index')
          ->with('flash_message',
           'Cannot delete this Permission!');
      }

      $permission->delete();

      return redirect()->route('admin.permissions.index')
          ->with('flash_message',
           'Permission deleted!');

  }
}

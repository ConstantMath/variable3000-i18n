<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\User;
use Validator;

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

    public function store(Request $request){
      $validator = Validator::make($request->all(),
        [
          'name'                  => 'required|max:255|unique:users',
          'email'                 => 'required|email|max:255|unique:users',
          'password'              => 'required|min:6|max:20|confirmed',
          'password_confirmation' => 'required|same:password',
        ]
      );

      if($validator->fails()) {
        $this->throwValidationException(
          $request, $validator
        );
      }else{
        $user =  User::create([
          'name'       => $request->input('name'),
          'email'      => $request->input('email'),
          'password'   => bcrypt($request->input('password')),
        ]);
        $user->save();
        return redirect()->route('users.index');
      }
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

    public function update(Request $request, $id){
      $user        = User::find($id);
      $emailCheck  = ($request->input('email') != '') && ($request->input('email') != $user->email);
      if ($emailCheck) {
        $validator = Validator::make($request->all(), [
          'name'      => 'required|max:255',
          'email'     => 'required|email|max:255|unique:users',
          'password'  => 'present|confirmed|min:6'
        ]);
      } else {
        $validator = Validator::make($request->all(), [
          'name'      => 'required|max:255',
          'password'  => 'nullable|confirmed|min:6'
        ]);
      }
      if ($validator->fails()) {
        $this->throwValidationException(
            $request, $validator
        );
      } else {
        $user->name = $request->input('name');

        if ($emailCheck) {
          $user->email = $request->input('email');
        }

        if ($request->input('password') != null) {
          $user->password = bcrypt($request->input('password'));
        }
        //$user->activated = 1;
        $user->save();
        return redirect()->route('users.index');
      }
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
      return redirect()->route('users.index');
    }
}

<?php

namespace App\Http\Requests\Admin;
use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(){
      switch($this->method()){
        case 'POST':{ // create
          return [
            'name'                  => 'required|max:255|unique:users',
            'email'                 => 'required|email|max:255|unique:users',
            'password'              => 'sometimes|required|alpha_num|between:6,20|confirmed'
          ];
        }
        case 'PUT':
        case 'PATCH':{
            if($this->get('password') == null){
              return [
                'name'                  => 'required|max:255|unique:users,id,'.$this->get('id'),
                'email'                 => 'required|email|unique:users,email,'.$this->get('id'),
              ];
          }else{
              return [
                'name'                  => 'required|max:255|unique:users,id,'.$this->get('id'),
                'email'                 => 'required|email|unique:users,id,'.$this->get('id'),
                'password'              => 'sometimes|alpha_num|between:6,20|confirmed'
              ];
          }
        }
        default:break;
      }
    }
}

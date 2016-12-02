<?php
Route::get('/', 'PagesController@home');

Route::auth();
Route::get('admintool', 'AdmintoolController@index');
Route::resource('articles', 'ArticlesController');

<?php
Route::get('/', ['as' => 'root', 'uses' => 'ArticlesController@index']);
Route::resource('articles', 'ArticlesController');
Route::resource('pages', 'PagesController');

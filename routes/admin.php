<?php
Route::get('/', ['as' => 'root', 'uses' => 'ArticlesController@index']);
Route::resource('articles', 'ArticlesController');
Route::resource('pages', 'PagesController');
Route::resource('settings', 'SettingsController');
// // Articles : reorder
Route::post('articles/reorder', 'ArticlesController@reorder')->name('articles.reorder');

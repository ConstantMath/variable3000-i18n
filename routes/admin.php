<?php
// Admin specific routes
Route::get('/', ['as' => 'root', 'uses' => 'ArticlesController@index']);
Route::resource('users', 'UsersController');
Route::resource('roles', 'RoleController');
Route::resource('permissions', 'PermissionController');
Route::resource('articles', 'ArticlesController');
Route::resource('pages', 'PagesController', ['except' => ['create', 'index']]);
Route::get('pages/{parent_id}/create', 'PagesController@create')->name('pages.create');
Route::get('pages/{parent_id}/index', 'PagesController@index')->name('pages.index');
Route::resource('settings', 'SettingsController');
Route::resource('taxonomies', 'TaxonomiesController', ['except' => ['create']]);
Route::get('taxonomies/create/{parent_id}', 'TaxonomiesController@create')->name('taxonomies.create');
Route::post('taxonomies/reorder/{id}', 'TaxonomiesController@reorder')->name('taxonomies.reorder');
Route::post('{mediatable_type}/reorder', 'AdminController@orderObject')->name('reorder');
// Medias
Route::get('medias/index/{media_type}/{mediatable_type}/{article_id}', 'mediasController@index')->name('medias.index');
Route::post('medias/store/{mediatable_type}/{article_id?}', 'mediasController@store')->name('medias.store');
Route::post('medias/reorder/{media_type}/{mediatable_type}/{article_id}', 'mediasController@reorder')->name('medias.reorder');
Route::post('medias/destroy/{mediatable_type}/{media_id}', 'mediasController@destroy')->name('medias.destroy');
//Route::post('/admin/articles/{id?}/addmanymedia', 'Admin\ArticlesMediasController@addManyMedia')->name('admin.articles.addmanymedia');
Route::post('medias/get', 'MediasController@getFromArray');
Route::post('medias/update', 'MediasController@update')->name('medias.update');
Route::post('fileupload', 'MediasController@fileUpload')->name('fileupload');

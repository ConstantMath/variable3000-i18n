<?php
// Admin specific routes
Route::get('/', ['as' => 'root', 'uses' => 'ArticlesController@index']);
Route::resource('users', 'UsersController');
Route::resource('roles', 'RoleController');
Route::resource('permissions', 'PermissionController');
Route::resource('roles', 'RoleController');
Route::get('articles/getdata', 'ArticlesController@getDataTable')->name('articles.getdata');
Route::resource('articles', 'ArticlesController');

Route::resource('pages', 'PagesController', ['except' => ['create', 'index']]);
Route::get('pages/{parent_id}/create', 'PagesController@create')->name('pages.create');
Route::get('pages/{parent_id}/index', 'PagesController@index')->name('pages.index');
Route::resource('settings', 'SettingsController');
Route::resource('taxonomies', 'TaxonomiesController', ['except' => ['create']]);
Route::get('taxonomies/create/{parent_id}', 'TaxonomiesController@create')->name('taxonomies.create');
Route::post('taxonomies/reorder/{id}', 'TaxonomiesController@reorder')->name('taxonomies.reorder');
Route::post('{table_type}/reorder', 'AdminController@orderObject')->name('reorder');
// Medias
Route::get('mediasArticle/{model_type}/{article_id}/{collection_name}', 'MediasController@mediasArticle')->name('medias.article');
Route::post('medias/storeandlink/{mediatable_type}/{article_id?}', 'MediasController@storeAndLink')->name('medias.storeandlink');
Route::post('medias/reorder/{media_type}/{mediatable_type}/{article_id}', 'MediasController@reorder')->name('medias.reorder');
Route::get('medias/destroy/{id}', 'MediasController@destroy')->name('medias.destroy');
//Route::post('/admin/articles/{id?}/addmanymedia', 'Admin\ArticlesMediasController@addManyMedia')->name('admin.articles.addmanymedia');
Route::post('medias/get', 'MediasController@getFromArray');
Route::post('medias/update/{mediatable_type}', 'MediasController@update')->name('medias.update');
Route::post('fileupload', 'MediasController@fileUpload')->name('fileupload');
// Datatables
Route::get('datatable', 'DataTablesController@datatable');
Route::get('datatable/getArticles', 'DataTablesController@getArticles')->name('datatable/getdata');

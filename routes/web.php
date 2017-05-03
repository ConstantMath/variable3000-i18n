<?php

// auth
Route::auth(
  ['except' => ['register']] // désactive register
);

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

// Articles : all
Route::get('/admin', 'Admin\ArticlesController@index')->name('admin.index.all')->middleware('auth');
// Articles : all by parent
Route::get('/admin/{parent_id}/articles', 'Admin\ArticlesController@index')->name('admin.index')->middleware('auth');
// Articles : ressources
Route::resource('/admin/articles', 'Admin\ArticlesController', ['except' => [
    'create',
    'edit'
]]);
// Articles : create
Route::get('/admin/{parent_id}/articles/create', 'Admin\ArticlesController@create')->name('admin.articles.create')->middleware('auth');
// Articles : edit
Route::get('/admin/{parent_slug}/articles/{articles}/edit/', 'Admin\ArticlesController@edit')->name('admin.articles.edit')->middleware('auth');
// Articles : reorder
Route::post('/admin/articles/{id}/reorder', 'Admin\ArticlesController@reorder')->name('admin.articles.reorder');

// Medias add // Single
Route::post('/admin/articles/{id?}/addsinglemedia', 'Admin\ArticlesMediasController@addSingleMedia')->name('admin.articles.addsinglemedia');
// Medias delete
Route::post('/admin/articles/{id}/deletemedia', 'Admin\ArticlesMediasController@deleteMedia')->name('admin.articles.deleteMedia');
// Medias add // Many(Gallery)
Route::post('/admin/articles/{id?}/addmanymedia', 'Admin\ArticlesMediasController@addManyMedia')->name('admin.articles.addmanymedia');
// Medias edit
Route::post('/admin/medias/update/', 'Admin\MediasController@update')->name('admin.medias.update')->middleware('auth');
// Medias reorder
Route::post('/admin/articles/{id}/reordermedia', 'Admin\ArticlesMediasController@reorderMedia')->name('admin.articles.reordermedia');
// Generic file upload
Route::post('/admin/fileupload', 'Admin\MediasController@fileUpload')->name('admin.fileupload')->middleware('auth');

// Taxonomies : create
Route::get('/admin/taxonomies/create/{parent_id}', 'Admin\TaxonomiesController@create')->name('taxonomies.create')->middleware('auth');
// Taxonomies : ressources
Route::resource('/admin/taxonomies', 'Admin\TaxonomiesController', ['except' => [
    'create',
]]);


/*
|--------------------------------------------------------------------------
| Front
|--------------------------------------------------------------------------
*/
// Homepage
Route::get('/', 'HomeController@index');
// Article : view
Route::get('/{parent_slug}/{article_slug}', 'ArticlesController@show')->name('articles.show');

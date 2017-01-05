<?php
/*
|--------------------------------------------------------------------------
| Front
|--------------------------------------------------------------------------
*/
// Homepage
Route::get('/', 'HomeController@index');
// Article : view
Route::get('/{parent_slug}/{article_slug}', 'ArticlesController@show')->name('articles.show');


/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

// auth
Route::auth(['except' => [
    'register' // désactive register
]]);

// Admin

// Articles : all
Route::get('/admin', 'Admin\ArticlesController@index')->name('admin.index.all')->middleware('auth');
// Articles : all by parent
Route::get('/admin/{parent_slug}/articles', 'Admin\ArticlesController@index')->name('admin.index')->middleware('auth');
// Articles : ressources
Route::resource('/admin/articles', 'Admin\ArticlesController', ['except' => [
    'create',
    'edit'
]]);
// Articles : create
Route::get('/admin/{parent_slug}/articles/create', 'Admin\ArticlesController@create')->name('admin.articles.create')->middleware('auth');
// Articles : edit
Route::get('/admin/{parent_slug}/articles/{articles}/edit/', 'Admin\ArticlesController@edit')->name('admin.articles.edit')->middleware('auth');
// Articles : reorder
Route::post('/admin/articles/{id}/reorder', 'Admin\ArticlesController@reorder')->name('admin.articles.reorder');

// Medias add
Route::post('/admin/articles/{id?}/addmedia', 'Admin\ArticlesMediasController@addMedia')->name('admin.articles.addmedia');
// Medias delete
Route::post('/admin/articles/{id}/deletemedia', 'Admin\ArticlesMediasController@deletemedia')->name('admin.articles.deletemedia');
// Medias reorder
Route::post('/admin/articles/{id}/reordermedia', 'Admin\ArticlesMediasController@reorderMedia')->name('admin.articles.reordermedia');

// Image une
Route::post('/admin/articles/{id}/addimageune', 'Admin\ArticlesController@addimageune')->name('admin.articles.addimageune');
// Generic
Route::post('/admin/fileupload', 'Admin\MediasController@fileUpload')->name('admin.fileupload')->middleware('auth');

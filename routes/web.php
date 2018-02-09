<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

/*
|--------------------------------------------------------------------------
| Auth
|--------------------------------------------------------------------------
*/

Auth::routes();


// Route::auth(
//   ['except' => ['register']] // désactive register
// );

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/


// Medias delete
Route::post('/admin/articles/{id}/deletemedia', 'Admin\ArticlesMediasController@deleteMedia')->name('admin.articles.deleteMedia');
// Medias add // Many(Gallery)
Route::post('/admin/articles/{id?}/addmanymedia', 'Admin\ArticlesMediasController@addManyMedia')->name('admin.articles.addmanymedia');
// Medias get from array
Route::post('/admin/medias/get', 'Admin\MediasController@getFromArray')->middleware('auth');
// Medias edit
Route::post('/admin/medias/update', 'Admin\MediasController@update')->name('admin.medias.update')->middleware('auth');
// Medias reorder
Route::post('/admin/articles/{id}/reordermedia/{type}', 'Admin\ArticlesMediasController@reorderMedia')->name('admin.articles.reordermedia');
// Generic file upload
Route::post('/admin/fileupload', 'Admin\MediasController@fileUpload')->name('admin.fileupload')->middleware('auth');


// Taxonomies : create
Route::get('/admin/taxonomies/create/{parent_id}', 'Admin\TaxonomiesController@create')->name('taxonomies.create')->middleware('auth');
// Taxonomies : ressources
Route::resource('/admin/taxonomies', 'Admin\TaxonomiesController', ['except' => ['create']]);
// Taxonomies : reorder
Route::post('/admin/taxonomies/reorder/{id}', 'Admin\TaxonomiesController@reorder')->name('taxonomies.reorder');


/*
|--------------------------------------------------------------------------
| Front
|--------------------------------------------------------------------------
*/

// Language switcher
Route::get('lang/{language}', ['as' => 'lang.switch', 'uses' => 'LanguageController@switchLang']);
// Homepage
Route::get('/', 'HomeController@index');
// Article : view
Route::get('/{article_slug}', 'ArticlesController@show')->name('articles.show');

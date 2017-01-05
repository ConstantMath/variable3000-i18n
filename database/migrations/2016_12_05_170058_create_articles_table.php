<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateArticlesTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('articles', function (Blueprint $table) {
      $table->increments('id');
      $table->timestamps();
      $table->string('type');
      $table->string('title');
      $table->string('slug')->unique();
      $table->text('intro');
      $table->text('text');
      $table->integer('order');
      $table->boolean('published')->default(false);
      $table->integer('parent_id')->nullable();
      $table->integer('media_id')->nullable();
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
      Schema::drop('articles');
  }
}

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
      Schema::create('articles', function(Blueprint $table) {
        $table->increments('id');
        $table->string('title');
        $table->string('slug')->unique();
        $table->text('description');
        $table->string('status');
        $table->string('type');
        $table->integer('order');
        $table->string('article_parent');
        $table->timestamps();
        $table->boolean('published')->default(false);
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

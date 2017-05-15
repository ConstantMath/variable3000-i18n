<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTagsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tags', function (Blueprint $table) {
          $table->increments('id');
          $table->integer('parent_id')->nullable();
          $table->string('name');
          $table->string('slug');
          $table->timestamps();
        });

        // Table de pivot
        Schema::create('article_tag', function (Blueprint $table) {
          $table->integer('article_id')->unsigned()->index();
          $table->foreign('article_id')->references('id')->on('articles')->onDelete('cascade');
          $table->integer('tag_id')->unsigned()->index();
          $table->foreign('tag_id')->references('id')->on('tags')->onDelete('cascade');
          $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
      Schema::drop('article_tag');
      Schema::drop('tags');
    }
}
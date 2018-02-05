<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTaxonomiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('taxonomies', function (Blueprint $table) {
          $table->increments('id');
          $table->integer('parent_id')->nullable();
          $table->string('name');
          $table->string('slug');
          $table->timestamps();
        });

        // Table de pivot
        Schema::create('article_taxonomy', function (Blueprint $table) {
          $table->integer('article_id')->unsigned()->index();
          $table->foreign('article_id')->references('id')->on('articles')->onDelete('cascade');
          $table->integer('taxonomy_id')->unsigned()->index();
          $table->foreign('taxonomy_id')->references('id')->on('taxonomies')->onDelete('cascade');
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
      Schema::drop('article_taxonomy');
      Schema::drop('taxonomies');
    }
}

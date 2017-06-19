<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateArticlesTranslationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
     public function up()
     {
         Schema::create('article_translations', function (Blueprint $table) {
           $table->increments('id');
           $table->integer('article_id')->unsigned();
           $table->string('locale')->index();
           $table->string('title');
           $table->string('slug');
           $table->text('intro')->nullable();
           $table->text('text')->nullable();
           $table->unique(['article_id','locale', 'slug']);
           $table->foreign('article_id')->references('id')->on('articles')->onDelete('cascade');
         });

         // Remove translated fields in the main articles table
         Schema::table('articles', function(Blueprint $table){
          $table->dropColumn('title');
          $table->dropColumn('text');
          $table->dropColumn('slug');
          $table->dropColumn('intro');
        });
     }

     /**
      * Reverse the migrations.
      *
      * @return void
      */
     public function down()
     {
         Schema::dropIfExists('article_translations');
     }
}

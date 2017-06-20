<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTagTranslationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::create('tag_translations', function (Blueprint $table) {
        $table->increments('id');
        $table->integer('tag_id')->unsigned();
        $table->string('locale')->index();
        $table->string('name');
        $table->string('slug');
        $table->unique(['tag_id','locale', 'slug']);
        $table->foreign('tag_id')->references('id')->on('tags')->onDelete('cascade');
      });

      // Remove translated fields in the main tags table
      Schema::table('tags', function(Blueprint $table){
       $table->dropColumn('name');
       $table->dropColumn('slug');
     });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
      Schema::dropIfExists('tag_translations');
    }
}

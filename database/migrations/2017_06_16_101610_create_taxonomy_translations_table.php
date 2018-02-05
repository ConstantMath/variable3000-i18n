<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTaxonomyTranslationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::create('taxonomy_translations', function (Blueprint $table) {
        $table->increments('id');
        $table->integer('taxonomy_id')->unsigned();
        $table->string('locale')->index();
        $table->string('name');
        $table->string('slug');
        $table->unique(['taxonomy_id','locale', 'slug']);
        $table->foreign('taxonomy_id')->references('id')->on('taxonomies')->onDelete('cascade');
      });

      // Remove translated fields in the main taxonomies table
      Schema::table('taxonomies', function(Blueprint $table){
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
      Schema::dropIfExists('taxonomy_translations');
    }
}

<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTaxonomyablesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('taxonomyables', function (Blueprint $table) {
          $table->integer('taxonomy_id')->unsigned();
          $table->integer('taxonomyable_id');
          $table->string('taxonomyable_type');
          $table->foreign('taxonomy_id')->references('id')->on('taxonomies')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('taxonomyables');
    }
}

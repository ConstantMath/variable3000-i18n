<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddMediasDimensions extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::table('medias', function(Blueprint $table){
        $table->integer('width')->nullable();
        $table->integer('height')->nullable();
      });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
      Schema::table('medias', function(Blueprint $table){
        $table->dropColumn('width');
        $table->dropColumn('height');
      });
    }
}

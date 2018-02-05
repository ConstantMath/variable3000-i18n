<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddTaxonomiesOrder extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
   public function up()
   {
     Schema::table('taxonomies', function(Blueprint $table){
       $table->integer('order');
  		});
   }

   /**
    * Reverse the migrations.
    *
    * @return void
    */
    public function down(){
     Schema::table('taxonomies', function(Blueprint $table){
      $table->dropColumn('order');
     });
    }
}

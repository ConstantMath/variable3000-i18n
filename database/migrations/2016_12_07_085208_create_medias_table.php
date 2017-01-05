<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMediasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::create('medias', function (Blueprint $table) {
        $table->increments('id');
        $table->string('type');
        $table->string('name');
        $table->string('alt');
        $table->text('description');
        $table->integer('mediatable_id');
        $table->integer('order');
        $table->string('mediatable_type');
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
        Schema::drop('medias');
    }
}

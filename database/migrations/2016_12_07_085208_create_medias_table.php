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
        $table->string('alt')->nullable();
        $table->text('description')->nullable();
        $table->integer('mediatable_id')->nullable();
        $table->integer('order')->nullable();
        $table->string('mediatable_type')->nullable();
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

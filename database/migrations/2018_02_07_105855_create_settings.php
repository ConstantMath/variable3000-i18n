<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSettings extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::create('settings', function(Blueprint $table) {
        $table->increments('id');
        $table->integer('order');
        $table->timestamps();
      });

      Schema::create('setting_translations', function (Blueprint $table) {
        $table->increments('id');
        $table->string('name');
        $table->string('description');
        $table->text('content')->nullable();
        $table->string('locale')->index();
        $table->integer('setting_id')->unsigned();
        $table->unique(['setting_id','locale']);
        $table->foreign('setting_id')->references('id')->on('settings')->onDelete('cascade');
      });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
      Schema::drop('setting_translations');
      Schema::drop('settings');
    }
}

<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePages extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(){
      Schema::create('pages', function(Blueprint $table) {
        $table->increments('id');
        $table->boolean('published')->default(false);
        // These columns are needed for Baum's Nested Set implementation to work.
        // Column names may be changed, but they *must* all exist and be modified
        // in the model.
        // Take a look at the model scaffold comments for details.
        // We add indexes on parent_id, lft, rgt columns by default.
        $table->integer('parent_id')->nullable()->index();
        $table->integer('lft')->nullable()->index();
        $table->integer('rgt')->nullable()->index();
        $table->integer('depth')->nullable();
        $table->timestamps();
      });
      
      Schema::create('page_translations', function (Blueprint $table) {
        $table->increments('id');
        $table->integer('page_id')->unsigned();
        $table->string('locale')->index();
        $table->string('title');
        $table->string('slug');
        $table->text('intro')->nullable();
        $table->text('text')->nullable();
        $table->unique(['page_id','locale', 'slug']);
        $table->foreign('page_id')->references('id')->on('pages')->onDelete('cascade');
      });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(){
      Schema::drop('page_translations');
      Schema::drop('pages');

    }
}

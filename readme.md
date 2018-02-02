# Variable 3000

The [Variable](http://www.variable.club) multilingual admintool build on Laravel 5.5.

[![License](https://poser.pugx.org/laravel/framework/license.svg)](https://packagist.org/packages/laravel/framework)


-----
## Table of Contents

- [Commands](#commands)


-----
<a name="commands"></a>
## Commands

### Installation

To start a new project and generate the environement file (experimental).

      $ php artisan variable3000:install

### Generate a sitemap
Generate a .xml sitemap inside the `public` folder.  
Edit recipes in : `App/Console/commands/GenerateSitemap`.  
Thanks [Spatie.be](https://spatie.be/en), more info here : [laravel-sitemap](https://github.com/spatie/laravel-sitemap)


      $ php artisan sitemap:GenerateSitemap


### Generate a ressource

The project comes with 2 resources : projects & pages, use this to create a new resource ans his dependencies.


      $ php artisan variable3000:generate resource


Edit the database/migrations/1970_01_01_create_xxx_table.php migration file.     

```php

<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateResources extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(){
      Schema::create('resource_translations', function (Blueprint $table) {
        $table->increments('id');
        $table->integer('resource_id')->unsigned();
        $table->string('locale')->index();
        $table->string('title');
        $table->string('slug');
        $table->text('intro')->nullable();
        $table->text('text')->nullable();
        $table->unique(['resource_id','locale', 'slug']);
        $table->foreign('resource_id')->references('id')->on('resources')->onDelete('cascade');
      });

      Schema::create('resources', function(Blueprint $table) {
        $table->increments('id');
        $table->boolean('published')->default(false);
        // These columns are needed for Baum's Nested Set implementation to work.
        // Column names may be changed, but they *must* all exist and be modified
        // in the model.
        // Take a look at the model scaffold comments for details.
        // We add indexes on parent_id, lft, rgt columns by default.
        $table->integer('resource_id')->nullable()->index();
        $table->integer('lft')->nullable()->index();
        $table->integer('rgt')->nullable()->index();
        $table->integer('depth')->nullable();
        $table->timestamps();
      });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(){
      Schema::drop('resource_translations');
      Schema::drop('resources');

    }
}
```

Migrate it

        $ php artisan migrate

Edit the newly created Model:

```php
<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Page extends GenericRessource{
    //
}
```

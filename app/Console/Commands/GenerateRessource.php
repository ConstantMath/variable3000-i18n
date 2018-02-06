<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class GenerateRessource extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'variable3000:generate {resource : The name of the resource - singular}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command to generate a new resource.';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle(){
      list($resource, $table) = [$r = ucfirst($this->argument('resource')), snake_case(str_plural($r))];
      $this->call('make:model', ['name' => $resource]);
      $this->call('make:migration', ['name' => 'create_' . $table . '_table']);
      $this->call('make:controller', ['name' => 'Admin/'. $resource . 'Controller']);
      $this->call('make:controller', ['name' => ''. $resource . 'Controller']);
      $this->call('make:request', ['name' => 'Admin/' . $resource . 'Request']);
    }
}

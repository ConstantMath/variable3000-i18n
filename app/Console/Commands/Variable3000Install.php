<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use DB;
use Exception;
use Illuminate\Filesystem\Filesystem;
use Schema;
use Symfony\Component\Console\Helper\SymfonyQuestionHelper;

class Variable3000Install extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'variable3000:install';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Variable 3000 configuration';

    /**
     * The filesystem instance.
     *
     * @var \Illuminate\Filesystem\Filesystem
     */
    protected $files;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(Filesystem $files)
    {
        parent::__construct();
        $this->files = $files;

    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle(){
      $this->line('');
      $this->line('');
      $this->line('');
      $this->line('         Welcome to Variable 3000');
      $this->line('');
      $this->line('                    °°');
      $this->line('');
      $this->laravel['env'] = 'local';
      // Get the .env file content
      $contents = $this->getKeyFile();
      // Generate an new app key
      $this->call('key:generate');
      // Ask for database name
      $this->info('Setting up database...');
      $dbName = $this->ask('Enter the database name', $this->guessDatabaseName());
      $dbUserName = $this->ask('What is the MySQL username?', 'root');
      $dbPassword = $this->secret('What is the MySQL password?');
      // Update DB credentials in .env file.
      $search = [
        '/('.preg_quote('DB_DATABASE=').')(.*)/',
        '/('.preg_quote('DB_USERNAME=').')(.*)/',
        '/('.preg_quote('DB_PASSWORD=').')(.*)/',
      ];
      $replace = [
          '$1'.$dbName,
          '$1'.$dbUserName,
          '$1'.$dbPassword,
      ];
      $contents = preg_replace($search, $replace, $contents);
      if (!$contents) {
        throw new Exception('Error while writing credentials to .env file.');
      }
      $this->line('Creating database…');
      // Set DB username and password in config
      $this->laravel['config']['database.connections.mysql.username'] = $dbUserName;
      $this->laravel['config']['database.connections.mysql.password'] = $dbPassword;
      // Clear DB name in config
      unset($this->laravel['config']['database.connections.mysql.database']);
      // Force the new login to be used
      DB::purge();
      // Create database if not exists
      DB::unprepared('CREATE DATABASE IF NOT EXISTS `'.$dbName.'`');
      DB::unprepared('USE `'.$dbName.'`');
      DB::connection()->setDatabaseName($dbName);
      $this->line('°°');
      $this->line('Database created');
      // Migration & seed
      if (Schema::hasTable('migrations')) {
          $this->error('A migrations table was found in database ['.$dbName.'], no migration and seed were done.');
      } else {
          $this->line('Migrating…');
          $this->call('migrate');
          $this->line('Seeding…');
          $this->call('db:seed');
      }
      // Done
      $this->line('');
      $this->line('°°');
      $this->line('Done, thank you.');
      $this->line('');
    }


    /**
     * Guess database name from app folder.
     *
     * @return string
     */

    public function guessDatabaseName(){
        try {
            $segments = array_reverse(explode(DIRECTORY_SEPARATOR, app_path()));
            $name = explode('.', $segments[1])[0];

            return str_slug($name);
        } catch (Exception $e) {
            return '';
        }
    }

    /**
     * Get the key file and return its content.
     *
     * @return string
     */
    protected function getKeyFile(){
      return $this->files->exists('.env') ? $this->files->get('.env') : $this->files->get('.env.example');
    }


}

<?php

return array(

    /*
    |--------------------------------------------------------------------------
    | Name of route
    |--------------------------------------------------------------------------
    |
    | Enter the routes name to enable dynamic imagecache manipulation.
    | This handle will define the first part of the URI:
    |
    | {route}/{template}/{filename}
    |
    | Examples: "images", "img/cache"
    |
    */

    'route' => 'imagecache',

    /*
    |--------------------------------------------------------------------------
    | Storage paths
    |--------------------------------------------------------------------------
    |
    | The following paths will be searched for the image filename, submited
    | by URI.
    |
    | Define as many directories as you like.
    |
    */

    'paths' => array(
        // public_path('upload'),
        public_path('medias')
    ),

    /*
    |--------------------------------------------------------------------------
    | Manipulation templates
    |--------------------------------------------------------------------------
    |
    | Here you may specify your own manipulation filter templates.
    | The keys of this array will define which templates
    | are available in the URI:
    |
    | {route}/{template}/{filename}
    |
    | The values of this array will define which filter class
    | will be applied, by its fully qualified name.
    |
    */

    'templates' => array(
        // 'small' => 'Intervention\Image\Templates\Small',
        // 'medium' => 'Intervention\Image\Templates\Medium',
        // 'large' => 'Intervention\Image\Templates\Large',

        'small' => function ($image) {
          $image->resize(800, 800, function ($constraint) {
            $constraint->aspectRatio();
            $constraint->upsize();
          });
          $image->encode('jpg', 60);
          return $image;
        },

        'medium' => function ($image) {
          $image->resize(1200, 1200, function ($constraint) {
            $constraint->aspectRatio();
            $constraint->upsize();
          });
          $image->encode('jpg', 60);
          return $image;
        },

        'large' => function ($image) {
          $image->resize(1600, 1600, function ($constraint) {
            $constraint->aspectRatio();
            $constraint->upsize();
          });
          $image->encode('jpg', 60);
          return $image;
        },
    ),

    /*
    |--------------------------------------------------------------------------
    | Image Cache Lifetime
    |--------------------------------------------------------------------------
    |
    | Lifetime in minutes of the images handled by the imagecache route.
    | 43200 = 30 jours
    |
    */
    'lifetime' => 43200,

);

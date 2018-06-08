/*------------------------------------*\
  #SCRIPTS
\*------------------------------------*/

var $ = require("jquery");

$( document ).ready(function() {
  // scripts
  var attachlazysizes = require('lazysizes');
  var jQueryBridget   = require('jquery-bridget');
  var Flickity        = require('flickity');
  var imagesLoaded    = require('imagesloaded');

  // modules
  require('./modules/_modernizr.js');


  // provide jQuery argument
  imagesLoaded.makeJQueryPlugin( $ );
  // make Flickity a jQuery plugin
  Flickity.setJQuery( $ );
  jQueryBridget( 'flickity', Flickity, $ );
  // now you can use $().flickity()
  $('.article__slideshow').flickity({
    // options
    imagesLoaded: true,
    cellAlign: 'center',
    contain: true,
    pageDots: false,
    wrapAround: true
  });

});

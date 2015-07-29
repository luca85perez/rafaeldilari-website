(function(){

  'use strict';

  var $rollerBlade = $('.js-rollerblade');

  var imagesHome = [
    sitePath +  '/dist/img/home/01.jpg',
    sitePath +  '/dist/img/home/02.jpg',
    sitePath +  '/dist/img/home/03.jpg',
  ];


  function initRollerBlade() {
   $rollerBlade.rollerblade({
      imageArray  : imagesHome,
      sensitivity : 100,
      drag        : false
    });
  }


 //check if viewport > 540px
 var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)

 if ( w > 519 ) {
  initRollerBlade();
 }

})();
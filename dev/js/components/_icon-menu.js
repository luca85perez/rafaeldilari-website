(function(){
  'use strict';

  var $openMenu = $('.js-open-menu');
  var $closeMenu = $('.js-close-menu');
  var $body     = $('body');


  var $siteNav = $('.js-site-nav');



  var changeMenuState = function(){
    if ( $siteNav.hasClass('is-opened') ) {
      $body.removeClass('is-locked');
      $siteNav.removeClass('is-opened');

    } else {
      $body.addClass('is-locked');
      $siteNav.addClass('is-opened');
    }

  };

  $openMenu.click(function(){
    changeMenuState();
    return false;
  });

  $closeMenu.click(function(){
    changeMenuState();
    return false;
  });

})();
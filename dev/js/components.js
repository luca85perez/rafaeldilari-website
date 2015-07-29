jQuery(document).ready(function($) {
;(function() {
  'use strict';

  var $w = $(window);
  var $d = $(document);
  var $btn = $('.js-float-btn');
  var $content = $('.page-header__title');
  var contentTop = $content.offset().top;
  var documentTop;

  $w.smartscroll(function(e){
    documentTop = $d.scrollTop();

    if (documentTop >= contentTop) {
      $btn.addClass('is-visible');
    } else {
      $btn.removeClass('is-visible');
    }
  });

}());
;(function(){
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

})();;(function() {

  var $container = $('.intro-effect-fadeout');

  if ( $container.length ) {

    // detect if IE : from http://stackoverflow.com/a/16657946
    var ie = (function(){
      var undef,rv = -1; // Return value assumes failure.
      var ua = window.navigator.userAgent;
      var msie = ua.indexOf('MSIE ');
      var trident = ua.indexOf('Trident/');

      if (msie > 0) {
        // IE 10 or older => return version number
        rv = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
      } else if (trident > 0) {
        // IE 11 (or newer) => return version number
        var rvNum = ua.indexOf('rv:');
        rv = parseInt(ua.substring(rvNum + 3, ua.indexOf('.', rvNum)), 10);
      }

      return ((rv > -1) ? rv : undef);
    }());


    // disable/enable scroll (mousewheel and keys) from http://stackoverflow.com/a/4770179
    // left: 37, up: 38, right: 39, down: 40,
    // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
    var keys = [32, 37, 38, 39, 40], wheelIter = 0;

    function preventDefault(e) {
      e = e || window.event;
      if (e.preventDefault)
      e.preventDefault();
      e.returnValue = false;
    }

    function keydown(e) {
      for (var i = keys.length; i--;) {
        if (e.keyCode === keys[i]) {
          preventDefault(e);
          return;
        }
      }
    }

    function touchmove(e) {
      preventDefault(e);
    }

    function wheel(e) {
      // for IE
      //if( ie ) {
        //preventDefault(e);
      //}
    }

    function disable_scroll() {
      window.onmousewheel = document.onmousewheel = wheel;
      document.onkeydown = keydown;
      document.body.ontouchmove = touchmove;
    }

    function enable_scroll() {
      window.onmousewheel = document.onmousewheel = document.onkeydown = document.body.ontouchmove = null;
    }

    var docElem = window.document.documentElement,
      scrollVal,
      isRevealed,
      noscroll,
      isAnimating,
      $container = $('.intro-effect-fadeout'),
      trigger = $('.js-trigger-fadeout');

    function scrollY() {
      return window.pageYOffset || docElem.scrollTop;
    }

    function scrollPage() {
      scrollVal = scrollY();

      if( noscroll && !ie ) {
        if( scrollVal < 0 ) return false;
        // keep it that way
        window.scrollTo( 0, 0 );
      }

      // if( $container.hasClass('notrans') ) {
      //   $container.removeClass('notrans');
      //   return false;
      // }

      if( isAnimating ) {
        return false;
      }

      if( scrollVal <= 0 && isRevealed ) {
        toggle(0);
      }
      else if( scrollVal > 0 && !isRevealed ){
        toggle(1);
      }
    }

    function toggle( reveal ) {
      isAnimating = true;

      if( reveal ) {
        $container.addClass('modify');
        effectIntro = false;
      }
      else {
        noscroll = true;
        disable_scroll();
        $container.removeClass('modify');
        effectIntro = true;
      }

      // simulating the end of the transition:
      setTimeout( function() {
        isRevealed = !isRevealed;
        isAnimating = false;
        if( reveal ) {
          noscroll = false;
          enable_scroll();
        }
      }, 600 );
    }

    // refreshing the page...
    var pageScroll = scrollY();
    noscroll = pageScroll === 0;

    disable_scroll();

    if( pageScroll ) {
      isRevealed = true;
      // $container.addClass('notrans');
      $container.addClass('modify');
      effectIntro = false;
    }

    window.addEventListener( 'scroll', scrollPage );

    trigger.click(
      function() {
        toggle( 'reveal' );
      }
    );

  }


})();
;(function() {
  'use strict';

  var $gallery = $('#lightGallery');

  var config =  {
    mode      : 'slide',  // Type of transition between images. Either 'slide' or 'fade'.
    useCSS    : true,     // Whether to always use jQuery animation for transitions or as a fallback.
    cssEasing : 'cubic-bezier(.55,0,.1,1)',   // Value for CSS "transition-timing-function".
    easing    : 'linear', //'for jquery animation',//
    speed     : 400,      // Transition duration (in ms).
    addClass  : '',       // Add custom class for gallery.

    preload         : 2,    //number of preload slides. will exicute only after the current slide is fully loaded. ex:// you clicked on 4th image and if preload = 1 then 3rd slide and 5th slide will be loaded in the background after the 4th slide is fully loaded.. if preload is 2 then 2nd 3rd 5th 6th slides will be preloaded.. ... ...
    showAfterLoad   : true,  // Show Content once it is fully loaded.
    selector        : null,  // Custom selector property insted of just child.
    index           : false, // Allows to set which image/video should load when using dynamicEl.

    dynamic   : false, // Set to true to build a gallery based on the data from "dynamicEl" opt.
    dynamicEl : [],    // Array of objects (src, thumb, caption, desc, mobileSrc) for gallery els.

    thumbnail            : true,     // Whether to display a button to show thumbnails.
    showThumbByDefault   : false,    // Whether to display thumbnails by default..
    exThumbImage         : false,    // Name of a "data-" attribute containing the paths to thumbnails.
    animateThumb         : true,     // Enable thumbnail animation.
    currentPagerPosition : 'middle', // Position of selected thumbnail.
    thumbWidth           : 100,      // Width of each thumbnails
    thumbMargin          : 5,        // Spacing between each thumbnails

    controls         : true,  // Whether to display prev/next buttons.
    hideControlOnEnd : false, // If true, prev/next button will be hidden on first/last image.
    loop             : true, // Allows to go to the other end of the gallery at first/last img.
    auto             : false, // Enables slideshow mode.
    pause            : 4000,  // Delay (in ms) between transitions in slideshow mode.
    escKey           : true,  // Whether lightGallery should be closed when user presses "Esc".
    closable         : true,  //allows clicks on dimmer to close gallery

    counter      : false, // Shows total number of images and index number of current image.
    lang         : { allPhotos: 'Todas as imagens' }, // Text of labels.

    mobileSrc         : false, // If "data-responsive-src" attr. should be used for mobiles.
    mobileSrcMaxWidth : 640,   // Max screen resolution for alternative images to be loaded for.
    swipeThreshold    : 50,    // How far user must swipe for the next/prev image (in px).
    enableTouch       : true,  // Enables touch support
    enableDrag        : true,  // Enables desktop mouse drag support

    vimeoColor    : 'CCCCCC', // Vimeo video player theme color (hex color code).
    youtubePlayerParams: false, // See: https://developers.google.com/youtube/player_parameters
    videoAutoplay : true,     // Set to false to disable video autoplay option.
    videoMaxWidth : '855px',  // Limits video maximal width (in px).

    // Callbacks el = current plugin object
    onOpen        : function(el) {}, // Executes immediately after the gallery is loaded.
    onSlideBefore : function(el) {}, // Executes immediately before each transition.
    onSlideAfter  : function(el) {}, // Executes immediately after each transition.
    onSlideNext   : function(el) {}, // Executes immediately before each "Next" transition.
    onSlidePrev   : function(el) {}, // Executes immediately before each "Prev" transition.
    onBeforeClose : function(el) {}, // Executes immediately before the start of the close process.
    onCloseAfter  : function(el) {}, // Executes immediately once lightGallery is closed.

    };

  $gallery.lightGallery(config);
}());
;(function($) {
  'use strict';

  var $body = $('body');
  var $container = $('.js-grid');
  var $trigger = $('.js-trigger-fadeout');

  var filterClicked = false;

  var config = {
    load: {
		  filter: 'all'
	  },
    layout: {
		  display: 'block'
	  },
    animation: {
      easing: 'cubic-bezier(.55,0,.1,1)'
    },
    selectors: {
		  target: '.js-grid-item',
      filter: '.js-filter'
	  },
    callbacks: {
      onMixLoad: null,
      onMixEnd: function(){
        if (effectIntro && filterClicked) {
          requestAnimationFrame(fakeScroll);
          effectIntro = false;

          setTimeout( function() {
            requestAnimationFrame(scrollBody);
          }, 600 );
        } else if (filterClicked) {
          requestAnimationFrame(scrollBody);
        }
      }
    }
  };
  $container.mixItUp(config);


  var $title = $('.js-grid-title');
  var changeTitle = function(newTitle) {
    $title.html(newTitle);
    return $title;
  };


  var $filterBtns = $('.js-filter');
  $filterBtns.on('click', function(){
    filterClicked = true;
    changeTitle($(this).html());
    return true;
  });

  var headerHeight = 70;
  var scrollBody = function() {
    $body.animate({
      scrollTop: $title.offset().top - headerHeight
    }, 600);
  };

  var fakeScroll = function() {
    $trigger.trigger('click');
  };



}($));
;(function(){

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

})();;(function () {

  window.sr = new scrollReveal();

})();;
});
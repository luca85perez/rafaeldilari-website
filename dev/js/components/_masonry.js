(function($, masonryFilter) {
  'use strict';

  var $body = $('body');
  var $container = $('.js-grid');
  var $trigger = $('.js-trigger-fadeout');

  var filterClicked = false;
  var masonryFilter = masonryFilter || 'all';

  var config = {
    load: {
		  filter: masonryFilter
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

  $filterBtns.each

  $filterBtns.each(function() {
    if ( $(this).hasClass('active') ) {
      changeTitle( $(this).html() );
    }
  });



}($, masonryFilter));

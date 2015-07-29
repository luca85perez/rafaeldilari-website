/*
                       _ _ _____                      _   _
                      | | |  __ \                    | | (_)
    ___  ___ _ __ ___ | | | |__) |_____   _____  __ _| |  _ ___
   / __|/ __| '__/ _ \| | |  _  // _ \ \ / / _ \/ _` | | | / __|
   \__ \ (__| | | (_) | | | | \ \  __/\ V /  __/ (_| | |_| \__ \
   |___/\___|_|  \___/|_|_|_|  \_\___| \_/ \___|\__,_|_(_) |___/ v2.3.2
                                                        _/ |
                                                       |__/

================================================================================

   scrollReveal.js (c) 2015 Julian Lloyd ( @julianlloyd )
   Licensed under MIT ( http://www.opensource.org/licenses/mit-license.php )

==============================================================================*/

window.scrollReveal = (function( window ){

  'use strict';

  var _requestAnimFrame;
  var _extend;
  var _handler;
  var self;

  function scrollReveal( config ){

    if ( !( this instanceof scrollReveal ) ) {
      return new scrollReveal( config );
    }

    self         = this;
    self.elems   = {};
    self.serial  = 1;
    self.blocked = false;
    self.config  = _extend( self.defaults, config );

    if ( self.isMobile() && !self.config.mobile || !self.isSupported() ){
      self.destroy();
      return;
    }

    if ( self.config.viewport === window.document.documentElement ){

      window.addEventListener( 'scroll', _handler, false );
      window.addEventListener( 'resize', _handler, false );

    } else {
      self.config.viewport.addEventListener( 'scroll', _handler, false );
    }

    self.init( true );
  }

  scrollReveal.prototype = {

    defaults: {

      enter:    'bottom',
      move:     '8px',
      over:     '0.6s',
      wait:     '0s',
      easing:   'ease',

      scale:    { direction: 'up', power: '5%' },
      rotate:   { x: 0, y: 0, z: 0 },

      opacity:  0,
      mobile:   false,
      reset:    false,

      //        Expects a reference to a DOM node (the <html> node by default)
      //        which is used as the context when checking element visibility.
      viewport: window.document.documentElement,

      //        'always' — delay every time an animation resets
      //        'onload' - delay only for animations triggered by first load
      //        'once'   — delay only the first time an animation reveals
      delay:    'once',

      //        vFactor changes when an element is considered in the viewport.
      //        The default value of 0.60 means 60% of an element must be
      //        visible for its reveal animation to trigger.
      vFactor:  0.60,

      complete: function( el ){} // Note: reset animations do not complete.
    },

    // Queries the DOM, builds scrollReveal elements and triggers animation.
    // @param {boolean} flag — a hook for controlling delay on first load.
    init: function( flag ){

      var serial;
      var elem;
      var query;

      query = Array.prototype.slice.call( self.config.viewport.querySelectorAll('[data-sr]') );
      query.forEach(function( el ){

        serial      = self.serial++;
        elem        = self.elems[ serial ] = { domEl: el };
        elem.config = self.configFactory( elem );
        elem.styles = self.styleFactory( elem );
        elem.seen   = false;

        el.removeAttribute('data-sr');

        el.setAttribute( 'style',
            elem.styles.inline
          + elem.styles.initial
        );
      })

      self.scrolled = self.scrollY();
      self.animate( flag );
    },

    // Applies and removes appropriate styles.
    // @param {boolean} flag — a hook for controlling delay on first load.
    animate: function( flag ){

      var key;
      var elem;
      var visible;

      // Begin element store digest.
      for ( key in self.elems ){
        if ( self.elems.hasOwnProperty( key ) ){

          elem    = self.elems[ key ];
          visible = self.isElemInViewport( elem );

          if ( visible ){

            if ( self.config.delay === 'always'
            || ( self.config.delay === 'onload' && flag )
            || ( self.config.delay === 'once'   && !elem.seen ) ){

              // Use delay.
              elem.domEl.setAttribute( 'style',
                  elem.styles.inline
                + elem.styles.target
                + elem.styles.transition
              );

            } else {

              // Don’t use delay.
              elem.domEl.setAttribute( 'style',
                  elem.styles.inline
                + elem.styles.target
                + elem.styles.reset
              );
            }

            elem.seen = true;

            if ( !elem.config.reset && !elem.animating ){
              elem.animating = true;
              complete( key );
            }

          } else if ( !visible && elem.config.reset ){

            elem.domEl.setAttribute( 'style',
                elem.styles.inline
              + elem.styles.initial
              + elem.styles.reset
            );
          }
        }
      }

      // Digest complete, now un-block the event handler.
      self.blocked = false;

      // Cleans the DOM and removes completed elements from self.elems.
      // @param {integer} key — self.elems property key.
      function complete( key ){

        var elem = self.elems[ key ];

        setTimeout(function(){

          elem.domEl.setAttribute( 'style', elem.styles.inline );
          elem.config.complete( elem.domEl );
          delete self.elems[ key ];

        }, elem.styles.duration );
      }
    },

    // Parses an elements data-sr attribute, and returns a configuration object.
    // @param {object} elem — An object from self.elems.
    // @return {object}
    configFactory: function( elem ){

      var parsed = {};
      var config = {};
      var words  = elem.domEl.getAttribute('data-sr').split( /[, ]+/ );

      words.forEach(function( keyword, i ){
        switch ( keyword ){

          case 'enter':

            parsed.enter = words[ i + 1 ];
            break;

          case 'wait':

            parsed.wait = words[ i + 1 ];
            break;

          case 'move':

            parsed.move = words[ i + 1 ];
            break;

          case 'ease':

            parsed.move = words[ i + 1 ];
            parsed.ease = 'ease';
            break;

          case 'ease-in':

            if ( words[ i + 1 ] == 'up' || words[ i + 1 ] == 'down' ){

              parsed.scale.direction = words[ i + 1 ];
              parsed.scale.power     = words[ i + 2 ];
              parsed.easing          = 'ease-in';
              break;
            }

            parsed.move   = words[ i + 1 ];
            parsed.easing = 'ease-in';
            break;

          case 'ease-in-out':

            if ( words[ i + 1 ] == 'up' || words[ i + 1 ] == 'down' ){

              parsed.scale.direction = words[ i + 1 ];
              parsed.scale.power     = words[ i + 2 ];
              parsed.easing          = 'ease-in-out';
              break;
            }

            parsed.move   = words[ i + 1 ];
            parsed.easing = 'ease-in-out';
            break;

          case 'ease-out':

            if ( words[ i + 1 ] == 'up' || words[ i + 1 ] == 'down' ){

              parsed.scale.direction = words[ i + 1 ];
              parsed.scale.power     = words[ i + 2 ];
              parsed.easing          = 'ease-out';
              break;
            }

            parsed.move   = words[ i + 1 ];
            parsed.easing = 'ease-out';
            break;

          case 'hustle':

            if ( words[ i + 1 ] == 'up' || words[ i + 1 ] == 'down' ){

              parsed.scale.direction = words[ i + 1 ];
              parsed.scale.power     = words[ i + 2 ];
              parsed.easing          = 'cubic-bezier( 0.6, 0.2, 0.1, 1 )';
              break;
            }

            parsed.move   = words[ i + 1 ];
            parsed.easing = 'cubic-bezier( 0.6, 0.2, 0.1, 1 )';
            break;

          case 'over':

            parsed.over = words[ i + 1 ];
            break;

          case 'flip':
          case 'pitch':
            parsed.rotate   = parsed.rotate || {};
            parsed.rotate.x = words[ i + 1 ];
            break;

          case 'spin':
          case 'yaw':
            parsed.rotate   = parsed.rotate || {};
            parsed.rotate.y = words[ i + 1 ];
            break;

          case 'roll':
            parsed.rotate   = parsed.rotate || {};
            parsed.rotate.z = words[ i + 1 ];
            break;

          case 'reset':

            if ( words[ i - 1 ] == 'no' ){
              parsed.reset = false;
            } else {
              parsed.reset = true;
            }
            break;

          case 'scale':

            parsed.scale = {};

            if ( words[ i + 1 ] == 'up' || words[ i + 1 ] == 'down' ){

              parsed.scale.direction = words[ i + 1 ];
              parsed.scale.power     = words[ i + 2 ];
              break;
            }

            parsed.scale.power = words[ i + 1 ];
            break;

          case 'vFactor':
          case 'vF':
            parsed.vFactor = words[ i + 1 ];
            break;

          case 'opacity':
            parsed.opacity = words[ i + 1 ];
            break;

          default:
            return;
        }
      });

      // Build default config object, then apply any keywords parsed from the
      // data-sr attribute.
      config = _extend( config, self.config );
      config = _extend( config, parsed );

      if ( config.enter === 'top' || config.enter === 'bottom' ){
        config.axis = 'Y';
      } else if ( config.enter === 'left' || config.enter === 'right' ){
        config.axis = 'X';
      }

      // Let’s make sure our our pixel distances are negative for top and left.
      // e.g. "enter top and move 25px" starts at 'top: -25px' in CSS.
      if ( config.enter === 'top' || config.enter === 'left' ){
        config.move = '-' + config.move;
      }

      return config;
    },

    // Generates styles based on an elements configuration property.
    // @param {object} elem — An object from self.elems.
    // @return {object}
    styleFactory: function( elem ){

      var inline;
      var initial;
      var reset;
      var target;
      var transition;

      var cfg      = elem.config;
      var duration = ( parseFloat( cfg.over ) + parseFloat( cfg.wait ) ) * 1000;

      // Want to disable delay on mobile devices? Uncomment the line below.
      // if ( self.isMobile() && self.config.mobile ) cfg.wait = 0;

      if ( elem.domEl.getAttribute('style') ){
        inline = elem.domEl.getAttribute('style') + '; visibility: visible; ';
      } else {
        inline = 'visibility: visible; ';
      }

      transition = '-webkit-transition: -webkit-transform ' + cfg.over + ' ' + cfg.easing + ' ' + cfg.wait + ', opacity ' + cfg.over + ' ' + cfg.easing + ' ' + cfg.wait + '; ' +
                           'transition: transform '         + cfg.over + ' ' + cfg.easing + ' ' + cfg.wait + ', opacity ' + cfg.over + ' ' + cfg.easing + ' ' + cfg.wait + '; ' +
                  '-webkit-perspective: 1000;' +
          '-webkit-backface-visibility: hidden;';

      reset      = '-webkit-transition: -webkit-transform ' + cfg.over + ' ' + cfg.easing + ' 0s, opacity ' + cfg.over + ' ' + cfg.easing + ' 0s; ' +
                           'transition: transform '         + cfg.over + ' ' + cfg.easing + ' 0s, opacity ' + cfg.over + ' ' + cfg.easing + ' 0s; ' +
                  '-webkit-perspective: 1000; ' +
          '-webkit-backface-visibility: hidden; ';

      initial = 'transform:';
      target  = 'transform:';
      build();

      // Build again for webkit…
      initial += '-webkit-transform:';
      target  += '-webkit-transform:';
      build();

      return {
        transition: transition,
        initial:    initial,
        target:     target,
        reset:      reset,
        inline:     inline,
        duration:   duration
      };

      // Constructs initial and target styles.
      function build(){

        if ( parseInt( cfg.move ) !== 0 ){
          initial += ' translate' + cfg.axis + '(' + cfg.move + ')';
          target  += ' translate' + cfg.axis + '(0)';
        }

        if ( parseInt( cfg.scale.power ) !== 0 ){

          if ( cfg.scale.direction === 'up' ){
            cfg.scale.value = 1 - ( parseFloat( cfg.scale.power ) * 0.01 );
          } else if ( cfg.scale.direction === 'down' ){
            cfg.scale.value = 1 + ( parseFloat( cfg.scale.power ) * 0.01 );
          }

          initial += ' scale(' + cfg.scale.value + ')';
          target  += ' scale(1)';
        }

        if ( cfg.rotate.x ){
          initial += ' rotateX(' + cfg.rotate.x + ')';
          target  += ' rotateX(0)';
        }

        if ( cfg.rotate.y ){
          initial += ' rotateY(' + cfg.rotate.y + ')';
          target  += ' rotateY(0)';
        }

        if ( cfg.rotate.z ){
          initial += ' rotateZ(' + cfg.rotate.z + ')';
          target  += ' rotateZ(0)';
        }

        initial += '; opacity: ' + cfg.opacity + '; ';
        target  += '; opacity: 1; ';
      }
    },

    getViewportH: function(){

      var client = self.config.viewport['clientHeight'];
      var inner  = window['innerHeight'];

      if ( self.config.viewport === window.document.documentElement ){
        return ( client < inner ) ? inner : client;
      }

      return client;
    },

    scrollY: function(){
      if ( self.config.viewport === window.document.documentElement ){
        return window.pageYOffset;
      } else {
        return self.config.viewport.scrollTop + self.config.viewport.offsetTop;
      }
    },

    getOffset: function( el ){

      var offsetTop  = 0;
      var offsetLeft = 0;

      do {
        if ( !isNaN( el.offsetTop ) ){
          offsetTop  += el.offsetTop;
        }
        if ( !isNaN( el.offsetLeft ) ){
          offsetLeft += el.offsetLeft;
        }
      } while ( el = el.offsetParent );

      return {
        top: offsetTop,
        left: offsetLeft
      };
    },

    isElemInViewport: function( elem ){

      var elHeight = elem.domEl.offsetHeight;
      var elTop    = self.getOffset( elem.domEl ).top;
      var elBottom = elTop + elHeight;
      var vFactor  = elem.config.vFactor || 0;

      return ( confirmBounds() || isPositionFixed() );

      function confirmBounds(){

        var top        = elTop + elHeight * vFactor;
        var bottom     = elBottom - elHeight * vFactor;
        var viewBottom = self.scrolled + self.getViewportH();
        var viewTop    = self.scrolled;

        return ( top < viewBottom ) && ( bottom > viewTop );
      }

      function isPositionFixed(){

        var el    = elem.domEl;
        var style = el.currentStyle || window.getComputedStyle( el, null );

        return style.position === 'fixed';
      }
    },

    isMobile: function(){

      var agent = navigator.userAgent || navigator.vendor || window.opera;

      return (/(ipad|playbook|silk|android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test( agent )||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test( agent.substr( 0, 4 ))) ? true : false;
    },

    isSupported: function(){

      var sensor    = document.createElement('sensor');
      var cssPrefix = 'Webkit,Moz,O,'.split(',');
      var tests     = ( 'transition ' + cssPrefix.join('transition,') ).split(',');

      for ( var i = 0; i < tests.length; i++ ){
        if ( !sensor.style[tests[i]] === '' ){
          return false;
        }
      }

      return true;
    },

    destroy: function(){

      var node = self.config.viewport;
      var query = Array.prototype.slice.call( node.querySelectorAll('[data-sr]') );

      query.forEach(function( el ){
        el.removeAttribute('data-sr');
      });
    }
  } // End of the scrollReveal prototype ======================================|

  _handler = function( e ){

    if ( !self.blocked ){

      self.blocked  = true;
      self.scrolled = self.scrollY();

      _requestAnimFrame(function(){
        self.animate();
      });
    }
  }

  _extend = function( target, src ){

    for ( var prop in src ){
      if ( src.hasOwnProperty( prop ) ){
        target[ prop ] = src[ prop ];
      }
    }

    return target;
  }

  // RequestAnimationFrame polyfill.
  _requestAnimFrame = (function(){

    return window.requestAnimationFrame        ||
           window.webkitRequestAnimationFrame  ||
           window.mozRequestAnimationFrame     ||

          function( callback ){
            window.setTimeout( callback, 1000 / 60 );
          };
  }());

  return scrollReveal;

})( window );
;/**!
 * MixItUp v2.1.9
 *
 * @copyright Copyright 2015 KunkaLabs Limited.
 * @author    KunkaLabs Limited.
 * @link      https://mixitup.kunkalabs.com
 *
 * @license   Commercial use requires a commercial license.
 *            https://mixitup.kunkalabs.com/licenses/
 *
 *            Non-commercial use permitted under terms of CC-BY-NC license.
 *            http://creativecommons.org/licenses/by-nc/3.0/
 */

(function($, undf){
	
	/**
	 * MixItUp Constructor Function
	 * @constructor
	 * @extends jQuery
	 */
	
	$.MixItUp = function(){
		var self = this;
		
		self._execAction('_constructor', 0);
		
		$.extend(self, {
			
			/* Public Properties
			---------------------------------------------------------------------- */
			
			selectors: {
				target: '.mix',
				filter: '.filter',
				sort: '.sort'
			},
				
			animation: {
				enable: true,
				effects: 'fade scale',
				duration: 600,
				easing: 'ease',
				perspectiveDistance: '3000',
				perspectiveOrigin: '50% 50%',
				queue: true,
				queueLimit: 1,
				animateChangeLayout: false,
				animateResizeContainer: true,
				animateResizeTargets: false,
				staggerSequence: false,
				reverseOut: false
			},
				
			callbacks: {
				onMixLoad: false,
				onMixStart: false,
				onMixBusy: false,
				onMixEnd: false,
				onMixFail: false,
				_user: false
			},
				
			controls: {
				enable: true,
				live: false,
				toggleFilterButtons: false,
				toggleLogic: 'or',
				activeClass: 'active'
			},

			layout: {
				display: 'inline-block',
				containerClass: '',
				containerClassFail: 'fail'
			},
			
			load: {
				filter: 'all',
				sort: false
			},
			
			/* Private Properties
			---------------------------------------------------------------------- */
				
			_$body: null,
			_$container: null,
			_$targets: null,
			_$parent: null,
			_$sortButtons: null,
			_$filterButtons: null,
		
			_suckMode: false,
			_mixing: false,
			_sorting: false,
			_clicking: false,
			_loading: true,
			_changingLayout: false,
			_changingClass: false,
			_changingDisplay: false,
			
			_origOrder: [],
			_startOrder: [],
			_newOrder: [],
			_activeFilter: null,
			_toggleArray: [],
			_toggleString: '',
			_activeSort: 'default:asc',
			_newSort: null,
			_startHeight: null,
			_newHeight: null,
			_incPadding: true,
			_newDisplay: null,
			_newClass: null,
			_targetsBound: 0,
			_targetsDone: 0,
			_queue: [],
				
			_$show: $(),
			_$hide: $()
		});
	
		self._execAction('_constructor', 1);
	};
	
	/**
	 * MixItUp Prototype
	 * @override
	 */
	
	$.MixItUp.prototype = {
		constructor: $.MixItUp,
		
		/* Static Properties
		---------------------------------------------------------------------- */
		
		_instances: {},
		_handled: {
			_filter: {},
			_sort: {}
		},
		_bound: {
			_filter: {},
			_sort: {}
		},
		_actions: {},
		_filters: {},
		
		/* Static Methods
		---------------------------------------------------------------------- */
		
		/**
		 * Extend
		 * @since 2.1.0
		 * @param {object} new properties/methods
		 * @extends {object} prototype
		 */
		
		extend: function(extension){
			for(var key in extension){
				$.MixItUp.prototype[key] = extension[key];
			}
		},
		
		/**
		 * Add Action
		 * @since 2.1.0
		 * @param {string} hook name
		 * @param {string} namespace
		 * @param {function} function to execute
		 * @param {number} priority
		 * @extends {object} $.MixItUp.prototype._actions
		 */
		
		addAction: function(hook, name, func, priority){
			$.MixItUp.prototype._addHook('_actions', hook, name, func, priority);
		},
		
		/**
		 * Add Filter
		 * @since 2.1.0
		 * @param {string} hook name
		 * @param {string} namespace
		 * @param {function} function to execute
		 * @param {number} priority
		 * @extends {object} $.MixItUp.prototype._filters
		 */
		
		addFilter: function(hook, name, func, priority){
			$.MixItUp.prototype._addHook('_filters', hook, name, func, priority);
		},
		
		/**
		 * Add Hook
		 * @since 2.1.0
		 * @param {string} type of hook
		 * @param {string} hook name
		 * @param {function} function to execute
		 * @param {number} priority
		 * @extends {object} $.MixItUp.prototype._filters
		 */
		
		_addHook: function(type, hook, name, func, priority){
			var collection = $.MixItUp.prototype[type],
				obj = {};
				
			priority = (priority === 1 || priority === 'post') ? 'post' : 'pre';
				
			obj[hook] = {};
			obj[hook][priority] = {};
			obj[hook][priority][name] = func;

			$.extend(true, collection, obj);
		},
		
		
		/* Private Methods
		---------------------------------------------------------------------- */
		
		/**
		 * Initialise
		 * @since 2.0.0
		 * @param {object} domNode
		 * @param {object} config
		 */
		
		_init: function(domNode, config){
			var self = this;
			
			self._execAction('_init', 0, arguments);
			
			config && $.extend(true, self, config);
			
			self._$body = $('body');
			self._domNode = domNode;
			self._$container = $(domNode);
			self._$container.addClass(self.layout.containerClass);
			self._id = domNode.id;
			
			self._platformDetect();
			
			self._brake = self._getPrefixedCSS('transition', 'none');
			
			self._refresh(true);
			
			self._$parent = self._$targets.parent().length ? self._$targets.parent() : self._$container;
			
			if(self.load.sort){
				self._newSort = self._parseSort(self.load.sort);
				self._newSortString = self.load.sort;
				self._activeSort = self.load.sort;
				self._sort();
				self._printSort();
			}
			
			self._activeFilter = self.load.filter === 'all' ? 
				self.selectors.target : 
				self.load.filter === 'none' ?
					'' :
					self.load.filter;
			
			self.controls.enable && self._bindHandlers();
			
			if(self.controls.toggleFilterButtons){
				self._buildToggleArray();
				
				for(var i = 0; i < self._toggleArray.length; i++){
					self._updateControls({filter: self._toggleArray[i], sort: self._activeSort}, true);
				};
			} else if(self.controls.enable){
				self._updateControls({filter: self._activeFilter, sort: self._activeSort});
			}
			
			self._filter();
			
			self._init = true;
			
			self._$container.data('mixItUp',self);
			
			self._execAction('_init', 1, arguments);
			
			self._buildState();
			
			self._$targets.css(self._brake);
		
			self._goMix(self.animation.enable);
		},
		
		/**
		 * Platform Detect
		 * @since 2.0.0
		 */
		
		_platformDetect: function(){
			var self = this,
				vendorsTrans = ['Webkit', 'Moz', 'O', 'ms'],
				vendorsRAF = ['webkit', 'moz'],
				chrome = window.navigator.appVersion.match(/Chrome\/(\d+)\./) || false,
				ff = typeof InstallTrigger !== 'undefined',
				prefix = function(el){
					for (var i = 0; i < vendorsTrans.length; i++){
						if (vendorsTrans[i] + 'Transition' in el.style){
							return {
								prefix: '-'+vendorsTrans[i].toLowerCase()+'-',
								vendor: vendorsTrans[i]
							};
						};
					}; 
					return 'transition' in el.style ? '' : false;
				},
				transPrefix = prefix(self._domNode);
				
			self._execAction('_platformDetect', 0);
			
			self._chrome = chrome ? parseInt(chrome[1], 10) : false;
			self._ff = ff ? parseInt(window.navigator.userAgent.match(/rv:([^)]+)\)/)[1]) : false;
			self._prefix = transPrefix.prefix;
			self._vendor = transPrefix.vendor;
			self._suckMode = window.atob && self._prefix ? false : true;

			self._suckMode && (self.animation.enable = false);
			(self._ff && self._ff <= 4) && (self.animation.enable = false);
			
			/* Polyfills
			---------------------------------------------------------------------- */
			
			/**
			 * window.requestAnimationFrame
			 */
			
			for(var x = 0; x < vendorsRAF.length && !window.requestAnimationFrame; x++){
				window.requestAnimationFrame = window[vendorsRAF[x]+'RequestAnimationFrame'];
			}

			/**
			 * Object.getPrototypeOf
			 */

			if(typeof Object.getPrototypeOf !== 'function'){
				if(typeof 'test'.__proto__ === 'object'){
					Object.getPrototypeOf = function(object){
						return object.__proto__;
					};
				} else {
					Object.getPrototypeOf = function(object){
						return object.constructor.prototype;
					};
				}
			}

			/**
			 * Element.nextElementSibling
			 */
			
			if(self._domNode.nextElementSibling === undf){
				Object.defineProperty(Element.prototype, 'nextElementSibling',{
					get: function(){
						var el = this.nextSibling;
						
						while(el){
							if(el.nodeType ===1){
								return el;
							}
							el = el.nextSibling;
						}
						return null;
					}
				});
			}
			
			self._execAction('_platformDetect', 1);
		},
		
		/**
		 * Refresh
		 * @since 2.0.0
		 * @param {boolean} init
		 * @param {boolean} force
		 */
		
		_refresh: function(init, force){
			var self = this;
				
			self._execAction('_refresh', 0, arguments);

			self._$targets = self._$container.find(self.selectors.target);
			
			for(var i = 0; i < self._$targets.length; i++){
				var target = self._$targets[i];
					
				if(target.dataset === undf || force){
						
					target.dataset = {};
					
					for(var j = 0; j < target.attributes.length; j++){
						
						var attr = target.attributes[j],
							name = attr.name,
							val = attr.value;
							
						if(name.indexOf('data-') > -1){
							var dataName = self._helpers._camelCase(name.substring(5,name.length));
							target.dataset[dataName] = val;
						}
					}
				}
				
				if(target.mixParent === undf){
					target.mixParent = self._id;
				}
			}
			
			if(
				(self._$targets.length && init) ||
				(!self._origOrder.length && self._$targets.length)
			){
				self._origOrder = [];
				
				for(var i = 0; i < self._$targets.length; i++){
					var target = self._$targets[i];
					
					self._origOrder.push(target);
				}
			}
			
			self._execAction('_refresh', 1, arguments);
		},
		
		/**
		 * Bind Handlers
		 * @since 2.0.0
		 */
		
		_bindHandlers: function(){
			var self = this,
				filters = $.MixItUp.prototype._bound._filter,
				sorts = $.MixItUp.prototype._bound._sort;
			
			self._execAction('_bindHandlers', 0);
			
			if(self.controls.live){
				self._$body
					.on('click.mixItUp.'+self._id, self.selectors.sort, function(){
						self._processClick($(this), 'sort');
					})
					.on('click.mixItUp.'+self._id, self.selectors.filter, function(){
						self._processClick($(this), 'filter');
					});
			} else {
				self._$sortButtons = $(self.selectors.sort);
				self._$filterButtons = $(self.selectors.filter);
				
				self._$sortButtons.on('click.mixItUp.'+self._id, function(){
					self._processClick($(this), 'sort');
				});
				
				self._$filterButtons.on('click.mixItUp.'+self._id, function(){
					self._processClick($(this), 'filter');
				});
			}

			filters[self.selectors.filter] = (filters[self.selectors.filter] === undf) ? 1 : filters[self.selectors.filter] + 1;
			sorts[self.selectors.sort] = (sorts[self.selectors.sort] === undf) ? 1 : sorts[self.selectors.sort] + 1;
			
			self._execAction('_bindHandlers', 1);
		},
		
		/**
		 * Process Click
		 * @since 2.0.0
		 * @param {object} $button
		 * @param {string} type
		 */
		
		_processClick: function($button, type){
			var self = this,
				trackClick = function($button, type, off){
					var proto = $.MixItUp.prototype;
						
					proto._handled['_'+type][self.selectors[type]] = (proto._handled['_'+type][self.selectors[type]] === undf) ? 
						1 : 
						proto._handled['_'+type][self.selectors[type]] + 1;

					if(proto._handled['_'+type][self.selectors[type]] === proto._bound['_'+type][self.selectors[type]]){
						$button[(off ? 'remove' : 'add')+'Class'](self.controls.activeClass);
						delete proto._handled['_'+type][self.selectors[type]];
					}
				};
			
			self._execAction('_processClick', 0, arguments);
			
			if(!self._mixing || (self.animation.queue && self._queue.length < self.animation.queueLimit)){
				self._clicking = true;
				
				if(type === 'sort'){
					var sort = $button.attr('data-sort');
					
					if(!$button.hasClass(self.controls.activeClass) || sort.indexOf('random') > -1){
						$(self.selectors.sort).removeClass(self.controls.activeClass);
						trackClick($button, type);
						self.sort(sort);
					}
				}
				
				if(type === 'filter') {
					var filter = $button.attr('data-filter'),
						ndx,
						seperator = self.controls.toggleLogic === 'or' ? ',' : '';
					
					if(!self.controls.toggleFilterButtons){
						if(!$button.hasClass(self.controls.activeClass)){
							$(self.selectors.filter).removeClass(self.controls.activeClass);
							trackClick($button, type);
							self.filter(filter);
						}
					} else {
						self._buildToggleArray();
						
						if(!$button.hasClass(self.controls.activeClass)){
							trackClick($button, type);
							
							self._toggleArray.push(filter);
						} else {
							trackClick($button, type, true);
							ndx = self._toggleArray.indexOf(filter);
							self._toggleArray.splice(ndx, 1);
						}
						
						self._toggleArray = $.grep(self._toggleArray,function(n){return(n);});
						
						self._toggleString = self._toggleArray.join(seperator);

						self.filter(self._toggleString);
					}
				}
				
				self._execAction('_processClick', 1, arguments);
			} else {
				if(typeof self.callbacks.onMixBusy === 'function'){
					self.callbacks.onMixBusy.call(self._domNode, self._state, self);
				}
				self._execAction('_processClickBusy', 1, arguments);
			}
		},
		
		/**
		 * Build Toggle Array
		 * @since 2.0.0
		 */
		
		_buildToggleArray: function(){
			var self = this,
				activeFilter = self._activeFilter.replace(/\s/g, '');
			
			self._execAction('_buildToggleArray', 0, arguments);
			
			if(self.controls.toggleLogic === 'or'){
				self._toggleArray = activeFilter.split(',');
			} else {
				self._toggleArray = activeFilter.split('.');
				
				!self._toggleArray[0] && self._toggleArray.shift();
				
				for(var i = 0, filter; filter = self._toggleArray[i]; i++){
					self._toggleArray[i] = '.'+filter;
				}
			}
			
			self._execAction('_buildToggleArray', 1, arguments);
		},
		
		/**
		 * Update Controls
		 * @since 2.0.0
		 * @param {object} command
		 * @param {boolean} multi
		 */
		
		_updateControls: function(command, multi){
			var self = this,
				output = {
					filter: command.filter,
					sort: command.sort
				},
				update = function($el, filter){
					try {
						(multi && type === 'filter' && !(output.filter === 'none' || output.filter === '')) ?
								$el.filter(filter).addClass(self.controls.activeClass) :
								$el.removeClass(self.controls.activeClass).filter(filter).addClass(self.controls.activeClass);
					} catch(e) {}
				},
				type = 'filter',
				$el = null;
				
			self._execAction('_updateControls', 0, arguments);
				
			(command.filter === undf) && (output.filter = self._activeFilter);
			(command.sort === undf) && (output.sort = self._activeSort);
			(output.filter === self.selectors.target) && (output.filter = 'all');
			
			for(var i = 0; i < 2; i++){
				$el = self.controls.live ? $(self.selectors[type]) : self['_$'+type+'Buttons'];
				$el && update($el, '[data-'+type+'="'+output[type]+'"]');
				type = 'sort';
			}
			
			self._execAction('_updateControls', 1, arguments);
		},
		
		/**
		 * Filter (private)
		 * @since 2.0.0
		 */
		
		_filter: function(){
			var self = this;
			
			self._execAction('_filter', 0);
			
			for(var i = 0; i < self._$targets.length; i++){
				var $target = $(self._$targets[i]);
				
				if($target.is(self._activeFilter)){
					self._$show = self._$show.add($target);
				} else {
					self._$hide = self._$hide.add($target);
				}
			}
			
			self._execAction('_filter', 1);
		},
		
		/**
		 * Sort (private)
		 * @since 2.0.0
		 */
		
		_sort: function(){
			var self = this,
				arrayShuffle = function(oldArray){
					var newArray = oldArray.slice(),
						len = newArray.length,
						i = len;

					while(i--){
						var p = parseInt(Math.random()*len);
						var t = newArray[i];
						newArray[i] = newArray[p];
						newArray[p] = t;
					};
					return newArray; 
				};
				
			self._execAction('_sort', 0);
			
			self._startOrder = [];
			
			for(var i = 0; i < self._$targets.length; i++){
				var target = self._$targets[i];
				
				self._startOrder.push(target);
			}
			
			switch(self._newSort[0].sortBy){
				case 'default':
					self._newOrder = self._origOrder;
					break;
				case 'random':
					self._newOrder = arrayShuffle(self._startOrder);
					break;
				case 'custom':
					self._newOrder = self._newSort[0].order;
					break;
				default:
					self._newOrder = self._startOrder.concat().sort(function(a, b){
						return self._compare(a, b);
					});
			}
			
			self._execAction('_sort', 1);
		},
		
		/**
		 * Compare Algorithm
		 * @since 2.0.0
		 * @param {string|number} a
		 * @param {string|number} b
		 * @param {number} depth (recursion)
		 * @return {number}
		 */
		
		_compare: function(a, b, depth){
			depth = depth ? depth : 0;
		
			var self = this,
				order = self._newSort[depth].order,
				getData = function(el){
					return el.dataset[self._newSort[depth].sortBy] || 0;
				},
				attrA = isNaN(getData(a) * 1) ? getData(a).toLowerCase() : getData(a) * 1,
				attrB = isNaN(getData(b) * 1) ? getData(b).toLowerCase() : getData(b) * 1;
				
			if(attrA < attrB)
				return order === 'asc' ? -1 : 1;
			if(attrA > attrB)
				return order === 'asc' ? 1 : -1;
			if(attrA === attrB && self._newSort.length > depth+1)
				return self._compare(a, b, depth+1);

			return 0;
		},
		
		/**
		 * Print Sort
		 * @since 2.0.0
		 * @param {boolean} reset
		 */
		
		_printSort: function(reset){
			var self = this,
				order = reset ? self._startOrder : self._newOrder,
				targets = self._$parent[0].querySelectorAll(self.selectors.target),
				nextSibling = targets.length ? targets[targets.length -1].nextElementSibling : null,
				frag = document.createDocumentFragment();
				
			self._execAction('_printSort', 0, arguments);
			
			for(var i = 0; i < targets.length; i++){
				var target = targets[i],
					whiteSpace = target.nextSibling;

				if(target.style.position === 'absolute') continue;
			
				if(whiteSpace && whiteSpace.nodeName === '#text'){
					self._$parent[0].removeChild(whiteSpace);
				}
				
				self._$parent[0].removeChild(target);
			}
			
			for(var i = 0; i < order.length; i++){
				var el = order[i];

				if(self._newSort[0].sortBy === 'default' && self._newSort[0].order === 'desc' && !reset){
					var firstChild = frag.firstChild;
					frag.insertBefore(el, firstChild);
					frag.insertBefore(document.createTextNode(' '), el);
				} else {
					frag.appendChild(el);
					frag.appendChild(document.createTextNode(' '));
				}
			}
			
			nextSibling ? 
				self._$parent[0].insertBefore(frag, nextSibling) :
				self._$parent[0].appendChild(frag);
				
			self._execAction('_printSort', 1, arguments);
		},
		
		/**
		 * Parse Sort
		 * @since 2.0.0
		 * @param {string} sortString
		 * @return {array} newSort
		 */
		
		_parseSort: function(sortString){
			var self = this,
				rules = typeof sortString === 'string' ? sortString.split(' ') : [sortString],
				newSort = [];
				
			for(var i = 0; i < rules.length; i++){
				var rule = typeof sortString === 'string' ? rules[i].split(':') : ['custom', rules[i]],
					ruleObj = {
						sortBy: self._helpers._camelCase(rule[0]),
						order: rule[1] || 'asc'
					};
					
				newSort.push(ruleObj);
				
				if(ruleObj.sortBy === 'default' || ruleObj.sortBy === 'random') break;
			}
			
			return self._execFilter('_parseSort', newSort, arguments);
		},
		
		/**
		 * Parse Effects
		 * @since 2.0.0
		 * @return {object} effects
		 */
		
		_parseEffects: function(){
			var self = this,
				effects = {
					opacity: '',
					transformIn: '',
					transformOut: '',
					filter: ''
				},
				parse = function(effect, extract, reverse){
					if(self.animation.effects.indexOf(effect) > -1){
						if(extract){
							var propIndex = self.animation.effects.indexOf(effect+'(');
							if(propIndex > -1){
								var str = self.animation.effects.substring(propIndex),
									match = /\(([^)]+)\)/.exec(str),
									val = match[1];

									return {val: val};
							}
						}
						return true;
					} else {
						return false;
					}
				},
				negate = function(value, invert){
					if(invert){
						return value.charAt(0) === '-' ? value.substr(1, value.length) : '-'+value;
					} else {
						return value;
					}
				},
				buildTransform = function(key, invert){
					var transforms = [
						['scale', '.01'],
						['translateX', '20px'],
						['translateY', '20px'],
						['translateZ', '20px'],
						['rotateX', '90deg'],
						['rotateY', '90deg'],
						['rotateZ', '180deg'],
					];
					
					for(var i = 0; i < transforms.length; i++){
						var prop = transforms[i][0],
							def = transforms[i][1],
							inverted = invert && prop !== 'scale';
							
						effects[key] += parse(prop) ? prop+'('+negate(parse(prop, true).val || def, inverted)+') ' : '';
					}
				};
			
			effects.opacity = parse('fade') ? parse('fade',true).val || '0' : '1';
			
			buildTransform('transformIn');
			
			self.animation.reverseOut ? buildTransform('transformOut', true) : (effects.transformOut = effects.transformIn);

			effects.transition = {};
			
			effects.transition = self._getPrefixedCSS('transition','all '+self.animation.duration+'ms '+self.animation.easing+', opacity '+self.animation.duration+'ms linear');
		
			self.animation.stagger = parse('stagger') ? true : false;
			self.animation.staggerDuration = parseInt(parse('stagger') ? (parse('stagger',true).val ? parse('stagger',true).val : 100) : 100);

			return self._execFilter('_parseEffects', effects);
		},
		
		/**
		 * Build State
		 * @since 2.0.0
		 * @param {boolean} future
		 * @return {object} futureState
		 */
		
		_buildState: function(future){
			var self = this,
				state = {};
			
			self._execAction('_buildState', 0);
			
			state = {
				activeFilter: self._activeFilter === '' ? 'none' : self._activeFilter,
				activeSort: future && self._newSortString ? self._newSortString : self._activeSort,
				fail: !self._$show.length && self._activeFilter !== '',
				$targets: self._$targets,
				$show: self._$show,
				$hide: self._$hide,
				totalTargets: self._$targets.length,
				totalShow: self._$show.length,
				totalHide: self._$hide.length,
				display: future && self._newDisplay ? self._newDisplay : self.layout.display
			};
			
			if(future){
				return self._execFilter('_buildState', state);
			} else {
				self._state = state;
				
				self._execAction('_buildState', 1);
			}
		},
		
		/**
		 * Go Mix
		 * @since 2.0.0
		 * @param {boolean} animate
		 */
		
		_goMix: function(animate){
			var self = this,
				phase1 = function(){
					if(self._chrome && (self._chrome === 31)){
						chromeFix(self._$parent[0]);
					}
					
					self._setInter();
					
					phase2();
				},
				phase2 = function(){
					var scrollTop = window.pageYOffset,
						scrollLeft = window.pageXOffset,
						docHeight = document.documentElement.scrollHeight;

					self._getInterMixData();
					
					self._setFinal();

					self._getFinalMixData();

					(window.pageYOffset !== scrollTop) && window.scrollTo(scrollLeft, scrollTop);

					self._prepTargets();
					
					if(window.requestAnimationFrame){
						requestAnimationFrame(phase3);
					} else {
						setTimeout(function(){
							phase3();
						},20);
					}
				},
				phase3 = function(){
					self._animateTargets();

					if(self._targetsBound === 0){
						self._cleanUp();
					}
				},
				chromeFix = function(grid){
					var parent = grid.parentElement,
						placeholder = document.createElement('div'),
						frag = document.createDocumentFragment();

					parent.insertBefore(placeholder, grid);
					frag.appendChild(grid);
					parent.replaceChild(grid, placeholder);
				},
				futureState = self._buildState(true);
				
			self._execAction('_goMix', 0, arguments);
				
			!self.animation.duration && (animate = false);

			self._mixing = true;
			
			self._$container.removeClass(self.layout.containerClassFail);
			
			if(typeof self.callbacks.onMixStart === 'function'){
				self.callbacks.onMixStart.call(self._domNode, self._state, futureState, self);
			}
			
			self._$container.trigger('mixStart', [self._state, futureState, self]);
			
			self._getOrigMixData();
			
			if(animate && !self._suckMode){
			
				window.requestAnimationFrame ?
					requestAnimationFrame(phase1) :
					phase1();
			
			} else {
				self._cleanUp();
			}
			
			self._execAction('_goMix', 1, arguments);
		},
		
		/**
		 * Get Target Data
		 * @since 2.0.0
		 */
		
		_getTargetData: function(el, stage){
			var self = this,
				elStyle;
			
			el.dataset[stage+'PosX'] = el.offsetLeft;
			el.dataset[stage+'PosY'] = el.offsetTop;

			if(self.animation.animateResizeTargets){
				elStyle = !self._suckMode ? 
					window.getComputedStyle(el) : 
					{
						marginBottom: '',
						marginRight: ''
					};
			
				el.dataset[stage+'MarginBottom'] = parseInt(elStyle.marginBottom);
				el.dataset[stage+'MarginRight'] = parseInt(elStyle.marginRight);
				el.dataset[stage+'Width'] = el.offsetWidth;
				el.dataset[stage+'Height'] = el.offsetHeight;
			}
		},
		
		/**
		 * Get Original Mix Data
		 * @since 2.0.0
		 */
		
		_getOrigMixData: function(){
			var self = this,
				parentStyle = !self._suckMode ? window.getComputedStyle(self._$parent[0]) : {boxSizing: ''},
				parentBS = parentStyle.boxSizing || parentStyle[self._vendor+'BoxSizing'];
	
			self._incPadding = (parentBS === 'border-box');
			
			self._execAction('_getOrigMixData', 0);
			
			!self._suckMode && (self.effects = self._parseEffects());
		
			self._$toHide = self._$hide.filter(':visible');
			self._$toShow = self._$show.filter(':hidden');
			self._$pre = self._$targets.filter(':visible');

			self._startHeight = self._incPadding ? 
				self._$parent.outerHeight() : 
				self._$parent.height();
				
			for(var i = 0; i < self._$pre.length; i++){
				var el = self._$pre[i];
				
				self._getTargetData(el, 'orig');
			}
			
			self._execAction('_getOrigMixData', 1);
		},
		
		/**
		 * Set Intermediate Positions
		 * @since 2.0.0
		 */
		
		_setInter: function(){
			var self = this;
			
			self._execAction('_setInter', 0);
			
			if(self._changingLayout && self.animation.animateChangeLayout){
				self._$toShow.css('display',self._newDisplay);

				if(self._changingClass){
					self._$container
						.removeClass(self.layout.containerClass)
						.addClass(self._newClass);
				}
			} else {
				self._$toShow.css('display', self.layout.display);
			}
			
			self._execAction('_setInter', 1);
		},
		
		/**
		 * Get Intermediate Mix Data
		 * @since 2.0.0
		 */
		
		_getInterMixData: function(){
			var self = this;
			
			self._execAction('_getInterMixData', 0);
			
			for(var i = 0; i < self._$toShow.length; i++){
				var el = self._$toShow[i];
					
				self._getTargetData(el, 'inter');
			}
			
			for(var i = 0; i < self._$pre.length; i++){
				var el = self._$pre[i];
					
				self._getTargetData(el, 'inter');
			}
			
			self._execAction('_getInterMixData', 1);
		},
		
		/**
		 * Set Final Positions
		 * @since 2.0.0
		 */
		
		_setFinal: function(){
			var self = this;
			
			self._execAction('_setFinal', 0);
			
			self._sorting && self._printSort();

			self._$toHide.removeStyle('display');
			
			if(self._changingLayout && self.animation.animateChangeLayout){
				self._$pre.css('display',self._newDisplay);
			}
			
			self._execAction('_setFinal', 1);
		},
		
		/**
		 * Get Final Mix Data
		 * @since 2.0.0
		 */
		
		_getFinalMixData: function(){
			var self = this;
			
			self._execAction('_getFinalMixData', 0);
	
			for(var i = 0; i < self._$toShow.length; i++){
				var el = self._$toShow[i];
					
				self._getTargetData(el, 'final');
			}
			
			for(var i = 0; i < self._$pre.length; i++){
				var el = self._$pre[i];
					
				self._getTargetData(el, 'final');
			}
			
			self._newHeight = self._incPadding ? 
				self._$parent.outerHeight() : 
				self._$parent.height();

			self._sorting && self._printSort(true);
	
			self._$toShow.removeStyle('display');
			
			self._$pre.css('display',self.layout.display);
			
			if(self._changingClass && self.animation.animateChangeLayout){
				self._$container
					.removeClass(self._newClass)
					.addClass(self.layout.containerClass);
			}
			
			self._execAction('_getFinalMixData', 1);
		},
		
		/**
		 * Prepare Targets
		 * @since 2.0.0
		 */
		
		_prepTargets: function(){
			var self = this,
				transformCSS = {
					_in: self._getPrefixedCSS('transform', self.effects.transformIn),
					_out: self._getPrefixedCSS('transform', self.effects.transformOut)
				};

			self._execAction('_prepTargets', 0);
			
			if(self.animation.animateResizeContainer){
				self._$parent.css('height',self._startHeight+'px');
			}
			
			for(var i = 0; i < self._$toShow.length; i++){
				var el = self._$toShow[i],
					$el = $(el);
				
				el.style.opacity = self.effects.opacity;
				el.style.display = (self._changingLayout && self.animation.animateChangeLayout) ?
					self._newDisplay :
					self.layout.display;
					
				$el.css(transformCSS._in);
				
				if(self.animation.animateResizeTargets){
					el.style.width = el.dataset.finalWidth+'px';
					el.style.height = el.dataset.finalHeight+'px';
					el.style.marginRight = -(el.dataset.finalWidth - el.dataset.interWidth) + (el.dataset.finalMarginRight * 1)+'px';
					el.style.marginBottom = -(el.dataset.finalHeight - el.dataset.interHeight) + (el.dataset.finalMarginBottom * 1)+'px';
				}
			}

			for(var i = 0; i < self._$pre.length; i++){
				var el = self._$pre[i],
					$el = $(el),
					translate = {
						x: el.dataset.origPosX - el.dataset.interPosX,
						y: el.dataset.origPosY - el.dataset.interPosY
					},
					transformCSS = self._getPrefixedCSS('transform','translate('+translate.x+'px,'+translate.y+'px)');

				$el.css(transformCSS);
				
				if(self.animation.animateResizeTargets){
					el.style.width = el.dataset.origWidth+'px';
					el.style.height = el.dataset.origHeight+'px';
					
					if(el.dataset.origWidth - el.dataset.finalWidth){
						el.style.marginRight = -(el.dataset.origWidth - el.dataset.interWidth) + (el.dataset.origMarginRight * 1)+'px';
					}
					
					if(el.dataset.origHeight - el.dataset.finalHeight){
						el.style.marginBottom = -(el.dataset.origHeight - el.dataset.interHeight) + (el.dataset.origMarginBottom * 1) +'px';
					}
				}
			}
			
			self._execAction('_prepTargets', 1);
		},
		
		/**
		 * Animate Targets
		 * @since 2.0.0
		 */
		
		_animateTargets: function(){
			var self = this;

			self._execAction('_animateTargets', 0);
			
			self._targetsDone = 0;
			self._targetsBound = 0;
			
			self._$parent
				.css(self._getPrefixedCSS('perspective', self.animation.perspectiveDistance+'px'))
				.css(self._getPrefixedCSS('perspective-origin', self.animation.perspectiveOrigin));
			
			if(self.animation.animateResizeContainer){
				self._$parent
					.css(self._getPrefixedCSS('transition','height '+self.animation.duration+'ms ease'))
					.css('height',self._newHeight+'px');
			}
			
			for(var i = 0; i < self._$toShow.length; i++){
				var el = self._$toShow[i],
					$el = $(el),
					translate = {
						x: el.dataset.finalPosX - el.dataset.interPosX,
						y: el.dataset.finalPosY - el.dataset.interPosY
					},
					delay = self._getDelay(i),
					toShowCSS = {};
				
				el.style.opacity = '';
				
				for(var j = 0; j < 2; j++){
					var a = j === 0 ? a = self._prefix : '';
					
					if(self._ff && self._ff <= 20){
						toShowCSS[a+'transition-property'] = 'all';
						toShowCSS[a+'transition-timing-function'] = self.animation.easing+'ms';
						toShowCSS[a+'transition-duration'] = self.animation.duration+'ms';
					}
					
					toShowCSS[a+'transition-delay'] = delay+'ms';
					toShowCSS[a+'transform'] = 'translate('+translate.x+'px,'+translate.y+'px)';
				}
				
				if(self.effects.transform || self.effects.opacity){
					self._bindTargetDone($el);
				}
				
				(self._ff && self._ff <= 20) ? 
					$el.css(toShowCSS) : 
					$el.css(self.effects.transition).css(toShowCSS);
			}
			
			for(var i = 0; i < self._$pre.length; i++){
				var el = self._$pre[i],
					$el = $(el),
					translate = {
						x: el.dataset.finalPosX - el.dataset.interPosX,
						y: el.dataset.finalPosY - el.dataset.interPosY
					},
					delay = self._getDelay(i);
					
				if(!(
					el.dataset.finalPosX === el.dataset.origPosX &&
					el.dataset.finalPosY === el.dataset.origPosY
				)){
					self._bindTargetDone($el);
				}
				
				$el.css(self._getPrefixedCSS('transition', 'all '+self.animation.duration+'ms '+self.animation.easing+' '+delay+'ms'));
				$el.css(self._getPrefixedCSS('transform', 'translate('+translate.x+'px,'+translate.y+'px)'));
				
				if(self.animation.animateResizeTargets){
					if(el.dataset.origWidth - el.dataset.finalWidth && el.dataset.finalWidth * 1){
						el.style.width = el.dataset.finalWidth+'px';
						el.style.marginRight = -(el.dataset.finalWidth - el.dataset.interWidth)+(el.dataset.finalMarginRight * 1)+'px';
					}
					
					if(el.dataset.origHeight - el.dataset.finalHeight && el.dataset.finalHeight * 1){
						el.style.height = el.dataset.finalHeight+'px';
						el.style.marginBottom = -(el.dataset.finalHeight - el.dataset.interHeight)+(el.dataset.finalMarginBottom * 1) +'px';
					}
				}
			}
			
			if(self._changingClass){
				self._$container
					.removeClass(self.layout.containerClass)
					.addClass(self._newClass);
			}
			
			for(var i = 0; i < self._$toHide.length; i++){
				var el = self._$toHide[i],
					$el = $(el),
					delay = self._getDelay(i),
					toHideCSS = {};

				for(var j = 0; j<2; j++){
					var a = j === 0 ? a = self._prefix : '';

					toHideCSS[a+'transition-delay'] = delay+'ms';
					toHideCSS[a+'transform'] = self.effects.transformOut;
					toHideCSS.opacity = self.effects.opacity;
				}
				
				$el.css(self.effects.transition).css(toHideCSS);
			
				if(self.effects.transform || self.effects.opacity){
					self._bindTargetDone($el);
				};
			}
			
			self._execAction('_animateTargets', 1);

		},
		
		/**
		 * Bind Targets TransitionEnd
		 * @since 2.0.0
		 * @param {object} $el
		 */
		
		_bindTargetDone: function($el){
			var self = this,
				el = $el[0];
				
			self._execAction('_bindTargetDone', 0, arguments);
			
			if(!el.dataset.bound){
				
				el.dataset.bound = true;
				self._targetsBound++;
			
				$el.on('webkitTransitionEnd.mixItUp transitionend.mixItUp',function(e){
					if(
						(e.originalEvent.propertyName.indexOf('transform') > -1 || 
						e.originalEvent.propertyName.indexOf('opacity') > -1) &&
						$(e.originalEvent.target).is(self.selectors.target)
					){
						$el.off('.mixItUp');
						delete el.dataset.bound;
						self._targetDone();
					}
				});
			}
			
			self._execAction('_bindTargetDone', 1, arguments);
		},
		
		/**
		 * Target Done
		 * @since 2.0.0
		 */
		
		_targetDone: function(){
			var self = this;
			
			self._execAction('_targetDone', 0);
			
			self._targetsDone++;
			
			(self._targetsDone === self._targetsBound) && self._cleanUp();
			
			self._execAction('_targetDone', 1);
		},
		
		/**
		 * Clean Up
		 * @since 2.0.0
		 */
		
		_cleanUp: function(){
			var self = this,
				targetStyles = self.animation.animateResizeTargets ? 'transform opacity width height margin-bottom margin-right' : 'transform opacity';
				unBrake = function(){
					self._$targets.removeStyle('transition', self._prefix);
				};
				
			self._execAction('_cleanUp', 0);
			
			!self._changingLayout ?
				self._$show.css('display',self.layout.display) :
				self._$show.css('display',self._newDisplay);
			
			self._$targets.css(self._brake);
			
			self._$targets
				.removeStyle(targetStyles, self._prefix)
				.removeAttr('data-inter-pos-x data-inter-pos-y data-final-pos-x data-final-pos-y data-orig-pos-x data-orig-pos-y data-orig-height data-orig-width data-final-height data-final-width data-inter-width data-inter-height data-orig-margin-right data-orig-margin-bottom data-inter-margin-right data-inter-margin-bottom data-final-margin-right data-final-margin-bottom');
				
			self._$hide.removeStyle('display');
			
			self._$parent.removeStyle('height transition perspective-distance perspective perspective-origin-x perspective-origin-y perspective-origin perspectiveOrigin', self._prefix);
			
			if(self._sorting){
				self._printSort();
				self._activeSort = self._newSortString;
				self._sorting = false;
			}
			
			if(self._changingLayout){
				if(self._changingDisplay){
					self.layout.display = self._newDisplay;
					self._changingDisplay = false;
				}
				
				if(self._changingClass){
					self._$parent.removeClass(self.layout.containerClass).addClass(self._newClass);
					self.layout.containerClass = self._newClass;
					self._changingClass = false;
				}
				
				self._changingLayout = false;
			}
			
			self._refresh();
			
			self._buildState();
			
			if(self._state.fail){
				self._$container.addClass(self.layout.containerClassFail);
			}
			
			self._$show = $();
			self._$hide = $();
			
			if(window.requestAnimationFrame){
				requestAnimationFrame(unBrake);
			}
			
			self._mixing = false;
			
			if(typeof self.callbacks._user === 'function'){
				self.callbacks._user.call(self._domNode, self._state, self);
			}
			
			if(typeof self.callbacks.onMixEnd === 'function'){
				self.callbacks.onMixEnd.call(self._domNode, self._state, self);
			}
			
			self._$container.trigger('mixEnd', [self._state, self]);
			
			if(self._state.fail){
				(typeof self.callbacks.onMixFail === 'function') && self.callbacks.onMixFail.call(self._domNode, self._state, self);
				self._$container.trigger('mixFail', [self._state, self]);
			}
			
			if(self._loading){
				(typeof self.callbacks.onMixLoad === 'function') && self.callbacks.onMixLoad.call(self._domNode, self._state, self);
				self._$container.trigger('mixLoad', [self._state, self]);
			}
			
			if(self._queue.length){
				self._execAction('_queue', 0);
				
				self.multiMix(self._queue[0][0],self._queue[0][1],self._queue[0][2]);
				self._queue.splice(0, 1);
			}
			
			self._execAction('_cleanUp', 1);
			
			self._loading = false;
		},
		
		/**
		 * Get Prefixed CSS
		 * @since 2.0.0
		 * @param {string} property
		 * @param {string} value
		 * @param {boolean} prefixValue
		 * @return {object} styles
		 */
		
		_getPrefixedCSS: function(property, value, prefixValue){
			var self = this,
				styles = {},
				prefix = '',
				i = -1;
		
			for(i = 0; i < 2; i++){
				prefix = i === 0 ? self._prefix : '';
				prefixValue ? styles[prefix+property] = prefix+value : styles[prefix+property] = value;
			}
			
			return self._execFilter('_getPrefixedCSS', styles, arguments);
		},
		
		/**
		 * Get Delay
		 * @since 2.0.0
		 * @param {number} i
		 * @return {number} delay
		 */
		
		_getDelay: function(i){
			var self = this,
				n = typeof self.animation.staggerSequence === 'function' ? self.animation.staggerSequence.call(self._domNode, i, self._state) : i,
				delay = self.animation.stagger ? n * self.animation.staggerDuration : 0;
				
			return self._execFilter('_getDelay', delay, arguments);
		},
		
		/**
		 * Parse MultiMix Arguments
		 * @since 2.0.0
		 * @param {array} args
		 * @return {object} output
		 */
		
		_parseMultiMixArgs: function(args){
			var self = this,
				output = {
					command: null,
					animate: self.animation.enable,
					callback: null
				};
				
			for(var i = 0; i < args.length; i++){
				var arg = args[i];

				if(arg !== null){
					if(typeof arg === 'object' || typeof arg === 'string'){
						output.command = arg;
					} else if(typeof arg === 'boolean'){
						output.animate = arg;
					} else if(typeof arg === 'function'){
						output.callback = arg;
					}
				}
			}
			
			return self._execFilter('_parseMultiMixArgs', output, arguments);
		},
		
		/**
		 * Parse Insert Arguments
		 * @since 2.0.0
		 * @param {array} args
		 * @return {object} output
		 */
		
		_parseInsertArgs: function(args){
			var self = this,
				output = {
					index: 0,
					$object: $(),
					multiMix: {filter: self._state.activeFilter},
					callback: null
				};
			
			for(var i = 0; i < args.length; i++){
				var arg = args[i];
				
				if(typeof arg === 'number'){
					output.index = arg;
				} else if(typeof arg === 'object' && arg instanceof $){
					output.$object = arg;
				} else if(typeof arg === 'object' && self._helpers._isElement(arg)){
					output.$object = $(arg);
				} else if(typeof arg === 'object' && arg !== null){
					output.multiMix = arg;
				} else if(typeof arg === 'boolean' && !arg){
					output.multiMix = false;
				} else if(typeof arg === 'function'){
					output.callback = arg;
				}
			}
			
			return self._execFilter('_parseInsertArgs', output, arguments);
		},
		
		/**
		 * Execute Action
		 * @since 2.0.0
		 * @param {string} methodName
		 * @param {boolean} isPost
		 * @param {array} args
		 */
		
		_execAction: function(methodName, isPost, args){
			var self = this,
				context = isPost ? 'post' : 'pre';

			if(!self._actions.isEmptyObject && self._actions.hasOwnProperty(methodName)){
				for(var key in self._actions[methodName][context]){
					self._actions[methodName][context][key].call(self, args);
				}
			}
		},
		
		/**
		 * Execute Filter
		 * @since 2.0.0
		 * @param {string} methodName
		 * @param {mixed} value
		 * @return {mixed} value
		 */
		
		_execFilter: function(methodName, value, args){
			var self = this;
			
			if(!self._filters.isEmptyObject && self._filters.hasOwnProperty(methodName)){
				for(var key in self._filters[methodName]){
					return self._filters[methodName][key].call(self, args);
				}
			} else {
				return value;
			}
		},
		
		/* Helpers
		---------------------------------------------------------------------- */

		_helpers: {
			
			/**
			 * CamelCase
			 * @since 2.0.0
			 * @param {string}
			 * @return {string}
			 */

			_camelCase: function(string){
				return string.replace(/-([a-z])/g, function(g){
						return g[1].toUpperCase();
				});
			},
			
			/**
			 * Is Element
			 * @since 2.1.3
			 * @param {object} element to test
			 * @return {boolean}
			 */
			
			_isElement: function(el){
				if(window.HTMLElement){
					return el instanceof HTMLElement;
				} else {
					return (
						el !== null && 
						el.nodeType === 1 &&
						el.nodeName === 'string'
					);
				}
			}
		},
		
		/* Public Methods
		---------------------------------------------------------------------- */
		
		/**
		 * Is Mixing
		 * @since 2.0.0
		 * @return {boolean}
		 */
		
		isMixing: function(){
			var self = this;
			
			return self._execFilter('isMixing', self._mixing);
		},
		
		/**
		 * Filter (public)
		 * @since 2.0.0
		 * @param {array} arguments
		 */
		
		filter: function(){
			var self = this,
				args = self._parseMultiMixArgs(arguments);

			self._clicking && (self._toggleString = '');
			
			self.multiMix({filter: args.command}, args.animate, args.callback);
		},
		
		/**
		 * Sort (public)
		 * @since 2.0.0
		 * @param {array} arguments
		 */
		
		sort: function(){
			var self = this,
				args = self._parseMultiMixArgs(arguments);

			self.multiMix({sort: args.command}, args.animate, args.callback);
		},

		/**
		 * Change Layout (public)
		 * @since 2.0.0
		 * @param {array} arguments
		 */
		
		changeLayout: function(){
			var self = this,
				args = self._parseMultiMixArgs(arguments);
				
			self.multiMix({changeLayout: args.command}, args.animate, args.callback);
		},
		
		/**
		 * MultiMix
		 * @since 2.0.0
		 * @param {array} arguments
		 */
		
		multiMix: function(){
			var self = this,
				args = self._parseMultiMixArgs(arguments);

			self._execAction('multiMix', 0, arguments);

			if(!self._mixing){
				if(self.controls.enable && !self._clicking){
					self.controls.toggleFilterButtons && self._buildToggleArray();
					self._updateControls(args.command, self.controls.toggleFilterButtons);
				}
				
				(self._queue.length < 2) && (self._clicking = false);
			
				delete self.callbacks._user;
				if(args.callback) self.callbacks._user = args.callback;
			
				var sort = args.command.sort,
					filter = args.command.filter,
					changeLayout = args.command.changeLayout;

				self._refresh();

				if(sort){
					self._newSort = self._parseSort(sort);
					self._newSortString = sort;
					
					self._sorting = true;
					self._sort();
				}
				
				if(filter !== undf){
					filter = (filter === 'all') ? self.selectors.target : filter;
	
					self._activeFilter = filter;
				}
				
				self._filter();
				
				if(changeLayout){
					self._newDisplay = (typeof changeLayout === 'string') ? changeLayout : changeLayout.display || self.layout.display;
					self._newClass = changeLayout.containerClass || '';

					if(
						self._newDisplay !== self.layout.display ||
						self._newClass !== self.layout.containerClass
					){
						self._changingLayout = true;
						
						self._changingClass = (self._newClass !== self.layout.containerClass);
						self._changingDisplay = (self._newDisplay !== self.layout.display);
					}
				}
				
				self._$targets.css(self._brake);
				
				self._goMix(args.animate ^ self.animation.enable ? args.animate : self.animation.enable);
				
				self._execAction('multiMix', 1, arguments);
				
			} else {
				if(self.animation.queue && self._queue.length < self.animation.queueLimit){
					self._queue.push(arguments);
					
					(self.controls.enable && !self._clicking) && self._updateControls(args.command);
					
					self._execAction('multiMixQueue', 1, arguments);
					
				} else {
					if(typeof self.callbacks.onMixBusy === 'function'){
						self.callbacks.onMixBusy.call(self._domNode, self._state, self);
					}
					self._$container.trigger('mixBusy', [self._state, self]);
					
					self._execAction('multiMixBusy', 1, arguments);
				}
			}
		},
		
		/**
		 * Insert
		 * @since 2.0.0
		 * @param {array} arguments
		 */
		
		insert: function(){
			var self = this,
				args = self._parseInsertArgs(arguments),
				callback = (typeof args.callback === 'function') ? args.callback : null,
				frag = document.createDocumentFragment(),
				target = (function(){
					self._refresh();
					
					if(self._$targets.length){
						return (args.index < self._$targets.length || !self._$targets.length) ? 
							self._$targets[args.index] :
							self._$targets[self._$targets.length-1].nextElementSibling;
					} else {
						return self._$parent[0].children[0];
					}
				})();
						
			self._execAction('insert', 0, arguments);
				
			if(args.$object){
				for(var i = 0; i < args.$object.length; i++){
					var el = args.$object[i];
					
					frag.appendChild(el);
					frag.appendChild(document.createTextNode(' '));
				}

				self._$parent[0].insertBefore(frag, target);
			}
			
			self._execAction('insert', 1, arguments);
			
			if(typeof args.multiMix === 'object'){
				self.multiMix(args.multiMix, callback);
			}
		},

		/**
		 * Prepend
		 * @since 2.0.0
		 * @param {array} arguments
		 */
		
		prepend: function(){
			var self = this,
				args = self._parseInsertArgs(arguments);
				
			self.insert(0, args.$object, args.multiMix, args.callback);
		},
		
		/**
		 * Append
		 * @since 2.0.0
		 * @param {array} arguments
		 */
		
		append: function(){
			var self = this,
				args = self._parseInsertArgs(arguments);
		
			self.insert(self._state.totalTargets, args.$object, args.multiMix, args.callback);
		},
		
		/**
		 * Get Option
		 * @since 2.0.0
		 * @param {string} string
		 * @return {mixed} value
		 */
		
		getOption: function(string){
			var self = this,
				getProperty = function(obj, prop){
					var parts = prop.split('.'),
						last = parts.pop(),
						l = parts.length,
						i = 1,
						current = parts[0] || prop;

					while((obj = obj[current]) && i < l){
						current = parts[i];
						i++;
					}

					if(obj !== undf){
						return obj[last] !== undf ? obj[last] : obj;
					}
				};

			return string ? self._execFilter('getOption', getProperty(self, string), arguments) : self;
		},
		
		/**
		 * Set Options
		 * @since 2.0.0
		 * @param {object} config
		 */
		
		setOptions: function(config){
			var self = this;
			
			self._execAction('setOptions', 0, arguments);
			
			typeof config === 'object' && $.extend(true, self, config);
			
			self._execAction('setOptions', 1, arguments);
		},
		
		/**
		 * Get State
		 * @since 2.0.0
		 * @return {object} state
		 */
		
		getState: function(){
			var self = this;
			
			return self._execFilter('getState', self._state, self);
		},
		
		/**
		 * Force Refresh
		 * @since 2.1.2
		 */
		
		forceRefresh: function(){
			var self = this;
			
			self._refresh(false, true);
		},
		
		/**
		 * Destroy
		 * @since 2.0.0
		 * @param {boolean} hideAll
		 */
		
		destroy: function(hideAll){
			var self = this,
				filters = $.MixItUp.prototype._bound._filter,
				sorts = $.MixItUp.prototype._bound._sort;
			
			self._execAction('destroy', 0, arguments);
		
			self._$body
				.add($(self.selectors.sort))
				.add($(self.selectors.filter))
				.off('.mixItUp');
			
			for(var i = 0; i < self._$targets.length; i++){
				var target = self._$targets[i];

				hideAll && (target.style.display = '');

				delete target.mixParent;
			}
			
			self._execAction('destroy', 1, arguments);

			if(filters[self.selectors.filter] && filters[self.selectors.filter] > 1) {
				filters[self.selectors.filter]--;
			} else if(filters[self.selectors.filter] === 1) {
				delete filters[self.selectors.filter];
			}

			if(sorts[self.selectors.sort] && sorts[self.selectors.sort] > 1) {
				sorts[self.selectors.sort]--;
			} else if(sorts[self.selectors.sort] === 1) {
				delete sorts[self.selectors.sort];
			}

			delete $.MixItUp.prototype._instances[self._id];
		}
		
	};
	
	/* jQuery Methods
	---------------------------------------------------------------------- */
	
	/**
	 * jQuery .mixItUp() method
	 * @since 2.0.0
	 * @extends $.fn
	 */
	
	$.fn.mixItUp = function(){
		var args = arguments,
			dataReturn = [],
			eachReturn,
			_instantiate = function(domNode, settings){
				var instance = new $.MixItUp(),
					rand = function(){
						return ('00000'+(Math.random()*16777216<<0).toString(16)).substr(-6).toUpperCase();
					};
					
				instance._execAction('_instantiate', 0, arguments);

				domNode.id = !domNode.id ? 'MixItUp'+rand() : domNode.id;
				
				if(!instance._instances[domNode.id]){
					instance._instances[domNode.id] = instance;
					instance._init(domNode, settings);
				}
				
				instance._execAction('_instantiate', 1, arguments);
			};
			
		eachReturn = this.each(function(){
			if(args && typeof args[0] === 'string'){
				var instance = $.MixItUp.prototype._instances[this.id];
				if(args[0] === 'isLoaded'){
					dataReturn.push(instance ? true : false);
				} else {
					var data = instance[args[0]](args[1], args[2], args[3]);
					if(data !== undf)dataReturn.push(data);
				}
			} else {
				_instantiate(this, args[0]);
			}
		});
		
		if(dataReturn.length){
			return dataReturn.length > 1 ? dataReturn : dataReturn[0];
		} else {
			return eachReturn;
		}
	};
	
	/**
	 * jQuery .removeStyle() method
	 * @since 2.0.0
	 * @extends $.fn
	 */
	
	$.fn.removeStyle = function(style, prefix){
		prefix = prefix ? prefix : '';
	
		return this.each(function(){
			var el = this,
				styles = style.split(' ');
				
			for(var i = 0; i < styles.length; i++){
				for(var j = 0; j < 4; j++){
					switch (j) {
						case 0:
							var prop = styles[i];
							break;
						case 1:
							var prop = $.MixItUp.prototype._helpers._camelCase(prop);
							break;
						case 2:
							var prop = prefix+styles[i];
							break;
						case 3:
							var prop = $.MixItUp.prototype._helpers._camelCase(prefix+styles[i]);
					}
					
					if(
						el.style[prop] !== undf && 
						typeof el.style[prop] !== 'unknown' &&
						el.style[prop].length > 0
					){
						el.style[prop] = '';
					}
					
					if(!prefix && j === 1)break;
				}
			}
			
			if(el.attributes && el.attributes.style && el.attributes.style !== undf && el.attributes.style.value === ''){
				el.attributes.removeNamedItem('style');
			}
		});
	};
	
})(jQuery);;/* v1.1.5 3/29/2015 http://sachinchoolur.github.io/lightGallery*/
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('!3(e){"2r 4I";e.4E.L=3(t){6 i,a,n,l,s,o,d,r,c,u,h,m={1k:"7",3z:!0,2m:"4y",25:"4u",K:4o,8:"",2I:!0,1Q:!1,1O:!1,2P:4f,3e:!0,2u:!0,3n:!1,18:1,3s:!0,1J:M,1b:!1,3t:{3v:"41 3S"},11:!1,1R:!1,1h:!0,1i:!1,X:!0,3y:"3C",1g:1D,1B:5,2D:!1,3M:3P,3I:3G,2c:!0,3F:!0,3E:"3Q",2z:!1,1z:!0,2x:"4b",14:!1,Y:[],3i:3(){},3b:3(){},3a:3(){},36:3(){},35:3(){},34:3(){},2W:3(){}},f=e(4),v=4,p=M,b=0,g=!1,C=!1,y=2U 0!==2T.4g||"4j"2q 1d||"4k"2q 1d||2J.4l,w=!1,T=!1,x=!1,q=e.4n(!0,{},m,t),S={1w:3(){f.2l(3(){6 t=e(4);q.14?(p=q.Y,b=0,d=b,k.1w(b)):(p=M!==q.1J?e(q.1J):t.3m(),p.13("10",3(i){p=M!==q.1J?e(q.1J):t.3m(),i.1C(),i.1Y(),b=p.1b(4),d=b,k.1w(b)}))})}},k={1w:3(){g=!0,4.3h(),4.31(),4.2H(),4.2G(),4.11(),4.2F(),4.3A(),4.3r(),q.1b?(4.7(q.1b),4.X(q.1b)):(4.7(b),4.X(b)),q.3F&&4.2h(),q.2c&&4.2c(),W(3(){i.8("4N")},3G)},3h:3(){e("1n").17(\'<j R="B-2g" E="\'+q.8+\'"><j R="B-1f"><j R="B-2A"></j><a R="B-1K" E="1K"></a></j></j>\').8("1I-1f"),a=e("#B-2g"),i=e("#B-1f"),q.3s===!0&&i.8("4G-3o-2i"),n=i.D("#B-2A");6 t="";I(q.14)1F(6 s=0;s<q.Y.A;s++)t+=\'<j E="B-7"></j>\';22 p.2l(3(){t+=\'<j E="B-7"></j>\'});n.17(t),l=i.D(".B-7")},2H:3(){q.2I&&e("#B-2g").13("10",3(t){e(t.4F).4B(".B-7")&&v.21(!1)}),e("#B-1K").Q("10 1j",3(){v.21(!1)})},31:3(){6 t=3(){u=e(1d).19()};e(1d).Q("2k.L",t())},H:3(){6 e=3(){1F(6 e=["23","4A","4z","4x","4t","4q"],t=2T.4p,i=0;i<e.A;i++)I(e[i]2q t.2n)1t!0};1t q.3z&&e()?!0:!1},2c:3(){6 t=4;I(y){6 i={},a={};e("1n").13("2p.L",3(e){a=e.2b.2a[0],i.1s=e.2b.2a[0].1s,i.2L=e.2b.2a[0].2L}),e("1n").13("2M.L",3(e){6 t=e.2b;a=t.2a[0],e.1C()}),e("1n").13("1j.L",3(){6 e=a.1s-i.1s,n=q.3I;e>=n?(t.1G(),U(h)):-n>=e&&(t.1A(),U(h))})}},2h:3(){6 t,i,a=4;e(".1I-1f").Q("2Q",3(e){e.1Y(),e.1C(),t=e.1s}),e(".1I-1f").Q("2R",3(e){e.1Y(),e.1C(),i=e.1s,i-t>20?a.1G():t-i>20&&a.1A()})},2S:3(e,t){6 i=e.1E(/\\/\\/(?:1L\\.)?2V(?:\\.1X|1X\\.1p)\\/(?:2X\\?v=|2f\\/)?([a-2Z-30\\-]+)/i),a=e.1E(/\\/\\/(?:1L\\.)?2s.1p\\/([0-32-z\\-33]+)/i),n=!1;1t q.14?"2d"==q.Y[t].1a&&(n=!0):"2d"==p.9(t).12("1M-1a")&&(n=!0),i||a||n?!0:2U 0},3c:3(t,i){6 a=t.1E(/\\/\\/(?:1L\\.)?2V(?:\\.1X|1X\\.1p)\\/(?:2X\\?v=|2f\\/)?([a-2Z-30\\-]+)/i),n=t.1E(/\\/\\/(?:1L\\.)?2s.1p\\/([0-32-z\\-33]+)/i),l="",s="";I(a){I(s=q.1z===!0&&C===!1?"?3d=1&4d=0&3f=3g":"?3f=3g",q.2z){6 o=e.4c(q.2z);s=s+"&"+o}l=\'<1a E="Z" 19="3j" 3k="3l" V="//1L.4a.1p/2f/\'+a[1]+s+\'" 2v="0" 3p></1a>\'}22 n?(s=q.1z===!0&&C===!1?"3d=1&2w;":"",l=\'<1a E="Z" R="1m\'+i+\'" 19="3j" 3k="3l"  V="49://48.2s.1p/1m/\'+n[1]+"?"+s+"47=0&2w;44=0&2w;43="+q.3E+\'" 2v="0" 42 3U 3R></1a>\'):l=\'<1a E="Z" 2v="0" V="\'+t+\'"  3p="2d"></1a>\';1t\'<j E="1m-1r" 2n="3q-19:\'+q.2x+\' !3B;"><j E="1m">\'+l+"</j></j>"},1T:3(t){6 i=M;I(i=q.14?q.Y[t]["3D-1u"]:p.9(t).12("1M-3D-1u"),"1q"!=1v i&&M!==i){6 a=i.3H(0,1);i="."==a||"#"==a?e(i).1u():i,l.9(t).17(i)}},18:3(e){1F(6 t=e,i=0;i<=q.18&&!(i>=p.A-e);i++)4.1y(t+i,!0);1F(6 a=0;a<=q.18&&!(0>t-a);a++)4.1y(t-a,!0)},26:3(e,t){6 i=4;l.9(t).D(".Z").13("2i 3K",3(){l.9(t).8("2C")}),e===!1&&(l.9(t).J("2C")?i.18(t):l.9(t).D(".Z").13("2i 3K",3(){i.18(t)}))},1y:3(t,i){{6 a,n=4;p.A-t}q.18>p.A&&(q.18=p.A),q.2D===!0&&u<=q.3M&&(a=q.14?q.Y[t].2D:p.9(t).12("1M-3O-V")),a||(a=q.14?q.Y[t].V:p.9(t).12("1M-V"));6 s=0;i===!0&&(s=q.K+24),"1q"!=1v a&&""!==a?n.2S(a,t)?W(3(){l.9(t).J("1o")||(l.9(t).2B(n.3c(a,t)),n.1T(t),l.9(t).8("1o"),q.1O&&q.1z===!0&&U(h)),n.26(i,t)},s):W(3(){l.9(t).J("1o")||(l.9(t).2B(\'<1U E="Z" V="\'+a+\'" />\'),n.1T(t),l.9(t).8("1o")),n.26(i,t)},s):W(3(){I(!l.9(t).J("1o")){6 a=M;I(a=q.14?q.Y[t].1u:p.9(t).12("1M-1u"),"1q"!=1v a&&M!==a){6 s=a.3H(0,1);a="."==s||"#"==s?e(a).1u():a}"1q"!=1v a&&M!==a&&l.9(t).17(\'<j E="1m-1r" 2n="3q-19:\'+q.2x+\' !3B;"><j E="1m">\'+a+"</j></j>"),n.1T(t),l.9(t).8("1o 2C"),q.1O&&q.1z===!0&&U(h)}n.26(i,t)},s)},11:3(){I(q.11===!0){6 t=e("#B-2A > j").A;i.17("<j R=\'B-11\'><15 R=\'B-11-1Z\'></15> / <15 R=\'B-11-3T\'>"+t+"</15></j>")}},3A:3(){I(q.1h===!0&&p.A>1){6 t=4,a="";q.1i||(a=\'<15 E="1K 3x"><i E="3V-3W-3X-16" 3Y-3Z="2d"></i></15>\'),i.17(\'<j E="G-1r"><j E="G-3w">\'+a+\'</j><j E="G-1H"></j></j>\'),r=i.D(".G-1r"),s.3o(\'<a E="3u-G"></a>\'),s.45().8("46-G"),i.D(".3u-G").Q("10 1j",3(){i.8("O"),t.H()&&"7"===q.1k&&(l.9(b).2y().F("P-7").8("N-7"),l.9(b).2t().F("N-7").8("P-7"))}),i.D(".G-1r .1K").Q("10 1j",3(){i.F("O")});6 n,o=i.D(".G-3w"),d=i.D(".G-1H"),u="";I(q.14)1F(6 m=0;m<q.Y.A;m++)n=q.Y[m].G,u+=\'<j E="G"><1U V="\'+n+\'" /></j>\';22 p.2l(3(){n=q.1R===!1||"1q"==1v e(4).12(q.1R)||M===e(4).12(q.1R)?e(4).D("1U").12("V"):e(4).12(q.1R),u+=\'<j E="G"><1U V="\'+n+\'" /></j>\'});I(d.17(u),c=d.D(".G"),c.1l({"4e-2e":q.1B+"1N",19:q.1g+"1N"}),q.X===!0){6 f=p.A*(q.1g+q.1B);i.D(".G-1H").1l({19:f+"1N",4h:"4i","23-2O":q.K+"2K"})}c.Q("10 1j",3(){w=!0;6 i=e(4).1b();c.F("1W"),e(4).8("1W"),t.7(i),t.X(i),U(h)}),o.2B(\'<15 E="3x 4m">\'+q.3t.3v+" ("+c.A+")</15>"),q.1i&&i.8("O")}},X:3(e){I(q.X===!0){6 t,a=i.D(".G-1r").19();3N(q.3y){2o"1c":t=0;2E;2o"3C":t=a/2-q.1g/2;2E;2o"2e":t=a-q.1g}6 n=(q.1g+q.1B)*e-1-t,l=p.A*(q.1g+q.1B);n>l-a&&(n=l-a),0>n&&(n=0),4.H()?i.D(".G-1H").1l("4r","4s(-"+n+"1N, 3L, 3L)"):i.D(".G-1H").28({1c:-n+"1N"},q.K)}},2F:3(){6 e=4;q.2u===!0&&p.A>1&&(i.17(\'<j R="B-4v"><a R="B-N"></a><a R="B-P"></a></j>\'),s=i.D("#B-N"),o=i.D("#B-P"),s.Q("10",3(){e.1G(),U(h)}),o.Q("10",3(){e.1A(),U(h)}))},2G:3(){6 e=4;q.1O===!0&&(h=4w(3(){b=b+1<p.A?b:-1,b++,e.7(b)},q.2P))},3r:3(){6 t=4;e(1d).Q("3J.L",3(e){e.1C(),e.1Y(),37===e.1P&&(t.1G(),U(h)),38===e.1P&&q.1h===!0&&p.A>1?i.J("O")||(t.H()&&"7"===q.1k&&(l.9(b).2y().F("P-7").8("N-7"),l.9(b).2t().F("N-7").8("P-7")),i.8("O")):39===e.1P&&(t.1A(),U(h)),40===e.1P&&q.1h===!0&&p.A>1&&!q.1i?i.J("O")&&i.F("O"):q.3e===!0&&27===e.1P&&(!q.1i&&i.J("O")?i.F("O"):v.21(!1))})},1A:3(){6 e=4;b=l.1b(l.9(d)),b+1<p.A?(b++,e.7(b)):q.1Q?(b=0,e.7(b)):q.1h===!0&&p.A>1&&!q.1i?i.8("O"):(l.9(b).D(".Z").8("2e-1V"),W(3(){l.D(".Z").F("2e-1V")},24)),e.X(b),q.36.1e(4,v)},1G:3(){6 e=4;b=l.1b(l.9(d)),b>0?(b--,e.7(b)):q.1Q?(b=p.A-1,e.7(b)):q.1h===!0&&p.A>1&&!q.1i?i.8("O"):(l.9(b).D(".Z").8("1c-1V"),W(3(){l.D(".Z").F("1c-1V")},24)),e.X(b),q.35.1e(4,v)},7:3(t){6 i=4;I(C?(W(3(){i.1y(t,!1)},q.K+24),n.J("13")||n.8("13"),4.H()&&""!==q.K&&(n.J("K")||n.8("K"),x===!1&&(n.1l("23-2O",q.K+"2K"),x=!0)),4.H()&&""!==q.2m&&(n.J("2j")||n.8("2j"),T===!1&&(n.1l("23-2j-3",q.2m),T=!0)),q.3b.1e(4,v)):i.1y(t,!1),"7"===q.1k){6 a=M!==2J.4C.1E(/4D/i);!4.H()||n.J("7")||a?4.H()&&!n.J("2r-1c")&&a&&n.8("2r-1c"):n.8("7"),4.H()||C?!4.H()&&C&&n.28({1c:1D*-t+"%"},q.K,q.25):n.1l({1c:1D*-t+"%"})}22"29"===q.1k&&(4.H()&&!n.J("29-m")?n.8("29-m"):4.H()||n.J("28")||n.8("28"),4.H()||C?!4.H()&&C&&(l.9(d).2N(q.K,q.25),l.9(t).2Y(q.K,q.25)):(l.2N(1D),l.9(t).2Y(1D)));I(t+1>=p.A&&q.1O&&q.1Q===!1&&U(h),l.9(d).F("1Z"),l.9(t).8("1Z"),4.H()&&"7"===q.1k&&(w===!1?(e(".N-7").F("N-7"),e(".P-7").F("P-7"),l.9(t-1).8("N-7"),l.9(t+1).8("P-7")):(l.9(t).2y().F("P-7").8("N-7"),l.9(t).2t().F("N-7").8("P-7"))),q.1h===!0&&p.A>1&&(c.F("1W"),c.9(t).8("1W")),q.2u&&q.3n&&q.1Q===!1&&p.A>1){6 r=p.A;r=4H(r)-1,0===t?(s.8("1x"),o.F("1x")):t===r?(s.F("1x"),o.8("1x")):s.4J(o).F("1x")}d=t,C===!1?q.3i.1e(4,v):q.3a.1e(4,v),W(3(){C=!0}),w=!1,q.11&&e("#B-11-1Z").4K(t+1),e(1d).Q("2k.L",3(){W(3(){i.X(t)},4L)})}};1t v.4M=3(){1t g===!0?!0:!1},v.21=3(t){g=!1,t="1q"!=1v t?!1:!0,q.34.1e(4,v);6 n=C;C=!1,T=!1,x=!1,w=!1,U(h),t===!0&&p.1S("10 2h 2p"),e(".1I-1f").1S("2Q 2R"),e("1n").1S("2p.L 2M.L 1j.L"),e(1d).1S("2k.L 3J.L"),n===!0&&(i.8("29-m"),W(3(){a.4O(),e("1n").F("1I-1f")},4P)),q.2W.1e(4,v)},S.1w(),4}}(4Q);',62,301,'|||function|this||var|slide|addClass|eq||||||||||div|||||||||||||||||length|lg||find|class|removeClass|thumb|doCss|if|hasClass|speed|lightGallery|null|prev|open|next|bind|id|||clearInterval|src|setTimeout|animateThumb|dynamicEl|object|click|counter|attr|on|dynamic|span||append|preload|width|iframe|index|left|window|call|gallery|thumbWidth|thumbnail|showThumbByDefault|touchend|mode|css|video|body|loaded|com|undefined|cont|pageX|return|html|typeof|init|disabled|loadContent|videoAutoplay|nextSlide|thumbMargin|preventDefault|100|match|for|prevSlide|inner|light|selector|close|www|data|px|auto|keyCode|loop|exThumbImage|off|addHtml|img|end|active|be|stopPropagation|current||destroy|else|transition|400|easing|loadObj||animate|fade|targetTouches|originalEvent|enableTouch|true|right|embed|outer|touch|load|timing|resize|each|cssEasing|style|case|touchstart|in|use|vimeo|nextAll|controls|frameborder|amp|videoMaxWidth|prevAll|youtubePlayerParams|slider|prepend|complete|mobileSrc|break|slideTo|autoStart|closeSlide|closable|navigator|ms|pageY|touchmove|fadeOut|duration|pause|mousedown|mouseup|isVideo|document|void|youtu|onCloseAfter|watch|fadeIn|z0|9_|getWidth|9a|_|onBeforeClose|onSlidePrev|onSlideNext||||onSlideAfter|onSlideBefore|loadVideo|autoplay|escKey|wmode|opaque|structure|onOpen|560|height|315|children|hideControlOnEnd|after|allowfullscreen|max|keyPress|showAfterLoad|lang|cl|allPhotos|info|ib|currentPagerPosition|useCSS|buildThumbnail|important|middle|sub|vimeoColor|enableDrag|50|substring|swipeThreshold|keyup|error|0px|mobileSrcMaxWidth|switch|responsive|640|CCCCCC|allowFullScreen|photos|all|mozallowfullscreen|bUi|iCn|rMv|aria|hidden||All|webkitAllowFullScreen|color|portrait|parent|has|byline|player|http|youtube|855px|param|rel|margin|4e3|createTouch|position|relative|ontouchstart|onmsgesturechange|msMaxTouchPoints|count|extend|600|documentElement|KhtmlTransition|transform|translate3d|msTransition|linear|action|setInterval|OTransition|ease|WebkitTransition|MozTransition|is|userAgent|iPad|fn|target|show|parseInt|strict|add|text|200|isActive|opacity|remove|500|jQuery'.split('|'),0,{}))
;// debouncing function from John Hann
// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
var debounce = function (func, threshold, execAsap) {
    var timeout;

    return function debounced () {
        var obj = this, args = arguments;
        function delayed () {
            if (!execAsap)
                func.apply(obj, args);
            timeout = null;
        };

        if (timeout)
            clearTimeout(timeout);
        else if (execAsap)
            func.apply(obj, args);

        timeout = setTimeout(delayed, threshold || 100);
    };
};;(function () {

  var Rollerblade = (function(){

    function Rollerblade(element, options) {

      var _ = this;

      _.settings = $.extend($.fn.rollerblade.defaults, options);
      _.container = $(element);
      _.image = _.container.find('img');
      _.oldX = 0;
      _.oldDiff = null;
      _.lastMove = "none";
      _.lastMoveConstant = "none";
      _.previousX = 0;
      _.i = 0;
      _.iAuto = 0;
      _.sensitivity = _.settings.sensitivity;
      _.mobileRate = _.settings.sensitivity / 3;
      _.images = _.settings.imageArray;
      _.preloadImages = [];
      _.timer = null;
      _.touchOnThis = false;
      _.init();
    }

    Rollerblade.prototype.init = function() {

      var _ = this;

      if (_.settings.auto === true) {

        _.auto(_.sensitivity);

      } else {
        // Test for smartphone browser.
        // Source : http://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-handheld-device-in-jquery
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
          _.touchIsMoving();
        } else if(_.settings.drag === true ){
          _.drag();
          _.image.addClass('rollerblade-drag');
        } else if (_.settings.drag === false) {
          _.mouseIsMoving();
        }
      }
      _.preload(_.images);

    }

    Rollerblade.prototype.preload = function(imageArray) {

      var _ = this;

      if (!_.preloadImages.list) {
            _.preloadImages.list = [];
        }
        for (var i = 0; i < imageArray.length; i++) {
            var img = new Image();
            img.onload = function() {
                var index = _.preloadImages.list.indexOf(this);
                if (index !== -1) {
                    // remove this one from the array once it's loaded
                    // for memory consumption reasons
                    _.preloadImages.splice(index, 1);
                }
            }
            _.preloadImages.list.push(img);
            img.src = imageArray[i];
        }

    }

    Rollerblade.prototype.increment = function() {

      var _ = this;

      _.iAuto++;

      if (_.iAuto >= _.images.length) {
        _.iAuto = 0;
      }

      _.image.attr('src', _.images[_.iAuto]);

    }

    Rollerblade.prototype.decrement = function() {

      var _ = this;

      _.iAuto--;

      if (_.iAuto < 0) {
        _.iAuto = _.images.length -1;
      }

      _.image.attr('src', _.images[_.iAuto]);

    }

    Rollerblade.prototype.auto = function(speed) {

      var _ = this;

      _.timer = setInterval(function() {

        _.iAuto++;

        if (_.iAuto >= _.images.length) {
          _.iAuto = 0;
        }
        _.image.attr('src', _.images[_.iAuto]);

      }, speed);
    }

    Rollerblade.prototype.autoStop = function() {

      var _ = this;

       clearInterval(_.timer);
    }

    Rollerblade.prototype.drag = function() {

      var _ = this;
      var dragging = false;

      document.ondragstart = function () { return false; };

      _.image.mousedown(function(e) {
        e.preventDefault;
        if (!dragging) {
          dragging = true;
        }
      });

      $("body").mousemove(function(e) {
        e.preventDefault;
        if (dragging) {
          var xcoord = e.clientX;

          _.changeLogic(xcoord, _.sensitivity);
        }
      });

      $("body").mouseup(function(e) {
        e.preventDefault;
        if(dragging) {
          dragging = false;
        }
      });
    }


    Rollerblade.prototype.mouseIsMoving = function() {

      var _ = this;

      $("body").mousemove(function(e) {

        var xcoord = e.pageX;
        var deviceRate = _.sensitivity;

        _.changeLogic(xcoord, deviceRate);

      });
    }

    Rollerblade.prototype.touchIsMoving = function() {

      var _ = this;

      _.container.on('touchstart', function() {

        _.touchOnThis = true;

      });

      $(window).on('touchmove', function(ev) {

        var e = ev.originalEvent;
        var xcoord = e.pageX;
        var deviceRate = _.mobileRate;

        if (_.touchOnThis) {

          _.changeLogic(xcoord, deviceRate);
        }


      });

      $(window).on('touchend', function() {
        _.touchOnThis = false;
      });
    }

    Rollerblade.prototype.changeLogic = function(xcoord, deviceRate) {

      var _ = this;

      if(_.oldDiff === null) {
      // If this is the first move, set _.oldDiff to
      // the current x coordinate and call the rotate method
      // at this current coordinate.
      _.oldDiff = xcoord;
      _.rotate(xcoord);

      }

      // Set the last direction moved for use in the
      // conditionals below.
      if( xcoord > _.oldDiff ) {
        _.lastMoveConstant = 'right';
      } else if (xcoord < _.oldDiff ) {
        _.lastMoveConstant = 'left';
      };


      if ( xcoord > _.previousX && _.lastMoveConstant === 'left' ) {
        // If moving right AND the last move was to the left, reset
        // oldDiff to current x position and iterate i by 1 to fix
        // image repition bug.

        _.oldDiff = xcoord;
        _.i++;


      } else if ( xcoord < _.previousX && _.lastMoveConstant === 'right' ) {
        // If moving left AND the last move was to the right, reset
        // oldDiff to current x position and de-iterate i by 1 to fix
        // image repition bug.

        _.oldDiff = xcoord;
        _.i--;

      }

      // Only call the rotate method when amount of pixels traveled
      // is greater than the specified rate.
      if (Math.abs(xcoord - _.oldDiff) > deviceRate) {

        _.rotate(xcoord);

        _.oldDiff = xcoord;
      }

      _.previousX = xcoord;

    }

    Rollerblade.prototype.rotate = function(xcoord) {

      var _ = this;

      if(xcoord > _.oldX) {
        // moving right.

        if(_.lastMove === 'left') {
          // Fixes glitch when changing directions.
          _.i++;
        }

        if(_.i > _.images.length) {
          if (!_.settings.edgeStop) {
            _.i = 0;
          } else {
            _.i = _.images.length;
          }
        }

        _.image.attr('src', _.images[_.i]);

        if (_.i >= _.images.length) {
          if (!_.settings.edgeStop) {
            _.i = 0;
          } else {
            _.i = _.images.length;
          }
        } else {
          _.i++;
        }

        // Record last move direction.
        _.lastMove = 'right';

      } else if( xcoord < _.oldX ) {
        // moving left.

        if(_.lastMove === 'right') {
          // Fixes glitch when changing directions.
          _.i--;
        }

        if(_.i < 0) {
          if (!_.settings.edgeStop) {
            _.i = _.images.length;
          } else {
            _.i = 0;
          }
        }

        _.image.attr('src', _.images[_.i]);

        if (_.i <= 0) {
          if (!_.settings.edgeStop) {
            _.i = _.images.length;
          } else {
            _.i = 0;
          }
        } else {
          _.i--;
        }

        // Record last move direction.
        _.lastMove = 'left';

      }

      // Record the last x position for use when the method is called again.
      _.oldX = xcoord;

    }

    return Rollerblade;

  })();

  $.fn.rollerblade = function (options) {
    var instance;

    instance = this.data('rollerblade');
    if (!instance) {
      return this.each(function() {
        return $(this).data('rollerblade', new Rollerblade(this, options));
      });
    }
    if (options === true) return instance;
    if ($.type(options) === 'string') instance[options]();
    return this;
  };

  $.fn.rollerblade.defaults = {
    imageArray : [],
    sensitivity: 35,
    drag : true,
    auto : false,
    edgeStop: false
  };

}).call(this);
;(function($,sr){
  jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };
})(jQuery,'smartresize');;(function($,sc){
    jQuery.fn[sc] = function(fn, threshold){  return fn ? this.bind('scroll', debounce(fn, threshold)) : this.trigger(sc); };
})(jQuery,'smartscroll');;function whichTransitionEvent(){
  var t;
  var el = document.createElement('fakeelement');
  var transitions = {
    'transition':'transitionend',
    'OTransition':'oTransitionEnd',
    'MozTransition':'transitionend',
    'WebkitTransition':'webkitTransitionEnd'
  };

  for(t in transitions){
    if( el.style[t] !== undefined ){
      return transitions[t];
    }
  }
};jQuery(document).ready(function($) {
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
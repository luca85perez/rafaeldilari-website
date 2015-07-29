(function() {
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

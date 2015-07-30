(function() {
  'use strict';
  var $btn = $('.js-float-btn');

  if ($btn.length) {
    var $w = $(window);
    var $d = $(document);
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
  }


}());

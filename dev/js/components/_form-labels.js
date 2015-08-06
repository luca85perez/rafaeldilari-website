(function() {
  'use strict';

  var $form = $('.js-form');

  if ($form.length) {
    var $inputs = $form.find('input:not([type="submit"])');
    var $textarea = $form.find('textarea');
    var $label;

    var initEvents = function($el){
      $el
        .on('focus', function(){
          $label = $(this).parent().prev();
          $label.addClass('is-hidden');
        })
        .on('blur', function(){
          if ( $(this).val() === '' ) {
            $label.removeClass('is-hidden');
          }
        });
    };

    initEvents($inputs);
    initEvents($textarea);
  }

}());

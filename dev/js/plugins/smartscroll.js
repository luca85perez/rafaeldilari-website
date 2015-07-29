(function($,sc){
    jQuery.fn[sc] = function(fn, threshold){  return fn ? this.bind('scroll', debounce(fn, threshold)) : this.trigger(sc); };
})(jQuery,'smartscroll');
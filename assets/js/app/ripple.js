
/**
 * Apply origamRipple
 */

(function ($, w) {

    var origamRipple = function () {

        var
            defaults = {};

        return {
            init: function (opt) {
                opt = $.extend({}, defaults, opt || {});

                //For each selected DOM element
                return this.each(function () {
                    var event = this;
                    var $element = $(event);
                    var options = $.extend({}, opt);

                    $element
                        .css({
                            position: 'relative',
                            overflow: 'hidden'
                        })
                        .bind('mousedown', function(e) {
                            var ripple;

                            if ($element.find('.ripple').length === 0) {

                                ripple = $('<span/>').addClass('ripple');

                                if ($element.attr('data-ripple'))
                                {
                                    ripple.addClass('ripple-' + $element.attr('data-ripple'));
                                }

                                $element.prepend(ripple);
                            }
                            else
                            {
                                ripple = $element.find('.ripple');
                            }

                            ripple.removeClass('ripple-is--animated');

                            if (!ripple.height() && !ripple.width())
                            {
                                var diameter = Math.max($element.outerWidth(), $element.outerHeight());

                                ripple.css({ height: diameter, width: diameter });
                            }

                            var x = e.pageX - $element.offset().left - ripple.width() / 2;
                            var y = e.pageY - $element.offset().top - ripple.height() / 2;

                            ripple.css({ top: y+'px', left: x+'px' }).addClass('ripple-is--animated');

                            setTimeout(function()
                            {
                                ripple.removeClass('ripple-is--animated');
                            }, 651);
                        });
                });
            }
        };

    }();

    $.fn.extend({
        origamRipple: origamRipple.init
    });

})(jQuery, window);


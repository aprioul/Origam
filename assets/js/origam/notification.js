
/**
 * Apply origamNotification
 */

(function ($, w) {

    var origamNotification = function () {

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

                });
            }
        }

    }();

    $.fn.extend({
        origamNotification: origamNotification.init
    });

})(jQuery, window);
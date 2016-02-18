
/**
 * Apply origamRipple
 */

(function ($, w) {
    'use strict';

    // RIPPLE CLASS DEFINITION
    // ======================

    var Ripple   = function (element, options) {
        this.type       = null;
        this.options    = null;
        this.$element   = null;

        this.init('ripple', element, options)
    };

    Ripple.VERSION = '0.1.0';

    Ripple.TRANSITION_DURATION = 651;

    Ripple.prototype.init = function (type, element, options) {
        this.type       = type;
        this.$element   = $(element);

        this.$element.on('mousedown', $.proxy(this.show, this));

    };

    Ripple.prototype.show = function (e) {
        this.$element.css({
            position: 'relative',
            overflow: 'hidden'
        });

        var ripple;

        if (this.$element.find('.ripple').length === 0) {

            ripple = $('<span/>').addClass('ripple');

            if (this.$element.attr('data-ripple'))
            {
                ripple.addClass('ripple-' + this.$element.attr('data-ripple'));
            }

            this.$element.prepend(ripple);
        }
        else
        {
            ripple = this.$element.find('.ripple');
        }

        ripple.removeClass('animated');

        if (!ripple.height() && !ripple.width())
        {
            var diameter = Math.max(this.$element.outerWidth(), this.$element.outerHeight());

            ripple.css({ height: diameter, width: diameter });
        }

        var x = e.pageX - this.$element.offset().left - ripple.width() / 2;
        var y = e.pageY - this.$element.offset().top - ripple.height() / 2;

        ripple.css({ top: y+'px', left: x+'px' }).addClass('animated');

        function removeElement() {
            ripple.removeClass('animated');
        }

        $.support.transition ?
            this.$element
                .one('origamTransitionEnd', removeElement)
                .emulateTransitionEnd(Ripple.TRANSITION_DURATION) :
            removeElement()
    };


    // RIPPLE PLUGIN DEFINITION
    // =======================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data  = $this.data('origam.ripple');

            if (!data) $this.data('origam.ripple', (data = new Ripple(this)));
            if (typeof option == 'string') data[option].call($this)
        })
    }

    var old = $.fn.ripple;

    $.fn.ripple             = Plugin;
    $.fn.ripple.Constructor = Ripple;


    // RIPPLE NO CONFLICT
    // =================

    $.fn.ripple.noConflict = function () {
        $.fn.ripple = old
        return this
    };


    // RIPPLE DATA-API
    // ==============

    $(document).ready(function() {
        $('[data-button="ripple"]').ripple();
    });

})(jQuery, window);


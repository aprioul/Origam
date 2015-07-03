
/**
 * Apply origamRipple
 */

(function ($, w) {
    'use strict';

    // Ripple CLASS DEFINITION
    // ======================

    var dismiss = '[data-dismiss="ripple"]';
    var Ripple   = function (el) {
        $(el).on('mousedown', dismiss, this.ripple)
    };

    Ripple.VERSION = '1.0.0';

    Ripple.TRANSITION_DURATION = 651;

    Ripple.prototype.ripple = function (e) {
        var $this    = $(this);

        $this.css({
            position: 'relative',
            overflow: 'hidden'
        });

        var ripple;

        if ($this.find('.ripple').length === 0) {

            ripple = $('<span/>').addClass('ripple');

            if ($this.attr('data-ripple'))
            {
                ripple.addClass('ripple-' + $this.attr('data-ripple'));
            }

            $this.prepend(ripple);
        }
        else
        {
            ripple = $this.find('.ripple');
        }

        ripple.removeClass('animated');

        if (!ripple.height() && !ripple.width())
        {
            var diameter = Math.max($this.outerWidth(), $this.outerHeight());

            ripple.css({ height: diameter, width: diameter });
        }

        var x = e.pageX - $this.offset().left - ripple.width() / 2;
        var y = e.pageY - $this.offset().top - ripple.height() / 2;

        ripple.css({ top: y+'px', left: x+'px' }).addClass('animated');

        function removeElement() {
            ripple.removeClass('animated');
        }

        $.support.transition ?
            $this
                .one('origamTransitionEnd', removeElement)
                .emulateTransitionEnd(Ripple.TRANSITION_DURATION) :
            removeElement()
    };


    // Ripple PLUGIN DEFINITION
    // =======================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data  = $this.data('origam.ripple');

            if (!data) $this.data('origam.ripple', (data = new Ripple(this)));
            if (typeof option == 'string') data[option].call($this)
        })
    }

    var old = $.fn.Ripple;

    $.fn.Ripple             = Plugin;
    $.fn.Ripple.Constructor = Ripple;


    // Ripple NO CONFLICT
    // =================

    $.fn.Ripple.noConflict = function () {
        $.fn.Ripple = old
        return this
    };


    // Ripple DATA-API
    // ==============

    $(document).on('click.origam.Ripple.data-api', dismiss, Ripple.prototype.ripple)

})(jQuery, window);


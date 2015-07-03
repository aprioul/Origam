
/**
 * Apply origamClose
 */

(function ($, w) {
    'use strict';

    // Close CLASS DEFINITION
    // ======================

    var dismiss = '[data-dismiss="close"]';
    var Close   = function (el) {
        $(el).on('click', dismiss, this.close)
    };

    Close.VERSION = '1.0.0';

    Close.TRANSITION_DURATION = 1000;

    Close.prototype.close = function (e) {

        var $this    = $(this);
        var selector = $this.attr('data-target');

        if (!selector) {
            selector = $this.attr('href');
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '');// strip for ie7
        }

        var $parent = $(selector);

        if (e) e.preventDefault();

        if (!$parent.length) {
            $parent = $this.closest('.alert')
        }

        $parent.trigger(e = $.Event('close.origam.close'));

        var animate = $parent.attr('data-animate');
        var animation = $parent.attr('data-animation');

        if (animate) {
            if(animation){$parent.addClass(animation);}
            else{$parent.addClass('fadeOut');}
            $parent.addClass('animated');
        }

        if (e.isDefaultPrevented()) return;

        function removeElement() {
            // detach from parent, fire event then clean up data
            $parent.detach().trigger('closed.origam.close').remove()
        }

        $.support.transition ?
            $parent
                .one('origamTransitionEnd', removeElement)
                .emulateTransitionEnd(Close.TRANSITION_DURATION) :
            removeElement()
    };


    // Close PLUGIN DEFINITION
    // =======================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data  = $this.data('origam.close');

            if (!data) $this.data('origam.close', (data = new Close(this)));
            if (typeof option == 'string') data[option].call($this)
        })
    }

    var old = $.fn.Close;

    $.fn.Close             = Plugin;
    $.fn.Close.Constructor = Close;


    // Close NO CONFLICT
    // =================

    $.fn.Close.noConflict = function () {
        $.fn.Close = old
        return this
    };


    // Close DATA-API
    // ==============

    $(document).on('click.origam.Close.data-api', dismiss, Close.prototype.close)

})(jQuery, window);
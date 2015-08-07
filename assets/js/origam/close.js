
/**
 * Apply origamClose
 */

(function ($, w) {
    'use strict';

    // CLOSE CLASS DEFINITION
    // ======================

    var app = '[data-button="close"]';
    var Close   = function (el) {
        $(el).on('click', app, this.close)
    };

    Close.VERSION = '0.1.0';

    Close.TRANSITION_DURATION = 1000;

    Close.prototype.close = function (e) {

        var $this    = $(this),
            selector = $this.attr('data-target'),
            type = $this.attr('data-type'),
            overlay = false;

        if (!selector) {
            selector = $this.attr('href');
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '');// strip for ie7
        }

        var $parent = $(selector);

        if (e) e.preventDefault();

        if (!$parent.length) {
            $parent = $this.closest('.alert');
        } else {
            if(typeof type !== 'undefined' && type === 'overlay'){
                overlay = true;
                $overlay = $this;
            } else {
                var $overlay = $('body').find('[data-type="overlay"]');
                if ($overlay.length) {
                    if(typeof selector !== 'undefined' && selector == $overlay.attr('data-target')) {
                        overlay = true;
                    }
                }
            }
        }

        $parent.trigger(e = $.Event('close.origam.close'));

        var animate = $parent.attr('data-animate');
        var animation = $parent.attr('data-animation');

        if (animate) {
            if(animation){$parent.addClass(animation);}
            else{$parent.addClass('fadeOut');}
            $parent.addClass('animated');
            var animateClass = animation + ' animated';
        }

        if (e.isDefaultPrevented()) return;

        function removeElement() {
            if ($parent.hasClass(animateClass))
                $parent.removeClass(animateClass);
            $parent
                .detach()
                .trigger('closed.origam.close')
                .remove();
            if(overlay) {
                $overlay
                    .detach()
                    .remove();
            }
        }

        $.support.transition ?
            $parent
                .one('origamTransitionEnd', removeElement)
                .emulateTransitionEnd(Close.TRANSITION_DURATION) :
            removeElement()
    };


    // CLOSE PLUGIN DEFINITION
    // =======================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data  = $this.data('origam.close');

            if (!data) $this.data('origam.close', (data = new Close(this)));
            if (typeof option == 'string') data[option].call($this)
        })
    }

    var old = $.fn.close;

    $.fn.close             = Plugin;
    $.fn.close.Constructor = Close;


    // CLOSE NO CONFLICT
    // =================

    $.fn.close.noConflict = function () {
        $.fn.close = old
        return this
    };


    // CLOSE DATA-API
    // ==============

    $(document).on('click.origam.Close.data-api', app, Close.prototype.close)

})(jQuery, window);
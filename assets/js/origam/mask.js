/**
 * Apply origamMask
 */

(function ($, w) {
    'use strict';

    // MASK CLASS DEFINITION
    // ======================

    var Mask = function (element, options) {
        this.type       = null;
        this.options    = null;
        this.$element   = null;

        this.init('mask', element, options)
    };

    if (!$.fn.input) throw new Error('Notification requires input.js');

    Mask.VERSION = '0.1.0';

    Mask.TRANSITION_DURATION = 1000;

    Mask.DEFAULTS = $.extend({}, $.fn.input.Constructor.DEFAULTS, {
        definitions: {
            "9": "[0-9]",
            a: "[A-Za-z]",
            "*": "[A-Za-z0-9]",
            "~": "[+-]"
        },
        mask: "9999 9999 9999 9999"
    });

    Mask.prototype = $.extend({}, $.fn.input.Constructor.prototype);

    Mask.prototype.constructor = Mask;

    Mask.prototype.event = function (options) {
        // Element collection
        this.options    = this.getOptions(options);
        this.mask     = this.options.mask;

        this.$element.on('keyup input', $.proxy(this.keyEvent, this));
    };

    Mask.prototype.getDefaults = function () {
        return Mask.DEFAULTS
    };

    Mask.prototype.keyEvent = function () {
        this.val      = this.$element.val();


    };

    // MASK PLUGIN DEFINITION
    // =======================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data  = $this.data('origam.mask');

            if (!data) $this.data('origam.mask', (data = new Mask(this)));
            if (typeof option == 'string') data[option].call($this)
        })
    }

    var old = $.fn.mask;

    $.fn.mask             = Plugin;
    $.fn.mask.Constructor = Mask;


    // MASK NO CONFLICT
    // =================

    $.fn.mask.noConflict = function () {
        $.fn.mask = old;
        return this
    };


    // MASK DATA-API
    // ==============

    $(document).ready(function() {
        $('[data-form="mask"]').mask();
    });

})(jQuery, window);

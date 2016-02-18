
/**
 * Apply origamRangePicker
 */

(function ($, w) {

    'use strict';

    // RANGE PUBLIC CLASS DEFINITION
    // ===============================

    var Range = function (element, options) {
        this.type       = null;
        this.options    = null;
        this.$element   = null;

        this.init('range', element, options)
    };

    if (!$.fn.input) throw new Error('Range requires input.js');

    Range.VERSION  = '0.1.0';

    Range.TRANSITION_DURATION = 1000;

    Range.DEFAULTS = $.extend({}, $.fn.input.Constructor.DEFAULTS, {
        templateHue: '<div class="range-hue"></div>',
        templateHueSelector: '<div class="range-hue--arrs"></div>',
        templateHueSelectorLeft: '<div class="range-hue--larr"></div>',
        templateHueSelectorRight: '<div class="range-hue--rarr"></div>',
        type: "single",
        circle: false,
        editable: true
    });

    Range.prototype = $.extend({}, $.fn.input.Constructor.prototype);

    Range.prototype.constructor = Range;

    Range.prototype.event = function (options) {

    };

    // RANGE PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('origam.range');
            var options = typeof option == 'object' && option;

            if (!data) $this.data('origam.range', (data = new Range(this, options)));
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.range;

    $.fn.range             = Plugin;
    $.fn.range.Constructor = Range;


    // RANGE NO CONFLICT
    // ===================

    $.fn.input.noConflict = function () {
        $.fn.range = old;
        return this
    };

    $(document).ready(function() {
        $('[data-form="range"]').range();
        $('[type="range"]').range();
    });

})(jQuery, window);

/**
 * Apply origamDatePicker
 */

(function ($, w) {

    'use strict';

    // DATE PUBLIC CLASS DEFINITION
    // ===============================

    var Date = function (element, options) {
        this.type       = null;
        this.options    = null;
        this.$element   = null;

        this.init('date', element, options)
    };

    if (!$.fn.input) throw new Error('Datepicker requires input.js');

    Date.VERSION  = '0.1.0';

    Date.TRANSITION_DURATION = 1000;

    Date.DEFAULTS = $.extend({}, $.fn.input.Constructor.DEFAULTS, {
        templateWrapper: '<div class="origam-datepick"></div>',
        templateview: '<div class="origam-datepick--view"></div>',
        templatecalendar: '<div class="origam-datepick--calendar"></div>',
        templateSubmit: '<div class="origam-colorpick--submit btn btn-ghost"></div>',
        timeDefined: false,
        max: '',
        min: ''
    });

    Date.prototype = $.extend({}, $.fn.input.Constructor.prototype);

    Date.prototype.constructor = Date;

    Date.prototype.event = function (options) {
        
    };

    // DATE PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('origam.date');
            var options = typeof option == 'object' && option;

            if (!data) $this.data('origam.date', (data = new Date(this, options)));
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.date;

    $.fn.date             = Plugin;
    $.fn.date.Constructor = Date;


    // DATE NO CONFLICT
    // ===================

    $.fn.input.noConflict = function () {
        $.fn.date = old;
        return this
    };

    $(document).ready(function() {
        $('[data-form="date"]').date();
    });

})(jQuery, window);
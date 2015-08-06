/**
 * Apply origamSelect
 */

// SELECT PLUGIN DEFINITION
// =========================

(function ($, w) {

    'use strict';

    // SELECT PUBLIC CLASS DEFINITION
    // ===============================

    var Select = function (element, options) {
        this.type = null;
        this.options = null;
        this.$element = null;

        this.init('select', element, options)
    };

    if (!$.fn.input) throw new Error('Select requires input.js');

    Select.VERSION = '0.1.0';

    Select.TRANSITION_DURATION = 1000;

    Select.DEFAULTS = $.extend({}, $.fn.input.Constructor.DEFAULTS, {});

    Select.prototype = $.extend({}, $.fn.input.Constructor.prototype);

    Select.prototype.constructor = Select;

    Select.prototype.event = function (options) {

    };

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('origam.select');
            var options = typeof option == 'object' && option;

            if (!data) $this.data('origam.select', (data = new Select(this, options)));
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.select;

    $.fn.select = Plugin;
    $.fn.select.Constructor = Select;


    // SELECT NO CONFLICT
    // ===================

    $.fn.input.noConflict = function () {
        $.fn.select = old;
        return this
    };

    $(document).ready(function () {
        $('[data-form="select"]').select();
    });

})(jQuery, window);
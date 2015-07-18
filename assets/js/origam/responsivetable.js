
/**
 * Apply origamTable
 *
 */

(function ($, w) {

    'use strict';

    // TABLE PUBLIC CLASS DEFINITION
    // ===============================

    var Table = function (element, options) {
        this.type       = null;
        this.options    = null;
        this.focus    = null;
        this.blur    = null;
        this.$element   = null;

        this.init('table', element, options)
    };

    Table.VERSION  = '0.1.0';

    Table.TRANSITION_DURATION = 1000;

    Table.DEFAULTS = {
        
    };

    Table.prototype.init = function (type, element, options) {
        
    };

    Table.prototype.getDefaults = function () {
        return Table.DEFAULTS
    };

    Table.prototype.getOptions = function (options) {
        options = $.extend({}, this.getDefaults(), this.$element.data(), options);

        return options
    };

    // TABLE PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('origam.table');
            var options = typeof option == 'object' && option;

            if (!data && /destroy|hide/.test(option)) return;
            if (!data) $this.data('origam.table', (data = new Table(this, options)));
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.table;

    $.fn.table             = Plugin;
    $.fn.table.Constructor = Table;


    // TABLE NO CONFLICT
    // ===================

    $.fn.table.noConflict = function () {
        $.fn.table = old;
        return this
    };

    $(document).ready(function() {
        $('[data-form="table"]').table();
    });

})(jQuery, window);


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
        addRowToggle: true,
        toggleSelector: ' > tbody > tr:not(.footable-row-detail)', //the selector to show/hide the detail row
        columnDataSelector: '> thead > tr:last-child > th, > thead > tr:last-child > td', //the selector used to find the column data in the thead
        detailSeparator: ':', //the separator character used when building up the detail row
        toggleHTMLElement: '<div />', // override this if you want to insert a click target rather than use a background image.
        classes: {
            main: 'responsivetable',
            loading: 'responsivetable-loading',
            loaded: 'responsivetable-loaded',
            toggle: 'responsivetable-toggle',
            disabled: 'responsivetable-disabled',
            detail: 'responsivetable-row-detail',
            detailCell: 'responsivetable-row-detail-cell',
            detailInner: 'responsivetable-row-detail-inner',
            detailInnerRow: 'responsivetable-row-detail-row',
            detailInnerGroup: 'responsivetable-row-detail-group',
            detailInnerName: 'responsivetable-row-detail-name',
            detailInnerValue: 'responsivetable-row-detail-value',
            detailShow: 'responsivetable-detail-show'
        }
    };

    Table.prototype.init = function (type, element, options) {
        this.type       = type;
        this.element    = element;
        this.$element   = $(element);
        this.options    = this.getOptions(options);

        var column = [];

        this.$element.find('thead th').each(function (index, e) {
            var $column = $(e);

            var priority = parseInt($column.data('priority'), 10);

            var priorityWidth = $column.outerWidth();
            $column.css('width', priorityWidth);

            (typeof(column[priority]) != 'undefined') ? column[priority]['width'] += priorityWidth : column[priority] = {width: priorityWidth};
        });

    };

    Table.prototype.getDefaults = function () {
        return Table.DEFAULTS
    };

    Table.prototype.getOptions = function (options) {
        options = $.extend({}, this.getDefaults(), this.$element.data(), options);

        return options
    };

    Table.prototype.addRowToggle = function () {

    };

    Table.prototype.toggleDetail = function () {

    };

    Table.prototype.setDetailRow = function () {

    };

    Table.prototype.tableResize = function () {

    };

    Table.prototype.CalculateWidth = function () {

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
        $('[data-app="table"]').table();
    });

})(jQuery, window);


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
        parsers: {
            alpha: function (cell) {
                return $(cell).data('value') || $.trim($(cell).text());
            },
            numeric: function (cell) {
                var val = $(cell).data('value') || $(cell).text().replace(/[^0-9.\-]/g, '');
                val = parseFloat(val);
                if (isNaN(val)) val = 0;
                return val;
            },
            currency: function (cell) {
                var val = $(cell).data('value') || $(cell).text().replace(/[^0-9\.]+/g, '');
                val = parseFloat(val);
                if (isNaN(val)) val = 0;
                return val;
            },
            date: function (cell) {
                var val = $(cell).data('value') || $(cell).text();
                val = new Date(val);
                val = Date.parse(val);
                return val;
            }
        },
        columnDataSelector: '> thead > tr:last-child > th, > thead > tr:last-child > td',
        classes: {
            main: 'origamtable',
            loading: 'origamtable-loading',
            loaded: 'origamtable-loaded'
        }
    };

    Table.prototype.init = function (type, element, options) {
        this.type           = type;
        this.element        = element;
        this.$element       = $(element);
        this.options        = this.getOptions(options);
        this.classes        = this.options.classes;
        this.$parent        = this.$element.parent();
        this.max            = this.$element.find('> thead > tr:last-child > th[data-priority], > thead > tr:last-child > td[data-priority]').length;
        this.indexOffset    = 0;


        var that = this,
            colData = [];

        this.$element.find(this.options.columnDataSelector).each(function (index, e) {
            var data = that.getColumnData(e);
            colData[data.index] = data;
        });

        this.columnsData = colData;

        this.$element.addClass(this.classes.loading);

        this.tableEvent();

        this.$element.removeClass(this.classes.loading);

        this.$element.addClass(this.classes.loaded).addClass(this.classes.main);

    };

    Table.prototype.getDefaults = function () {
        return Table.DEFAULTS
    };

    Table.prototype.getOptions = function (options) {
        options = $.extend({}, this.getDefaults(), this.$element.data(), options);

        return options
    };

    Table.prototype.getColumnData = function (e) {
        var $th = $(e),
            hide = $th.data('hide'),
            index = $th.index();

        hide = hide || false;
        var data = {
            'index': index,
            'hide': hide,
            'type': $th.data('type'),
            'name': $th.data('name') || $.trim($th.text()),
            'ignore': $th.data('ignore') || false,
            'sortIgnore': $th.data('sortignore') || false,
            'toggle': $th.data('toggle') || false,
            'className': $th.data('class') || null,
            'matches': [],
            'names': { },
            'group': $th.data('group') || null,
            'groupName': null,
            'isEditable': $th.data('editable'),
            'priority' : 'undefined',
            'width' : 0
        };

        if(typeof $th.data('priority') === 'undefined'){
            this.max = this.max + 1;
            $th.attr('data-priority', this.max);

        }

        data.priority = parseInt($th.data('priority'), 10);

        var priorityWidth = $th.outerWidth();
        $th.css('width', priorityWidth);

        data.width += priorityWidth;

        if (data.group !== null) {
            var $group = this.$element.find('> thead > tr.responsivetable-group-row > th[data-group="' + data.group + '"], > thead > tr.responsivetable-group-row > td[data-group="' + data.group + '"]').first();
            data.groupName = this.parse($group, { 'type': 'alpha' });
        }

        var pcolspan = parseInt($th.prev().attr('colspan') || 0, 10);
        this.indexOffset += pcolspan > 1 ? pcolspan - 1 : 0;
        var colspan = parseInt($th.attr('colspan') || 0, 10), curindex = data.index + this.indexOffset;
        if (colspan > 1) {
            var names = $th.data('names');
            names = names || '';
            names = names.split(',');
            for (var i = 0; i < colspan; i++) {
                data.matches.push(i + curindex);
                if (i < names.length) data.names[i + curindex] = names[i];
            }
        } else {
            data.matches.push(curindex);
        }

        this.data =  { 'column': { 'data': data, 'th': e } };
        return this.data.column.data;
    };

    Table.prototype.tableEvent = function () {
        return null;
    };

    Table.prototype.parse = function (cell, column) {
        var parser = this.options.parsers[column.type] || this.options.parsers.alpha;
        return parser(cell);
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

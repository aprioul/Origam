
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
        parsers: {  // The default parser to parse the value out of a cell (values are used in building up row detail)
            alpha: function (cell) {
                return $(cell).data('value') || $.trim($(cell).text());
            },
            numeric: function (cell) {
                var val = $(cell).data('value') || $(cell).text().replace(/[^0-9.\-]/g, '');
                val = parseFloat(val);
                if (isNaN(val)) val = 0;
                return val;
            }
        },
        addRowToggle: true,
        toggleSelector: ' > tbody > tr:not(.footable-row-detail)', //the selector to show/hide the detail row
        columnDataSelector: '> thead > tr:last-child > th, > thead > tr:last-child > td', //the selector used to find the column data in the thead
        detailSeparator: ':', //the separator character used when building up the detail row
        toggleTemplate: '<span class="origamicon origamicon-eye"></span>',
        priorityMin: 1,
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
            detailShow: 'responsivetable-detail-show',
            iconShow: 'origamicon-eye',
            iconHide: 'origamicon-eye-blocked'
        }
    };

    Table.prototype.init = function (type, element, options) {
        this.type           = type;
        this.element        = element;
        this.$element       = $(element);
        this.options        = this.getOptions(options);
        this.classes        = this.options.classes;
        this.$parent        = this.$element.parent();
        this.max            = this.$element.find('> thead > tr:last-child > th[data-priority], > thead > tr:last-child > td[data-priority]').length + 1;
        this.indexOffset    = 0;

        var that = this,
            colData = [];

        this.$element.addClass(this.classes.loading);

        // Get the column data once for the life time of the plugin
        this.$element.find(this.options.columnDataSelector).each(function (index, e) {
            var data = that.getColumnData(e);
            colData[data.index] = data;
        });

        this.columnsData = colData;

        this.addRowToggle();

        this.calculateWidth();

        console.log(this.columnsData);

        //remove the loading class
        this.$element.removeClass(this.classes.loading);

        //add the FooTable and loaded class
        this.$element.addClass(this.classes.loaded).addClass(this.classes.main);

    };

    Table.prototype.getDefaults = function () {
        return Table.DEFAULTS
    };

    Table.prototype.getOptions = function (options) {
        options = $.extend({}, this.getDefaults(), this.$element.data(), options);

        return options
    };

    Table.prototype.addRowToggle = function () {
        if (!this.options.addRowToggle) return;

        var hasToggleColumn = false;

        this.toggle = $('<td>')
            .addClass(this.classes.toggle)
            .append(this.options.toggleTemplate);

        //first remove all toggle spans
        this.$element.find('.' + this.classes.toggle).remove();

        for (var c in this.columnsData) {
            var col = this.columnsData[c];
            if (col.toggle) {
                hasToggleColumn = true;
                var selector = '> tbody > tr:not(.' + this.classes.detail + ',.' + this.classes.disabled + ') > td:nth-child(' + (parseInt(col.index, 10) + 1) + '),' +
                    '> tbody > tr:not(.' + this.classes.detail + ',.' + this.classes.disabled + ') > th:nth-child(' + (parseInt(col.index, 10) + 1) + ')';
                this.$element.find(selector).not('.' + this.classes.detailCell).prepend($(this.options.toggleHTMLElement).addClass(this.classes.toggle));
                return;
            }
        }
        //check if we have an toggle column. If not then add it to the first column just to be safe
        if (!hasToggleColumn) {
            this.$element
                .find('> tbody > tr:not(.' + this.classes.detail + ',.' + this.classes.disabled + ')')
                .not('.' + this.classes.detailCell)
                .prepend(this.toggle);
            this.$element
                .find('> thead > tr')
                .prepend($('<th>').addClass(this.classes.toggle));

            var toggleWidth = this.$element
                .find('th.' + this.classes.toggle)
                .outerWidth();

            this.$element
                .find('th.' + this.classes.toggle)
                .css('width', toggleWidth)
                .attr('data-priority', this.options.priorityMin);

            this.columnsData[this.options.priorityMin].width += toggleWidth;
        }
    };

    Table.prototype.parse = function (cell, column) {
        var parser = this.options.parsers[column.type] || this.options.parsers.alpha;
        return parser(cell);
    };

    Table.prototype.getColumnData = function (e) {
        var $th = $(e),
            hide = $th.data('hide'),
            index = $th.index();
        hide = hide || false;
        var data = {
            'index': index,
            'hide': hide,
            'type': $th.data('type') || 'alpha',
            'name': $th.data('name') || $.trim($th.text()),
            'ignore': $th.data('ignore') || false,
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

        if($.isEmptyObject($th.data())){
            $th.attr('data-priority', this.max);
        }

        data.priority = parseInt($th.data('priority'), 10);

        var priorityWidth = $th.outerWidth();
        $th.css('width', priorityWidth);

        data.width += priorityWidth;

        if (data.group !== null) {
            var $group = this.$element.find('> thead > tr.footable-group-row > th[data-group="' + data.group + '"], > thead > tr.footable-group-row > td[data-group="' + data.group + '"]').first();
            data.groupName = ft.parse($group, { 'type': 'alpha' });
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

    Table.prototype.bindToggleSelector = function () {

    };

    Table.prototype.setColumnClasses = function () {

    };

    Table.prototype.toggleDetail = function (row) {

    };

    Table.prototype.setDetailRow = function () {

    };

    Table.prototype.tableResize = function () {
        /*var maxWidth    = this.$parent.width(),
            affWidth    = 0;

        $('th', this.$element).not('[data-priority="' + this.options.priorityMin + '"]').attr('data-hide', 'true');
        $('td, th', this.$element).css('display', 'table-cell');

        for (var curPriority in this.columns){
            var curColWidth = this.columns[curPriority]["width"];
            if(affWidth + curColWidth < maxWidth && maxWidth > this.columns[this.options.priorityMin]["width"] ) {
                affWidth += curColWidth;
                this.$element.find('[data-priority="' + curPriority + '"]').removeAttr('data-hide');
            } else break;
        }*/
    };

    Table.prototype.calculateWidth = function () {
        var maxWidth    = this.$parent.width(),
            affWidth    = 0;

        $('th', this.$element).not('[data-priority="' + this.options.priorityMin + '"]').attr('data-hide', 'true').data('hide', true);
        $('td, th', this.$element).css('display', 'table-cell');

        for (var curPriority in this.columns){
            var curColWidth = this.columns[curPriority].width;
            if(affWidth + curColWidth < maxWidth && maxWidth > this.columns[this.options.priorityMin].width ) {
                affWidth += curColWidth;
                this.$element.find('[data-priority="' + curPriority + '"]').removeAttr('data-hide');
                this.$element.find('[data-priority="' + curPriority + '"]').data('hide', false);
            } else break;
        }

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

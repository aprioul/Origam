
/**
 * Apply origamSortTable
 *
 */

(function ($, w) {

    'use strict';

    // PASSWORD PUBLIC CLASS DEFINITION
    // ===============================

    var SortTable = function (element, options) {
        this.type       = null;
        this.options    = null;
        this.$element   = null;

        this.init('sortTable', element, options)
    };

    if (!$.fn.input) throw new Error('SortTable requires table.js');

    SortTable.VERSION  = '0.1.0';

    SortTable.TRANSITION_DURATION = 1000;

    SortTable.DEFAULTS = $.extend({}, $.fn.table.Constructor.DEFAULTS, {
        sorters: {
            alpha: function (a, b) {
                if (typeof(a) === 'string') { var aa =  a.toLowerCase(); }
                if (typeof(b) === 'string') { var bb = b.toLowerCase(); }
                if (aa === bb) return 0;
                if (aa < bb) return -1;
                return 1;
            },
            numeric: function (a, b) {
                var aa = parseFloat(a);
                if (isNaN(aa)) aa = 0;
                var bb = parseFloat(b);
                if (isNaN(bb)) bb = 0;
                return aa-bb;
            },
            currency: function (a, b) {
                var aa = a.replace(/[^0-9.]/g,'');
                var bb = b.replace(/[^0-9.]/g,'');
                return parseFloat(aa) - parseFloat(bb);
            },
            date: function (a, b) {
                var aa = new Date(a);
                var bb = new Date(b);

                return aa.getTime() - bb.getTime();
            }
        },
        sortTemplate: '<span class="origamicon origamicon-sort"></span>',
        classes : {
            toggle: 'origamtable-toggle',
            sortable: 'origamtable-sortable',
            sorted: 'origamtable-sorted',
            descending: 'origamicon-sort-desc',
            ascending: 'origamicon-sort-asc',
            sort: 'origamicon-sort',
            indicator: 'origamtable-sort-indicator'
        }
    });

    SortTable.prototype = $.extend({}, $.fn.table.Constructor.prototype);

    SortTable.prototype.constructor = SortTable;

    SortTable.prototype.tableEvent = function (options) {
        var that = this;

        that.$element.find('> thead > tr:last-child > th:not(.' + that.classes.toggle + '), > thead > tr:last-child > td:not(.' + that.classes.toggle + ')').each(function () {
            var $th     = $(this),
                index = $th.index(),
                column = that.columnsData[index],
                ignore = column.sortIgnore;

            if (ignore !== true && !$th.hasClass(that.classes.sortable)) {
                $th.addClass(that.classes.sortable);
                $(that.options.sortTemplate).addClass(that.classes.indicator).appendTo($th);
            }
        });

        that.$element.find('> thead > tr:last-child > th.' + that.classes.sortable + ', > thead > tr:last-child > td.' + that.classes.sortable).unbind('click.origam').bind('click.origam', function (ec) {
            ec.preventDefault();
            var $th = $(this);
            var ascending = !$th.children('.' + that.classes.indicator).hasClass(that.classes.ascending);
            that.toggleSort($th.index(), ascending);
            return false;
        });
    };

    SortTable.prototype.getDefaults = function () {
        return SortTable.DEFAULTS
    };

    SortTable.prototype.toggleSort = function (colIndex, ascending) {
        var $tbody = this.$element.find('> tbody'),
            column = this.columnsData[colIndex],
            $th = this.$element.find('> thead > tr:last-child > th:eq(' + colIndex + ')'),
            $thead = this.$element.find('> thead');

        ascending = (ascending === undefined) ? $th.children('.' + this.classes.indicator).hasClass(this.classes.ascending) : (ascending === 'toggle') ? !$th.children('.' + this.classes.indicator).hasClass(this.classes.ascending) : ascending;

        this.$element.data('sorted', column.index);

        this.$element
            .find('> thead > tr:last-child > th:not(.' + this.classes.toggle + '), > thead > tr:last-child > td:not(.' + this.classes.toggle + ')')
            .removeClass(this.classes.sorted)
            .not($th)
            .children('.' + this.classes.indicator)
            .removeClass(this.classes.descending)
            .removeClass(this.classes.ascending)
            .removeClass(this.classes.sort)
            .addClass(this.classes.sort);

        if (ascending === undefined) {
            ascending = $thchildren('.' + this.classes.indicator).hasClass(this.classes.ascending);
        }

        if (ascending) {
            $th
                .addClass(this.classes.sorted)
                .children('.' + this.classes.indicator)
                .removeClass(this.classes.sort)
                .removeClass(this.classes.descending)
                .addClass(this.classes.ascending);
        } else {
            $th
                .addClass(this.classes.sorted)
                .children('.' + this.classes.indicator)
                .removeClass(this.classes.sort)
                .removeClass(this.classes.ascending)
                .addClass(this.classes.descending);
        }

        this.doSort($tbody, $thead, column, ascending);
    };

    SortTable.prototype.doSort = function (tbody, thead, column, ascending) {
        var rows = this.rows(tbody, column),
            sorter = this.options.sorters[column.type],
            itm = rows[1].value,
            sorted = false;

        if(typeof(sorter) === 'undefined') {
            sorter = this.options.sorters.alpha;
            if (itm.match(/^[\d\.]+$/)) {
                sorter = this.options.sorters.numeric;
                sorted = true;
            }

            if (itm.match(/^[�$]/)) {
                sorter = this.options.sorters.currency;
                sorted = true;
            }

            if (!sorted) {
                var date = new Date(itm);
                if (!isNaN(date.getTime())) {
                    sorter = this.options.sorters.date;
                }
            }
        }

        rows.sort(function (a, b) {
            if (ascending) {
                return sorter(a.value, b.value);
            } else {
                return sorter(b.value, a.value);
            }
        });

        for (var j = 0; j < rows.length; j++) {
            tbody.append(rows[j].row);
            if (rows[j].detail !== null) {
                tbody.append(rows[j].detail);
            }
        }
    };

    SortTable.prototype.rows = function (tgroup, column) {
        var rows = [],
            that = this;

        tgroup.find('> tr').each(function (i) {
            var $row = $(this),
                $next = null;

            if ($row.hasClass(that.classes.detail)) return true;
            if ($row.next().hasClass(that.classes.detail)) {
                $next = $row.next().get(0);
            }
            var row = { 'row': $row, 'detail': $next };
            if (column !== undefined) {
                row.value = that.parse($(this).get(0).cells[column.index], column);
            }
            rows.push(row);
            return true;
        }).detach();
        return rows;
    };

    // PASSWORD PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('origam.sortTable');
            var options = typeof option == 'object' && option;

            if (!data) $this.data('origam.sortTable', (data = new SortTable(this, options)));
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.sortTable;

    $.fn.sortTable             = Plugin;
    $.fn.sortTable.Constructor = SortTable;


    // PASSWORD NO CONFLICT
    // ===================

    $.fn.table.noConflict = function () {
        $.fn.sortTable = old;
        return this
    }

    $(document).ready(function() {
        $('[data-table="sortTable"]').sortTable();
        $('[data-app="table"][data-sort="true"]').sortTable();
    });

})(jQuery, window);
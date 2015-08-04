
/**
 * Apply origamResponsiveTable
 *
 */

(function ($, w) {

    'use strict';

    // PASSWORD PUBLIC CLASS DEFINITION
    // ===============================

    var ResponsiveTable = function (element, options) {
        this.type       = null;
        this.options    = null;
        this.$element   = null;

        this.init('responsiveTable', element, options)
    };

    if (!$.fn.input) throw new Error('ResponsiveTable requires table.js');

    ResponsiveTable.VERSION  = '0.1.0';

    ResponsiveTable.TRANSITION_DURATION = 1000;

    ResponsiveTable.DEFAULTS = $.extend({}, $.fn.table.Constructor.DEFAULTS, {
        toggleSelector: ' > tbody > tr:not(.responsivetable-row-detail)',
        detailSeparator: '',
        toggleTemplate: '<span class="origamicon origamicon-eye"></span>',
        priorityMin: 1,
        animate: false,
        animationIn: 'bounceInRight',
        animationOut: 'bounceOutRight',
        classes: {
            toggle: 'origamtable-toggle',
            disabled: 'origamtable-disabled',
            detail: 'origamtable-row-detail',
            detailCell: 'origamtable-row-detail-cell',
            detailInner: 'origamtable-row-detail-inner',
            detailInnerRow: 'origamtable-row-detail-row',
            detailInnerGroup: 'origamtable-row-detail-group',
            detailInnerName: 'origamtable-row-detail-name',
            detailInnerValue: 'origamtable-row-detail-value',
            detailShow: 'origamtable-detail-show',
            iconShow: 'origamicon-eye',
            iconHide: 'origamicon-eye-blocked',
            active: 'origamtable-active'
        },
        createDetail: function (element, data, detailSeparator, classes) {

            var groups = { '_none': { 'name': null, 'data': [] } };
            for (var i = 0; i < data.length; i++) {
                var groupid = data[i].group;
                if (groupid !== null) {
                    if (!(groupid in groups))
                        groups[groupid] = { 'name': data[i].groupName || data[i].group, 'data': [] };

                    groups[groupid].data.push(data[i]);
                } else {
                    groups._none.data.push(data[i]);
                }
            }

            for (var group in groups) {
                if (groups[group].data.length === 0) continue;
                if (group !== '_none') element.append('<div class="' + classes.detailInnerGroup + '">' + groups[group].name + '</div>');

                for (var j = 0; j < groups[group].data.length; j++) {
                    var separator = (groups[group].data[j].name) ? detailSeparator : '';
                    element.append($('<div></div>').addClass(classes.detailInnerRow).append($('<div></div>').addClass(classes.detailInnerName)
                        .append(groups[group].data[j].name + separator)).append($('<div></div>').addClass(classes.detailInnerValue)
                        .attr('data-bind-value', groups[group].data[j].bindName).append(groups[group].data[j].display)));
                }
            }
        }
    });

    ResponsiveTable.prototype = $.extend({}, $.fn.table.Constructor.prototype);

    ResponsiveTable.prototype.constructor = ResponsiveTable;

    ResponsiveTable.prototype.tableEvent = function (options) {
        this.addRowToggle();

        this.calculateWidth();

        this.setColumn();

        $(w).on('resize', $.proxy(this.tableResize, this));
    };

    ResponsiveTable.prototype.getDefaults = function () {
        return ResponsiveTable.DEFAULTS
    };

    ResponsiveTable.prototype.addRowToggle = function () {

        this.toggle = $('<td>')
            .addClass(this.classes.toggle)
            .append(this.options.toggleTemplate);

        //first remove all toggle spans
        this.$element.find('.' + this.classes.toggle).remove();

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

        this.columnsData[1].width += toggleWidth;
    };

    ResponsiveTable.prototype.calculateWidth = function () {
        var maxWidth    = this.$parent.width(),
            affWidth    = 0,
            colSort = this.columnsData,
            sortable = [];

        $('th', this.$element).not('[data-priority="' + this.options.priorityMin + '"]').attr('data-hide', 'true');
        $('td, th', this.$element).css('display', 'table-cell');

        for (var col in colSort)
            sortable.push([col, colSort[col]])
        sortable.sort(function(a, b) {return a[1].priority - b[1].priority});

        for (var curCol in sortable){
            var colIndex = sortable[curCol][1].index;
            var curColWidth = this.columnsData[colIndex].width;
            if(affWidth + curColWidth < maxWidth && maxWidth > this.columnsData[this.options.priorityMin].width ) {
                affWidth += curColWidth;
                var curPriority = this.columnsData[colIndex].priority;
                this.$element.find('[data-priority="' + curPriority + '"]').removeAttr('data-hide');
                this.columnsData[colIndex].hide = false;
            } else {
                this.$element.addClass(this.classes.active);
                this.columnsData[colIndex].hide = true;
            }
        }
    };

    ResponsiveTable.prototype.setColumn = function () {
        var that = this;

        that.bindToggleSelector();

        for (var c in this.columnsData) {
            var col = this.columnsData[c];
            if (col.className !== null) {
                var selector = '', first = true;
                $.each(col.matches, function (m, match) { //support for colspans
                    if (!first) selector += ', ';
                    selector += '> tbody > tr:not(.' + that.classes.detail + ') > td:nth-child(' + (parseInt(match, 10) + 1) + ')';
                    first = false;
                });
                that.$element.find(selector).not('.' + that.classes.detailCell).addClass(col.className);
            }
        }

        that.$element
            .find('> tbody > tr:not(.' + that.classes.detail + ')').data('detail_created', false).end()
            .find('> thead > tr:last-child > th:not(.' + that.classes.toggle + ')')
            .each(function () {
                var index       = $(this).index() - 1,
                    data        = that.columnsData[index],
                    selector    = '',
                    first       = true;

                $.each(data.matches, function (m, match) {
                    if (!first) {
                        selector += ', ';
                    }

                    var count = match + 2;
                    selector += '> tbody > tr:not(.' + that.classes.detail + ') > td:nth-child(' + count + ')';
                    selector += ', > tfoot > tr:not(.' + that.classes.detail + ') > td:nth-child(' + count + ')';
                    selector += ', > colgroup > col:nth-child(' + count + ')';
                    first = false;
                });

                selector += ', > thead > tr[data-group-row="true"] > th[data-group="' + data.group + '"]';
                var $column = that.$element.find(selector).add(this);

                if (data.hide === false) $column.addClass('responsivetable-visible').show();
                else $column.removeClass('responsivetable-visible').hide();

                if (that.$element.find('> thead > tr.responsivetable-group-row').length === 1) {
                    var $groupcols = that.$element.find('> thead > tr:last-child > th[data-group="' + data.group + '"]:visible, > thead > tr:last-child > th[data-group="' + data.group + '"]:visible'),
                        $group = that.$element.find('> thead > tr.responsivetable-group-row > th[data-group="' + data.group + '"], > thead > tr.responsivetable-group-row > td[data-group="' + data.group + '"]'),
                        groupspan = 0;

                    $.each($groupcols, function () {
                        groupspan += parseInt($(this).attr('colspan') || 1, 10);
                    });

                    if (groupspan > 0) $group.attr('colspan', groupspan).show();
                    else $group.hide();
                }
            })
            .end()
            .find('> tbody > tr.' + that.classes.detailShow).each(function () {
                that.setOrUpdateDetailRow(this);
            });

        that.$element.find('> tbody > tr.' + that.classes.detailShow + ':visible').each(function () {
            var $next = $(this).next();
            if ($next.hasClass(that.classes.detail)) {
                $next.show();
            }
        });

        this.$element.find('> thead > tr > th.responsivetable-last-column, > tbody > tr > td.responsivetable-last-column').removeClass('responsivetable-last-column');
        this.$element.find('> thead > tr > th.responsivetable-first-column, > tbody > tr > td.responsivetable-first-column').removeClass('responsivetable-first-column');
        this.$element.find('> thead > tr, > tbody > tr')
            .find('> th.responsivetable-visible:last, > td.responsivetable-visible:last')
            .addClass('responsivetable-last-column')
            .end()
            .find('> th.responsivetable-visible:first, > td.responsivetable-visible:first')
            .addClass('responsivetable-first-column');
    };

    ResponsiveTable.prototype.setOrUpdateDetailRow = function (actualRow) {
        var $row        = $(actualRow),
            $next       = $row.next(),
            that        = this,
            $detail,
            values      = [];

        if ($row.data('detail_created') === true) return true;

        if ($row.is(':hidden')) return false;

        $row.find('> td:hidden').each(function () {
            var index = $(this).index() - 1,
                column = that.getColumnFromTdIndex(index),
                name = column.name;

            if (column.ignore === true) return true;

            if (index in column.names) name = column.names[index];

            var bindName = $(this).attr("data-bind-name");
            if (bindName != null && $(this).is(':empty')) {
                var bindValue = $('.' + that.classes.detailInnerValue + '[' + 'data-bind-value="' + bindName + '"]');
                $(this).html($(bindValue).contents().detach());
            }
            var display;
            if (column.isEditable !== false && (column.isEditable || $(this).find(":input").length > 0)) {
                if(bindName == null) {
                    bindName = "bind-" + $.now() + "-" + index;
                    $(this).attr("data-bind-name", bindName);
                }
                display = $(this).contents().detach();
            }
            if (!display) display = $(this).contents().clone(true, true);
            values.push({ 'name': name, 'value': that.parse(this, column), 'display': display, 'group': column.group, 'groupName': column.groupName, 'bindName': bindName });
            return true;
        });
        if (values.length === 0) return false;
        var colspan = $row.find('> td:visible').length;
        var exists = $next.hasClass(that.classes.detail);
        if (!exists) {
            $next = $('<tr class="' + that.classes.detail + '"><td class="' + that.classes.detailCell + '"><div class="' + that.classes.detailInner + '"></div></td></tr>');
            $row.after($next);
        }
        $next.find('> td:first').attr('colspan', colspan);
        $detail = $next.find('.' + that.classes.detailInner).empty();
        this.options.createDetail($detail, values, that.options.detailSeparator, that.classes);
        $row.data('detail_created', true);
        return !exists;

    };

    ResponsiveTable.prototype.getColumnFromTdIndex = function (index) {
        var result = null;
        for (var column in this.columnsData) {
            if ($.inArray(index, this.columnsData[column].matches) >= 0) {
                result = this.columnsData[column];
                break;
            }
        }
        return result;
    };

    ResponsiveTable.prototype.bindToggleSelector = function () {
        var that = this;

        that.$element.find(that.options.toggleSelector).unbind('toggleRow.origam.'+ that.type).bind('toggleRow.origam.'+ that.type, function (e) {
            var $row = $(this).is('tr') ? $(this) : $(this).parents('tr:first');
            that.toggleDetail($row);
        });

        that.$element.find(that.options.toggleSelector).unbind('click.origam.'+ that.type).bind('click.origam.'+ that.type, function (e) {
            if ($(e.target).parent().is('td,th,.'+ that.classes.toggle)) {
                $(e.target).hasClass(that.classes.iconShow) ? $(e.target).removeClass(that.classes.iconShow).addClass(that.classes.iconHide) : $(e.target).removeClass(that.classes.iconHide).addClass(that.classes.iconShow);
                $(this).trigger('toggleRow.origam.'+ that.type);
            }
        });
    };

    ResponsiveTable.prototype.toggleDetail = function (row) {
        var $row = (row.jquery) ? row : $(row),
            $next = $row.next();

        //check if the row is already expanded
        if ($row.hasClass(this.classes.detailShow)) {
            $row.removeClass(this.classes.detailShow);

            //only hide the next row if it's a detail row
            if ($next.hasClass(this.classes.detail))
                this.eventHide($next);

        } else {
            this.setOrUpdateDetailRow($row[0]);
            $next = $row.addClass(this.classes.detailShow)
                .next();
            this.eventShow($next);
        }
    };

    ResponsiveTable.prototype.eventShow = function ($next) {
        var that = this;

        if(that.options.animate) {
            $next.find('.' + that.classes.detailInnerRow).each( function(){
                $(this)
                    .addClass(that.options.animationIn)
                    .addClass('animated');
            });
            var animateClass = that.options.animationIn + ' animated';
        }

        $next.show();

        var onShow = function () {
            $next.find('.' + that.classes.detailInnerRow).each( function() {
                if ($(this).hasClass(animateClass))
                    $(this).removeClass(animateClass);
            });
            $next.trigger('show.origam.' + that.type);
        };

        $.support.transition && that.options.animate ?
            $next
                .one('origamTransitionEnd', onShow)
                .emulateTransitionEnd(ResponsiveTable.TRANSITION_DURATION) :
            onShow();

        return false;

    };

    ResponsiveTable.prototype.eventHide = function ($next) {

        var that = this;

        $next.trigger($.Event('close.origam.' + that.type));

        if(that.options.animate) {
            $next.find('.' + that.classes.detailInnerRow).each( function() {
                $(this).addClass(that.options.animationOut);
                $(this).addClass('animated');
            });
            var animateClass = that.options.animationOut + ' animated';
        }

        function removeElement() {
            $next.find('.' + that.classes.detailInnerRow).each( function() {
                if ($(this).hasClass(animateClass))
                    $(this).removeClass(animateClass);
            });
            $next
                .trigger('closed.origam.' + that.type)
                .hide();
        }

        $.support.transition && that.options.animate ?
            $next
                .one('origamTransitionEnd', removeElement)
                .emulateTransitionEnd(ResponsiveTable.TRANSITION_DURATION) :
            removeElement()

    };

    ResponsiveTable.prototype.tableResize = function () {
        this.calculateWidth();
        this.setColumn();
    };

    // PASSWORD PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('origam.responsiveTable');
            var options = typeof option == 'object' && option;

            if (!data) $this.data('origam.responsiveTable', (data = new ResponsiveTable(this, options)));
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.responsiveTable;

    $.fn.responsiveTable             = Plugin;
    $.fn.responsiveTable.Constructor = ResponsiveTable;


    // PASSWORD NO CONFLICT
    // ===================

    $.fn.table.noConflict = function () {
        $.fn.responsiveTable = old;
        return this
    }

    $(document).ready(function() {
        $('[data-table="responsiveTable"]').responsiveTable();
        $('[data-app="table"][data-responsive="true"]').responsiveTable();
    });

})(jQuery, window);
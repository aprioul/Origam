
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
            }
        },
        modules: 'responsive sort',
        addRowToggle: true,
        toggleSelector: ' > tbody > tr:not(.footable-row-detail)',
        columnDataSelector: '> thead > tr:last-child > th, > thead > tr:last-child > td',
        detailSeparator: '',
        toggleTemplate: '<span class="origamicon origamicon-eye"></span>',
        priorityMin: 1,
        animate: false,
        animationIn: 'bounceInRight',
        animationOut: 'bounceOutRight',
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
            iconHide: 'origamicon-eye-blocked',
            active: 'responsivetable-active'
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


        var modules    = this.options.modules.split(' ');

        for (var i = modules.length; i--;) {
            var module = modules[i];

            if (module == 'responsive') {
                var toggleSee = this.responsiveTable();
            }
            if (module == 'sort') {
                var strenght = this.sort();
            }
        }
    };

    Table.prototype.getDefaults = function () {
        return Table.DEFAULTS
    };

    Table.prototype.getOptions = function (options) {
        options = $.extend({}, this.getDefaults(), this.$element.data(), options);

        return options
    };

    Table.prototype.responsiveTable = function() {
        var that = this,
            colData = [];

        this.$element.addClass(this.classes.loading);

        this.$element.find(this.options.columnDataSelector).each(function (index, e) {
            var data = that.getColumnData(e);
            colData[data.index] = data;
        });

        this.columnsData = colData;

        this.addRowToggle();

        this.calculateWidth();

        this.setColumn();

        this.$element.removeClass(this.classes.loading);

        this.$element.addClass(this.classes.loaded).addClass(this.classes.main);

        $(w).on('resize', $.proxy(this.tableResize, this));
    };

    Table.prototype.getColumnData = function (e) {
        var $th = $(e),
            hide = $th.data('hide'),
            index = $th.index();
        hide = hide || false;
        var data = {
            'index': index + 1,
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
            this.max = this.max + 1;
            $th.attr('data-priority', this.max);
        }

        data.priority = parseInt($th.data('priority'), 10);

        var priorityWidth = $th.outerWidth();
        $th.css('width', priorityWidth);

        data.width += priorityWidth;

        if (data.group !== null) {
            var $group = this.$element.find('> thead > tr.footable-group-row > th[data-group="' + data.group + '"], > thead > tr.footable-group-row > td[data-group="' + data.group + '"]').first();
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

    Table.prototype.parse = function (cell, column) {
        var parser = this.options.parsers[column.type] || this.options.parsers.alpha;
        return parser(cell);
    };

    Table.prototype.addRowToggle = function () {
        if (!this.options.addRowToggle) return;

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

    Table.prototype.calculateWidth = function () {
        var maxWidth    = this.$parent.width(),
            affWidth    = 0;

        $('th', this.$element).not('[data-priority="' + this.options.priorityMin + '"]').attr('data-hide', 'true');
        $('td, th', this.$element).css('display', 'table-cell');

        for (var curCol in this.columnsData){
            var curColWidth = this.columnsData[curCol].width;
            if(affWidth + curColWidth < maxWidth && maxWidth > this.columnsData[this.options.priorityMin].width ) {
                affWidth += curColWidth;
                var curPriority = this.columnsData[curCol].priority;
                this.$element.find('[data-priority="' + curPriority + '"]').removeAttr('data-hide');
                this.columnsData[curCol].hide = false;
            } else {
                this.$element.addClass(this.classes.active);
                this.columnsData[curCol].hide = true;
                break;
            }
        }
    };

    Table.prototype.setColumn = function () {
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
            .find('> thead > tr:last-child > th')
            .each(function () {
                if($(this).index() !== 0 ) {
                    var data = that.columnsData[$(this).index()], selector = '', first = true;

                    $.each(data.matches, function (m, match) {
                        if (!first) {
                            selector += ', ';
                        }
                        var count = match + 1;
                        selector += '> tbody > tr:not(.' + that.classes.detail + ') > td:nth-child(' + count + ')';
                        selector += ', > tfoot > tr:not(.' + that.classes.detail + ') > td:nth-child(' + count + ')';
                        selector += ', > colgroup > col:nth-child(' + count + ')';
                        first = false;
                    });

                    selector += ', > thead > tr[data-group-row="true"] > th[data-group="' + data.group + '"]';
                    var $column = that.$element.find(selector).add(this);

                    if (data.hide === false) $column.addClass('footable-visible').show();
                    else $column.removeClass('footable-visible').hide();

                    if (that.$element.find('> thead > tr.footable-group-row').length === 1) {
                        var $groupcols = that.$element.find('> thead > tr:last-child > th[data-group="' + data.group + '"]:visible, > thead > tr:last-child > th[data-group="' + data.group + '"]:visible'),
                            $group = that.$element.find('> thead > tr.footable-group-row > th[data-group="' + data.group + '"], > thead > tr.footable-group-row > td[data-group="' + data.group + '"]'),
                            groupspan = 0;

                        $.each($groupcols, function () {
                            groupspan += parseInt($(this).attr('colspan') || 1, 10);
                        });

                        if (groupspan > 0) $group.attr('colspan', groupspan).show();
                        else $group.hide();
                    }
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

        this.$element.find('> thead > tr > th.footable-last-column, > tbody > tr > td.footable-last-column').removeClass('footable-last-column');
        this.$element.find('> thead > tr > th.footable-first-column, > tbody > tr > td.footable-first-column').removeClass('footable-first-column');
        this.$element.find('> thead > tr, > tbody > tr')
            .find('> th.footable-visible:last, > td.footable-visible:last')
            .addClass('footable-last-column')
            .end()
            .find('> th.footable-visible:first, > td.footable-visible:first')
            .addClass('footable-first-column');
    };

    Table.prototype.setOrUpdateDetailRow = function (actualRow) {
        var $row        = $(actualRow),
            $next       = $row.next(),
            that        = this,
            $detail,
            values      = [];

        if ($row.data('detail_created') === true) return true;

        if ($row.is(':hidden')) return false;

        $row.find('> td:hidden').each(function () {
            var index = $(this).index(),
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

    Table.prototype.getColumnFromTdIndex = function (index) {
        var result = null;
        for (var column in this.columnsData) {
            if ($.inArray(index, this.columnsData[column].matches) >= 0) {
                result = this.columnsData[column];
                break;
            }
        }
        return result;
    };

    Table.prototype.bindToggleSelector = function () {
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

    Table.prototype.toggleDetail = function (row) {
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

    Table.prototype.eventShow = function ($next) {
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
                .emulateTransitionEnd(Table.TRANSITION_DURATION) :
            onShow();

        return false;

    };

    Table.prototype.eventHide = function ($next) {

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
                .emulateTransitionEnd(Table.TRANSITION_DURATION) :
            removeElement()

    };

    Table.prototype.tableResize = function () {
        this.calculateWidth();
        this.setColumn();
    };

    Table.prototype.sort = function () {

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

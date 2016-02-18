
/**
 * Apply origamStickyTable
 *
 */

(function ($, w) {

    'use strict';

    // PASSWORD PUBLIC CLASS DEFINITION
    // ===============================

    var StickyTable = function (element, options) {
        this.type       = null;
        this.options    = null;
        this.$element   = null;

        this.init('stickyTable', element, options)
    };

    if (!$.fn.input) throw new Error('StickyTable requires table.js');

    StickyTable.VERSION  = '0.1.0';

    StickyTable.TRANSITION_DURATION = 1000;

    StickyTable.DEFAULTS = $.extend({}, $.fn.table.Constructor.DEFAULTS, {
        classes : {
            enable: 'origamtable-sticky-enabled',
            wrap: 'origamtable-sticky-wrap',
            cloneY: 'origamtable-sticky-thead',
            cloneX: 'origamtable-sticky-col',
            cloneIntersect: 'origamtable-sticky-intersect',
            detail: 'origamtable-row-detail'
        }
    });

    StickyTable.prototype = $.extend({}, $.fn.table.Constructor.prototype);

    StickyTable.prototype.constructor = StickyTable;

    StickyTable.prototype.tableEvent = function (options) {
        if(this.$element.find('thead').length > 0 && this.$element.find('th').length > 0) {
            var classes = this.$element.attr('class');

            this.$element
                .addClass(this.classes.enable)
                .wrap('<div></div>')
                .parent()
                .addClass(this.classes.wrap);

            if(this.$element.hasClass('overflow-y')) this.$element.removeClass('overflow-y').parent().addClass('overflow-y');

            this.$element
                .after('<table></table>')
                .next()
                .addClass(this.classes.cloneY)
                .addClass(classes);

            if(this.$element.find('tbody th:not(' + this.classes.detail + ')').length > 0) {
                this.$element
                    .after('<table></table>')
                    .next()
                    .addClass(this.classes.cloneX)
                    .addClass(classes)
                    .after('<table></table>')
                    .next()
                    .addClass(this.classes.cloneIntersect)
                    .addClass(classes);
            }

            this.$stickyHead  = this.$element.siblings('.' + this.classes.cloneY);
            this.$stickyCol   = this.$element.siblings('.' + this.classes.cloneX);
            this.$stickyInsct = this.$element.siblings('.' + this.classes.cloneIntersect);
            this.$stickyWrap  = this.$element.parent('.' + this.classes.wrap);

            this.stickyClone();

            this.setWidths();

            this.$element.parent('.' + this.classes.wrap).on('scroll', $.proxy(function() {
                this.repositionStickyHead();
                this.repositionStickyCol();
            }, this));

            $(w).on('load', $.proxy (this.setWidths, this));
            $(w).on('resize', $.proxy (function () {
                    this.stickyClone();
                    this.setWidths();
                    this.repositionStickyHead();
                    this.repositionStickyCol();
                }, this));
            $(w).on('scroll', $.proxy (function () {
                this.repositionStickyHead()
            }, this));
        }

    };

    StickyTable.prototype.getDefaults = function () {
        return StickyTable.DEFAULTS
    };

    StickyTable.prototype.stickyClone = function () {
        var $thead = this.$element.find('thead').clone(),
            $col = this.$element.find('thead, tbody').clone();

        this.$stickyHead.html($thead);

        this.$stickyCol
            .html($col)
            .find('thead th:gt(0)').remove()
            .end()
            .find('tbody td').remove();

        this.$stickyInsct.html('<thead><tr><th>' + this.$element.find('thead th:first-child').html()+'</th></tr></thead>');

    };

    StickyTable.prototype.setWidths = function () {
        var that = this;

        that.$element
            .find('thead th').each(function (i) {
                that.$stickyHead.find('th').eq(i).width($(this).width());
            })
            .end()
            .find('tr').each(function (i) {
                that.$stickyCol.find('tr').eq(i).height($(this).height());
            });

        // Set width of sticky table head
        that.$stickyHead.width(that.$element.width());

        // Set width of sticky table col
        that.$stickyCol.find('th').add(that.$stickyInsct.find('th')).width(that.$element.find('thead th').width());
    };

    StickyTable.prototype.repositionStickyHead = function () {
        // Return value of calculated allowance
        var allowance = this.calcAllowance();

        // Check if wrapper parent is overflowing along the y-axis
        if(this.$element.height() > this.$stickyWrap.height()) {
            // If it is overflowing (advanced layout)
            // Position sticky header based on wrapper scrollTop()
            if(this.$stickyWrap.scrollTop() > 0) {
                // When top of wrapping parent is out of view
                this.$stickyHead.add(this.$stickyInsct).css({
                    opacity: 1,
                    top: this.$stickyWrap.scrollTop()
                });
            } else {
                // When top of wrapping parent is in view
                this.$stickyHead.add(this.$stickyInsct).css({
                    opacity: 0,
                    top: 0
                });
            }
        } else {
            // If it is not overflowing (basic layout)
            // Position sticky header based on viewport scrollTop
            if($(w).scrollTop() > this.$element.offset().top && $(w).scrollTop() < this.$element.offset().top + this.$element.outerHeight() - allowance) {
                // When top of viewport is in the table itself
                this.$stickyHead.add(this.$stickyInsct).css({
                    opacity: 1,
                    top: $(w).scrollTop() - this.$element.offset().top
                });
            } else {
                // When top of viewport is above or below table
                this.$stickyHead.add(this.$stickyInsct).css({
                    opacity: 0,
                    top: 0
                });
            }
        }
    };

    StickyTable.prototype.repositionStickyCol = function () {
        if(this.$stickyWrap.scrollLeft() > 0) {
            // When left of wrapping parent is out of view
            this.$stickyCol.add(this.$stickyInsct).css({
                opacity: 1,
                left: this.$stickyWrap.scrollLeft()
            });
        } else {
            // When left of wrapping parent is in view
            this.$stickyCol
                .css({ opacity: 0 })
                .add(this.$stickyInsct).css({ left: 0 });
        }
    };

    StickyTable.prototype.calcAllowance = function () {
        var a = 0;
        // Calculate allowance
        this.$element.find('tbody tr:lt(3)').each(function () {
            a += $(this).height();
        });

        // Set fail safe limit (last three row might be too tall)
        // Set arbitrary limit at 0.25 of viewport height, or you can use an arbitrary pixel value
        if(a > $(w).height()*0.25) {
            a = $(w).height()*0.25;
        }

        // Add the height of sticky header
        a += this.$stickyHead.height();

        return a;
    };

    // PASSWORD PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('origam.stickyTable');
            var options = typeof option == 'object' && option;

            if (!data) $this.data('origam.stickyTable', (data = new StickyTable(this, options)));
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.stickyTable;

    $.fn.stickyTable             = Plugin;
    $.fn.stickyTable.Constructor = StickyTable;


    // PASSWORD NO CONFLICT
    // ===================

    $.fn.input.noConflict = function () {
        $.fn.stickyTable = old;
        return this
    }

    $(document).ready(function() {
        $('[data-app="stickyTable"]').stickyTable();
        $('[data-app="table"][data-sticky="true"]').stickyTable();
    });

})(jQuery, window);
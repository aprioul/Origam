
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
            enable: 'sticky-enabled',
            wrap: 'sticky-wrap',
            cloneY: 'sticky-thead',
            cloneX: 'sticky-col',
            cloneIntersect: 'sticky-intersect',
            detail: 'origamtable-row-detail'
        }
    });

    StickyTable.prototype = $.extend({}, $.fn.table.Constructor.prototype);

    StickyTable.prototype.constructor = StickyTable;

    StickyTable.prototype.tableEvent = function (options) {
        if(this.$element.find('thead').length > 0 && this.$element.find('th').length > 0) {
            var $thead  = this.$element.find('thead').clone(),
                $col    = this.$element.find('thead, tbody').clone(),
                classes = this.$element.attr('class');

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

            var $stickyHead  = this.$element.siblings('.' + this.classes.cloneY),
                $stickyCol   = this.$element.siblings('.' + this.classes.cloneX),
                $stickyInsct = this.$element.siblings('.' + this.classes.cloneIntersect),
                $stickyWrap  = this.$element.parent('.' + this.classes.wrap);

            $stickyHead.append($thead);

            $stickyCol
                .append($col)
                .find('thead th:gt(0)').remove()
                .end()
                .find('tbody td').remove();

        }
    };

    StickyTable.prototype.getDefaults = function () {
        return StickyTable.DEFAULTS
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
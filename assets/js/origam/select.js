
/**
 * Apply origamSelect
 */

(function ($, w) {

    'use strict';

    // SELECT PUBLIC CLASS DEFINITION
    // ===============================

    var Select = function (element, options) {
        this.type       = null;
        this.options    = null;
        this.$element   = null;

        this.init('select', element, options)
    };

    if (!$.fn.input) throw new Error('Select requires input.js');

    Select.VERSION  = '0.1.0';

    Select.TRANSITION_DURATION = 1000;

    Select.DEFAULTS = $.extend({}, $.fn.input.Constructor.DEFAULTS, {
        label: '-- Select --',
        templateSelect: '<div class="text-field"><label class="text-field--label"></label><div class="text-field--group"><input class="text-field--group__input" type="text"/></div></div>',
        templateDropdown: '<span class="text-field--group__dropdown origamicon origamicon-angle-down"></span>',
        templateList: '<div class="text-field--selectlist"></div>',
        templateSearch: '<div class="text-field"><div class="text-field--group"><input class="text-field--group__input" data-form="input" type="text"/></div></div>',
        templateSearchIcon: '<span class="text-field--group__search origamicon origamicon-search"></span>',
        templateOverlay: '<div class="origam-overlay" data-type="overlay" data-button="close"></div>',
        animate: true,
        animationIn: 'fadeInUp',
        animationOut: 'fadeOutDown',
        classes: {
            focus: 'text-field--focused',
            active: 'text-field--active',
            addonsLeft: 'text-field--addons left',
            addonsRight: 'text-field--addons right',
            select: 'text-field--select',
            fixed: 'text-field--fixed',
            search: 'text-field--selectlist__search',
            options: 'text-field--selectlist__options'
        }
    });

    Select.prototype = $.extend({}, $.fn.input.Constructor.prototype);

    Select.prototype.constructor = Select;

    Select.prototype.event = function (options) {
        this.id = this.getUID(8);
        this.classes = this.options.classes;
        this.inState   = { click: false};

        var that = this;

        this.$element
            .attr('data-id', this.id)
            .hide()
            .after(this.options.templateSelect);

        this.$select = this.$element.next();

        this.$select
            .attr('data-id', this.id)
            .addClass(this.classes.fixed);

        this.$label = this.$select.find('label');
        this.$label
            .text(this.options.label)
            .attr('for', this.id);

        this.$input = this.$select.find('input');
        this.$input
            .on('click', $.proxy(this.toggle, this))
            .on('change', $.proxy(this.valChange, this));

        this.overlay = $(this.options.templateOverlay).attr('data-target', '#' + this.id);

        this.addDropdown();

    };

    Select.prototype.getDefaults = function () {
        return Select.DEFAULTS
    };

    Select.prototype.addDropdown = function () {
        var $wrapper = this.addAddon(this.$input),
            dropdown = this.options.templateDropdown;

        $wrapper.append(dropdown);
        var $dropdown = $wrapper.children();

        $dropdown.on('click', $.proxy(this.toggle, this));
    };

    Select.prototype.addSearch = function () {
        var $search = $('<div/>', {
                class: this.classes.search
            });

        this.$list.append($search);

        $search.append(this.options.templateSearch);
        $search.children().addClass(this.options.fixed);

        this.$search = $search.find('input');
        this.$search
            .on('focusin', $.proxy(this.startFocus, this))
            .on('focusout', $.proxy(this.endFocus, this))
            .on('change', $.proxy(this.valChange, this));

        var $wrapper = this.addAddon(this.$search);

        this.$searchIcon = this.options.templateSearchIcon;

        $wrapper.append(this.$searchIcon);
    };

    Select.prototype.addList = function () {
        var $options = $('<div/>', {
            class: this.classes.options
        });

        this.$list.append($options);
    };

    Select.prototype.show = function (e) {
        var that = this;

        this.$list = $(this.options.templateList);
        this.$list
            .attr('id', this.id)
            .appendTo(this.$select);

        this.addSearch();
        this.addList();

        if(this.options.animate) {
            this.$list
                .attr('data-animate', 'true')
                .attr('data-animation', this.options.animationOut)
                .addClass(this.options.animationIn)
                .addClass('animated');
            var animateClass = this.options.animationIn + ' animated';
        }

        this.overlay.appendTo(document.body);

        this.overlay.on('click', function(){
            that.inState   = { click: false};
        });

        var onShow = function () {
            if (that.$list.hasClass(animateClass))
                that.$list.removeClass(animateClass);
            that.$select.addClass(that.classes.select);
            that.$list.trigger('show.origam.' + that.type);
            that.$search.focus();
        };

        $.support.transition && this.$list.hasClass(animateClass) ?
            this.$list
                .one('origamTransitionEnd', onShow)
                .emulateTransitionEnd(Select.TRANSITION_DURATION) :
            onShow();

        return false;
    };

    Select.prototype.hide = function (e) {

    };

    // SELECT PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('origam.select');
            var options = typeof option == 'object' && option;

            if (!data) $this.data('origam.select', (data = new Select(this, options)));
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.select;

    $.fn.select             = Plugin;
    $.fn.select.Constructor = Select;


    // SELECT NO CONFLICT
    // ===================

    $.fn.input.noConflict = function () {
        $.fn.select = old;
        return this
    }

    $(document).ready(function() {
        $('[data-form="select"]').select();
    });

})(jQuery, window);
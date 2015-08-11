
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
        templateSelect: '<div class="text-field"><label class="text-field--label"></label><div class="text-field--group"><div class="text-field--group__input" type="text"/></div></div>',
        templateDropdown: '<span class="text-field--group__dropdown origamicon origamicon-angle-down"></span>',
        templateSearch: '<div class="text-field"><div class="text-field--group"><input class="text-field--group__input" data-form="input" type="text"/></div></div>',
        templateSearchIcon: '<span class="text-field--group__search origamicon origamicon-search"></span>',
        classes: {
            focus: 'text-field--focused',
            active: 'text-field--active',
            addonsLeft: 'text-field--addons left',
            addonsRight: 'text-field--addons right',
            select: 'text-field--select',
            fixed: 'text-field--fixed',
            list: 'text-field--selectlist',
            search: 'text-field--selectlist__search',
            options: 'text-field--selectlist__select',
            selectList: 'selectlist-list',
            selectOption: 'selectlist-list--option',
            selectOptionGroup: 'selectlist-list--option__group'
        }
    });

    Select.prototype = $.extend({}, $.fn.input.Constructor.prototype);

    Select.prototype.constructor = Select;

    Select.prototype.event = function (options) {
        this.id                 = this.getUID(8);
        this.inState            = {click: false};
        this.mouse_on_container = false;
        this.activate           = false;
        this.multiple           = this.$element.attr('multiple') ? true : false;
        this.size               = this.$element.attr('size') || this.$element.attr('data-size') || null;

        var that = this;

        this.$element
            .attr('data-id', this.id)
            .hide()
            .after(this.options.templateSelect);

        this.$container = this.$element.next();

        this.$container
            .attr('data-id', this.id)
            .addClass(that.classes.select)
            .addClass(this.classes.fixed);

        this.$label = this.$container.find('label');
        this.$label
            .text(this.options.label)
            .attr('for', this.id);

        this.$input = this.$container.find('.text-field--group__input');

        this.addDropdown();

        this.$list = $('<div/>', {
            class: this.classes.list,
            id: this.id
        });

        this.addSearch();
        this.addList();
        this.bindSelector();
    };

    Select.prototype.getDefaults = function () {
        return Select.DEFAULTS
    };

    Select.prototype.addDropdown = function () {
        var $wrapper = this.addAddon(this.$input),
            dropdown = this.options.templateDropdown;

        $wrapper.append(dropdown);
        var $dropdown = $wrapper.children();

        $dropdown.on('click', $.proxy(this.show, this));
    };

    Select.prototype.removeDropdown = function () {
        this.removeAddon(this.$input);
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
            .on('keydown input', $.proxy(this.keydown_checker, this));

        var $wrapper = this.addAddon(this.$search);

        this.$searchIcon = this.options.templateSearchIcon;

        $wrapper.append(this.$searchIcon);
    };

    Select.prototype.keydown_checker = function (e) {
        var stroke, ref;
        stroke = (ref = e.which) != null ? _ref : e.keyCode;

        console.log(stroke);

        switch (stroke) {
            default:
                return this.resultsSearch();
        }

    };

    Select.prototype.resultsSearch = function () {

    };

    Select.prototype.resultsShow = function() {

    };

    Select.prototype.addList = function () {
        var $list = $('<div/>', {
                class: this.classes.options
            }),
            $options = $('<ul/>', {
                class: this.classes.selectList
            }),
            that = this,
            optdata = [],
            groupIndex = null;

        this.$options = this.$element.find('option');

        this.$options.each(function(index, element) {
            var $this = $(element),
                $listOption = $('<li/>', {
                    class: that.classes.selectOption
                }),
                data = that.getOptionsData(element, index);

            optdata[data.index] = data;

            $listOption
                .text($this.text());

            if(data.group !== null){
                if(data.groupIndex !== groupIndex){
                    var $groupOption = $('<li/>', {
                            class: that.classes.selectOptionGroup
                        }),
                        $group = $('<ul/>', {
                            class: that.classes.selectList
                        });

                    groupIndex = data.groupIndex;
                    $groupOption
                        .text(data.groupName)
                        .append($group)
                        .appendTo($options);
                }
                $group = $options.find('li:last-child ul');

                $listOption.appendTo($group);
            } else {
                $listOption.appendTo($options);
            }

        });

        this.optionData = optdata;

        $list
            .append($options)
            .appendTo(this.$list);
    };

    Select.prototype.getOptionsData = function (e, index) {
        var $option = $(e),
            selected = $option.attr('selected')? true : false,
            value = $option.val(),
            group = e.parentNode.nodeName.toLowerCase() === 'optgroup'? true : null;

        var data = {
            'index': index,
            'selected': selected,
            'name': $option.data('name') || $.trim($option.text()),
            'className': $option.data('class') || null,
            'value': value,
            'optIndex': $option.index(),
            'group': group,
            'groupName': null,
            'groupIndex': null
        };

        if(group) {
            var $optgroup = $(e.parentNode);
            data.groupIndex = $optgroup.index();
            data.groupName = $optgroup.attr('label');
        }

        this.data =  { 'option': { 'data': data, 'html': e } };
        return this.data.option.data;
    };

    Select.prototype.setValue = function (element, group) {
        var that = this,
            dataIndex = null,
            thisData = null;

        if(group){
            var optIndex = $(element).index(),
                optGroupIndex = $(element).parents('.' + that.classes.selectOptionGroup).index();

            this.$list.find('.' + this.classes.selectOption).each(function(index, e) {
                if($(e).index() === optIndex && $(e).parents('.' + that.classes.selectOptionGroup).index() === optGroupIndex)
                    dataIndex = index;
            });

        } else {
            dataIndex = $(element).index();
        }

        thisData = this.optionData[dataIndex];
        this.$element.val(thisData.value);
        this.$input.text(thisData.value);

        this.inState.click = !this.inState.click;

        this.$container.addClass(this.classes.active);

        this.hide();
    };

    Select.prototype.bindSelector = function () {
        var that = this;

        this.$container.bind('mouseenter.origam.'+ this.type, function(e) {
            that.mouse_enter();
        });
        this.$container.bind('mouseleave.origam.'+ this.type, function(e) {
            that.mouse_leave();
        });
        $(this.$container[0].ownerDocument).bind('click.origam.'+ this.type, function (e) {
            if(!that.mouse_on_container && that.activate){
                that.hide(e);
            } else if( that.mouse_on_container && !that.activate) {
                that.show(e);
            } else if( that.mouse_on_container && that.activate){
                var element = e.target;
                var group = $(element).parents('.' + that.classes.selectOptionGroup).length !== 0 ? true : false;
                that.setValue(element, group);
            }
        });
    };

    Select.prototype.mouse_enter = function() {
        return this.mouse_on_container = true;
    };

    Select.prototype.mouse_leave = function() {
        return this.mouse_on_container = false;
    };

    Select.prototype.show = function (e) {
        this.activate = true;

        var that = this;

        this.$list.appendTo(this.$container);

        if(this.size !== null){
            console.log(this.size);
        }

        if(this.options.animate) {
            this.$list
                .attr('data-animate', 'true')
                .attr('data-animation', this.options.animationOut)
                .addClass(this.options.animationIn)
                .addClass('animated');
            var animateClass = this.options.animationIn + ' animated';
        }

        var onShow = function () {
            if (that.$list.hasClass(animateClass))
                that.$list.removeClass(animateClass);
            that.$list.trigger('show.origam.' + that.type);
            that.$search.focus();
            that.removeDropdown();
        };

        $.support.transition && this.$list.hasClass(animateClass) ?
            this.$list
                .one('origamTransitionEnd', onShow)
                .emulateTransitionEnd(Select.TRANSITION_DURATION) :
            onShow();

        return false;
    };

    Select.prototype.hide = function (e) {
        var that = this,
            selector = '#' + this.id,
            $select = $(selector);

        this.activate = false;

        if (e) e.preventDefault();

        $select.trigger(e = $.Event('close.origam.' + this.type));

        var animate = $select.attr('data-animate');
        var animation = $select.attr('data-animation');

        if (animate) {
            if(animation){$select.addClass(animation);}
            else{$select.addClass('fadeOut');}
            $select.addClass('animated');
            var animateClass = animation + ' animated';
        }

        if (e.isDefaultPrevented()) return;

        function removeElement() {
            if ($select.hasClass(animateClass))
                $select.removeClass(animateClass);
            $select
                .detach()
                .trigger('closed.origam.' + that.type)
                .remove();
            that.addDropdown();
        }

        $.support.transition && $select.hasClass(animateClass)?
            $select
                .one('origamTransitionEnd', removeElement)
                .emulateTransitionEnd(Select.TRANSITION_DURATION) :
            removeElement()

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
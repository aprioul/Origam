
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

    Select.TRANSITION_DURATION = 450;

    Select.DEFAULTS = $.extend({}, $.fn.input.Constructor.DEFAULTS, {
        label: '-- Select --',
        templateSelect: '<div class="text-field"><label class="text-field--label"></label><div class="text-field--group"><div class="text-field--group__input" type="text"/></div></div>',
        templateDropdown: '<span class="text-field--group__dropdown origamicon origamicon-angle-down"></span>',
        templateSearch: '<div class="text-field"><div class="text-field--group"></div></div>',
        templateSearchInput: '<input class="text-field--group__input" data-form="input" type="text"/>',
        templateSearchIcon: '<span class="text-field--group__search origamicon origamicon-search"></span>',
        selectorToggle: 'text-field--group__input',
        selectorSearch: '.text-field > .text-field--group',
        animate: true,
        maxSelected: '',
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
            selectOptionGroup: 'selectlist-list--option__group',
            selected: 'selectlist-list--option__active'
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
        this.size               = parseInt(this.$element.attr('size')) || parseInt(this.$element.attr('data-size')) || 10;
        this.maxSelected        = this.options.maxSelected || Infinity;
        this.keys               = {
            BACKSPACE: 8,
            TAB: 9,
            ENTER: 13,
            SHIFT: 16,
            CTRL: 17,
            ALT: 18,
            ESC: 27,
            SPACE: 32,
            PAGE_UP: 33,
            PAGE_DOWN: 34,
            END: 35,
            HOME: 36,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40,
            DELETE: 46
        };
        this.field              = new Array();
        this.height             = 0;
        
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
        var $searchWrapper = $('<div/>', {
                class: this.classes.search
            });

        this.$list.append($searchWrapper);

        this.$search = $(this.options.templateSearchInput);
        this.$search
            .text('')
            .on('focusin', $.proxy(this.startFocus, this))
            .on('focusout', $.proxy(this.endFocus, this))
            .on('keydown', $.proxy(this.keydownChecker, this))
            .on('keyup', $.proxy(this.handleSearch, this));

        $searchWrapper.append(this.options.templateSearch);
        $searchWrapper.find(this.options.selectorSearch).append(this.$search);
        $searchWrapper.children().addClass(this.options.fixed);

        var $wrapper = this.addAddon(this.$search);

        this.$searchIcon = this.options.templateSearchIcon;

        $wrapper.append(this.$searchIcon);

        this.$searchContainer = $searchWrapper;

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
                data = that.getOptionsData(element, index);

            that.field[index] = $('<li/>', {
                class: that.classes.selectOption
            });

            optdata[data.index] = data;

            that.field[index]
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

                that.field[index].appendTo($group);
            } else {
                that.field[index].appendTo($options);
            }

            if(optdata[data.index].active)
                that.field[index].addClass(that.classes.selected);

        });

        this.optionData = optdata;

        this.$listOptions = $list;

        this.$listOptions
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
            'groupIndex': null,
            'active' : false
        };

        if(group) {
            var $optgroup = $(e.parentNode);
            data.groupIndex = $optgroup.index();
            data.groupName = $optgroup.attr('label');
        }

        if(this.$input.text() ===  data.name){
            data.active = true;
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

        this.field[dataIndex].addClass(this.classes.selected);

        thisData = this.optionData[dataIndex];
        this.$element.val(thisData.value);
        this.$input.text(thisData.name);

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
            that.action(e);
        });
    };

    Select.prototype.keydownChecker = function (e) {
        e.stopPropagation();

        var key = e.which;

        if (key === this.keys.ESC || key === this.keys.TAB ||
            (key === this.keys.UP && e.altKey)) {
            this.toggle(e);

            e.preventDefault();
        } else if (key === this.keys.ENTER) {
            this.$container.trigger('results:select');

            e.preventDefault();
        } else if ((key === this.keys.SPACE && e.ctrlKey)) {
            this.$container.trigger('results:toggle');

            e.preventDefault();
        } else if (key === this.keys.UP) {
            this.$container.trigger('results:previous');

            e.preventDefault();
        } else if (key === this.keys.DOWN) {
            this.$container.trigger('results:next');

            e.preventDefault();
        }
    };

    Select.prototype.handleSearch = function (e) {
        var input = this.$search.val();
        this.query(input);
    };

    Select.prototype.query = function (params) {
        var that = this;

        $.each( this.optionData, function(index) {
            if (this.name.toLowerCase().indexOf(params) >= 0){
                that.field[index].show();
            } else {
                that.field[index].hide();
            }
        });

        if(that.options.animate) {
            that.height = 0;
            that.calculHeight();
            that.$list.height(that.height);
        }
    };

    Select.prototype.calculHeight = function() {
        var that = this;

        this.$list.children().each(function (index) {
            var thisHeight = $(this).outerHeight();
            that.height = that.height + thisHeight;
        });

        var maxHeight = this.maxSize();

        if(that.height > maxHeight)
            that.height = maxHeight;
    };

    Select.prototype.maxSize = function () {
        var fieldHeight = this.field[0].outerHeight(),
            fieldsHeight = fieldHeight * this.size,
            seatchHeight = this.$searchContainer.outerHeight(),
            maxHeight = fieldsHeight + seatchHeight;

        this.$listOptions.height(fieldsHeight);
        return maxHeight;
    };

    Select.prototype.mouse_enter = function() {
        return this.mouse_on_container = true;
    };

    Select.prototype.mouse_leave = function() {
        return this.mouse_on_container = false;
    };

    Select.prototype.action = function(e){
        if (!this.mouse_on_container && this.activate){
            this.toggle(e);
        } else if( this.mouse_on_container && !this.activate) {
            this.toggle(e);
        } else if( this.mouse_on_container && this.activate){
            var element = e.target;
            var group = $(element).parents('.' + this.classes.selectOptionGroup).length !== 0 ? true : false;
            if($(element).hasClass(this.classes.selectOption))
                this.setValue(element, group);
            if($(element).hasClass(this.options.selectorToggle) && $(element).is('div'))
                this.toggle(e);
        }
    };

    Select.prototype.show = function (e) {
        this.activate = true;
        this.height = 0;

        var that = this;

        this.$list = $('<div/>', {
            class: this.classes.list,
            id: this.id
        });

        this.addSearch();
        this.addList();

        this.$list.appendTo(this.$container);
        this.$container.addClass('open');

        this.calculHeight();
        this.maxSize();

        if(!this.options.animate) {
            this.height = 'auto';
        }

        this.removeDropdown();

        var onShow = function () {
            that.$list.trigger('show.origam.' + that.type);
            that.$list.height(that.height);
        };

        $.support.transition && this.options.animate?
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

        if(this.options.animate) {
            $select.removeAttr( "style" );
        }

        if (e.isDefaultPrevented()) return;

        function removeElement() {
            that.$container.removeClass('open');
            $select
                .detach()
                .trigger('closed.origam.' + that.type)
                .remove();
            that.addDropdown();
        }

        $.support.transition && this.options.animate ?
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
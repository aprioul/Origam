
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
        label: 'Select',
        templateSelect: '<div class="text-field"><label class="text-field--label"></label><div class="text-field--group"><div class="text-field--group__input" type="text"/></div></div>',
        templateDropdown: '<span class="text-field--group__dropdown origamicon origamicon-angle-down"></span>',
        templateSearch: '<div class="text-field"><div class="text-field--group"></div></div>',
        templateSearchInput: '<input class="text-field--group__input" data-form="input" type="text"/>',
        templateSearchIcon: '<span class="text-field--group__search origamicon origamicon-search"></span>',
        templateClose: '<div class="select-close"><i class="origamicon origamicon-close"></i></div>',
        selectorToggle: 'text-field--group__input',
        selectorSearch: '.text-field > .text-field--group',
        arrow: true,
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
            selected: 'selectlist-list--option__active',
            hightLightContent: 'selectlist-list--option__content',
            multiple : 'text-field--select__multiple',
            resultContainer: 'select-result',
            resultContent: 'select-result--content'
        }
    });

    Select.prototype = $.extend({}, $.fn.input.Constructor.prototype);

    Select.prototype.constructor = Select;

    Select.prototype.event = function (options) {
        this.multiple           = this.$element.attr('multiple') ? true : false;
        this.size               = parseInt(this.$element.attr('size')) || parseInt(this.$element.attr('data-size')) || 10;
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
        this.group              = new Array();
        this.groupField         = new Array();
        this.groupHidden        = new Array();
        this.height             = 0;
        this.selectedValue      = this.$element.map(function(){ return this.value }).get();
        
        var that = this,
            $options = this.$element.find('option'),
            optData = [];

        this.$container = $(this.options.templateSelect)
            .attr('data-id', this.id)
            .addClass(that.classes.select)
            .addClass(this.classes.fixed);

        if(this.$element.next().hasClass(that.classes.select)){
            this.$element.next().remove();
        }

        this.$element
            .attr('data-id', this.id)
            .hide()
            .after(this.$container);

        this.$label = this.$container.find('label');
        this.$label
            .text(this.options.label)
            .attr('for', this.id);

        this.$input = this.$container.find('.text-field--group__input');

        $options.each(function(index, element) {
            var data = that.getOptionsData(element, index);
            optData[index] = data;
        });

        this.optionData = optData;

        if(this.options.arrow) {
            this.addDropdown();
        }
        this.bindSelector(this.$container);
    };

    Select.prototype.getDefaults = function () {
        return Select.DEFAULTS
    };

    Select.prototype.getOptionsData = function (e, index) {
        var $option = $(e),
            selected = $option.attr('selected')? true : false,
            value = $option.val(),
            group = e.parentNode.nodeName.toLowerCase() === 'optgroup'? true : null;

        var data = {
            'index': index,
            'selected': selected,
            'name': $option.text(),
            'value': value,
            'optIndex': $option.index(),
            'group': group,
            'groupName': null,
            'groupIndex': null,
            'active' : false,
            'hide' : false
        };

        if(group) {
            var $optgroup = $(e.parentNode);
            data.groupIndex = $optgroup.index();
            data.groupName = $optgroup.attr('label');
        }

        if(data.selected){
            data.active = true;
            this.addValue(data, index);
        }

        this.data =  { 'option': { 'data': data, 'html': e } };
        return this.data.option.data;
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
        var $searchWrapper = $('<div/>').addClass(this.classes.search);

        this.$list.append($searchWrapper);

        this.$search = $(this.options.templateSearchInput);
        this.$search
            .text('')
            .on('focusin', $.proxy(this.startFocus, this))
            .on('focusout', $.proxy(this.endFocus, this))
            .on('keydown', $.proxy(this.keydownChecker, this))
            .on('keyup', $.proxy(this.keyupChecker, this));

        $searchWrapper.append(this.options.templateSearch);
        $searchWrapper.find(this.options.selectorSearch).append(this.$search);
        $searchWrapper.children().addClass(this.options.fixed);

        var $wrapper = this.addAddon(this.$search);

        this.$searchIcon = this.options.templateSearchIcon;

        $wrapper.append(this.$searchIcon);

        this.$searchContainer = $searchWrapper;

    };

    Select.prototype.addList = function () {
        this.$listContainer = $('<div/>')
            .addClass(this.classes.options)
            .appendTo(this.$list);

        this.$fields = $('<ul/>').addClass(this.classes.selectList);

        var $options = this.$element.find('option'),
            that = this;

        this.groupIndex = null;

        $options.each(function(index, element) {
            that.addGroups(index);
            that.addFields(index);
        });

        this.$fields.appendTo(this.$listContainer);
    };

    Select.prototype.addGroups = function (index) {
        if (this.optionData[index].group !== null) {
            if (this.optionData[index].groupIndex !== this.groupIndex) {
                this.groupField[this.optionData[index].groupIndex] = $('<li/>').addClass(this.classes.selectOptionGroup);
                this.group[this.optionData[index].groupIndex] = $('<ul/>').addClass(this.classes.selectList);

                this.groupIndex = this.optionData[index].groupIndex;

                this.groupField[this.optionData[index].groupIndex]
                    .text(this.optionData[index].groupName)
                    .append(this.group[this.optionData[index].groupIndex]);

                this.addGroup(this.optionData[index].groupIndex);
            }
        }
    };

    Select.prototype.addGroup = function (index) {
        if(typeof this.$fields.get(0).children[index] === 'undefined') {
            this.$fields.append(this.groupField[index]);
        } else {
            $(this.$fields.get(0).children[index]).before(this.groupField[index]);
        }
        this.groupHidden[index] = false;
    };

    Select.prototype.addFields = function (index) {
        if(this.optionData[index].group !== null){
            this.addField(this.optionData[index].optIndex, index, this.group[this.optionData[index].groupIndex]);
        } else {
            this.addField(index, index, this.$fields);
        }
    };

    Select.prototype.addField = function (gptindex, index, $parent) {
        this.field[index] = $('<li/>')
            .addClass(this.classes.selectOption)
            .text(this.optionData[index].name);

        if(this.optionData[index].active) {
            this.field[index].addClass(this.classes.selected);
        }

        if(typeof $parent.get(0).children[gptindex] === 'undefined') {
            $parent.append(this.field[index]);
        } else {
            $($parent.get(0).children[gptindex]).before(this.field[index]);
        }
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
        thisData.active = true;

        this.addValue(thisData, dataIndex);

        this.inState.click = !this.inState.click;

        this.hide();
    };

    Select.prototype.addValue = function(data, index) {
        var $resultContainer = $('<div/>').addClass(this.classes.resultContainer),
            $resultContent = $('<span/>').addClass(this.classes.resultContent),
            $close = $(this.options.templateClose);

        $resultContent.text(data.name);
        $resultContainer
            .attr('data-index', index)
            .append($resultContent);

        if(!this.multiple) {
            if(this.$input.html().length !== 0) {
                var oldValue = this.$input
                    .find('.' + this.classes.resultContainer)
                    .attr('data-index');
                this.field[oldValue].removeClass(this.classes.selected);
                this.optionData[oldValue].active = false;
            }
            this.$element.val(data.value);
            this.$input.html($resultContainer);
        } else {
            this.selectedValue.push(data.value);
            this.$element.val(this.selectedValue);

            this.$container.addClass(this.classes.multiple);
            $resultContainer.append($close);
            this.$input.append($resultContainer);
            $close.on('click', $.proxy(this.closeResult, this));
        }

        this.$container.addClass(this.classes.active);

    };

    Select.prototype.closeResult = function(e) {
        var $this    = $(e.target),
            selector = '.' + this.classes.resultContainer;

        if (e) e.preventDefault();

        var $parent = $this.closest(selector);

        $parent.trigger(e = $.Event('close.origam.' + this.type));

        var dataIndex = $parent.attr('data-index');
        var index = $parent.index() + 1;

        this.selectedValue.splice(index, 1);
        this.$element.val(this.selectedValue);

        this.optionData[dataIndex].active = false;
        this.field[dataIndex].removeClass(this.classes.selected);

        if (e.isDefaultPrevented()) return;

        $parent
            .detach()
            .trigger('closed.origam.' + this.type)
            .remove();

        if($(this.$input.get(0).childNodes).length === 0)
            this.$container.removeClass(this.classes.active);
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

    Select.prototype.keyupChecker = function (e) {
        var input = this.$search.val();
        this.query(input);
    };

    Select.prototype.query = function (params) {
        var that = this;

        $.each( this.optionData, function(index) {
            if(that.groupHidden[this.groupIndex]){
                that.groupIndex = null;
                that.addGroups(index);
            }
            if (this.name.toLowerCase().indexOf(params) >= 0){
                if(this.hide) {
                    that.addFields(index);
                    this.hide = false;
                }
                that.hightLight(index, params);
            } else {
                that.field[index]
                    .detach()
                    .trigger('removeField.origam.' + that.type)
                    .remove();
                this.hide = true;
            }

            if (this.group !== null) {
                if ($(that.group[this.groupIndex].get(0).childNodes).length === 0) {
                    that.groupField[this.groupIndex]
                        .detach()
                        .trigger('removeGroup.origam.' + that.type)
                        .remove();
                    that.groupHidden[this.groupIndex] = true;
                }
            }
        });

        this.calculHeight();

        if(this.options.animate) {
            this.$list.height(this.height);
        }
    };

    Select.prototype.hightLight = function (index, params){
        var that = this,
            str = this.optionData[index].name,
            start = str.toLowerCase().indexOf(params),
            end = start + params.length,
            hightLightText = str.slice(start, end);

        this.hightLightContent = $('<span/>')
            .addClass(that.classes.hightLightContent)
            .text(hightLightText);

        this.field[index].html(str.replace(hightLightText, this.hightLightContent.get(0).outerHTML));
    };

    Select.prototype.calculHeight = function() {
        var that = this;

        this.$listContainer.height('auto');
        this.height = 0;

        this.$list.children().each(function (index) {
            var thisHeight = $(this).outerHeight();
            that.height = that.height + thisHeight;
        });

        if (this.height > this.maxHeight) {
            this.$listContainer.height(this.fieldsHeight);
        }

        if(this.options.animate) {
            if (this.height > this.maxHeight) {
                this.height = this.maxHeight;
            }
        }
    };

    Select.prototype.initHeight = function() {
        this.fieldHeight        = this.field[0].outerHeight();
        this.fieldsHeight       = this.fieldHeight * this.size;
        this.searchHeight       = this.$searchContainer.outerHeight();
        this.maxHeight          = this.fieldsHeight + this.searchHeight;
    };

    Select.prototype.action = function(e){
        var element = e.target,
            group = $(element).parents('.' + this.classes.selectOptionGroup).length !== 0 ? true : false,
            selector = '.' + this.classes.resultContainer,
            $parent = $(element).closest(selector);

        if (!this.mouseOnContainer && this.activate){
            this.toggle(e);
        } else if( this.mouseOnContainer && !this.activate) {
            if(this.multiple) {
                if ($(element).hasClass(this.options.selectorToggle) && $(element).is('div')) {
                    this.toggle(e);
                }
            } else {
                this.toggle(e);
            }
        } else if( this.mouseOnContainer && this.activate){
            if($(element).not('.' + this.classes.selected).hasClass(this.classes.selectOption)) {
                this.setValue(element, group);
                this.mouseLeave();
            }
            if(($(element).hasClass(this.options.selectorToggle) && $(element).is('div')) || ($(element).closest('.' + this.options.selectorToggle).is('div'))) {
                this.toggle(e);
            }
        }
    };

    Select.prototype.show = function (e) {
        this.activate = true;
        this.height = 0;

        var that = this;

        if(this.options.animate)
            this.$container.addClass('animate');

        this.$list = $('<div/>')
            .addClass(this.classes.list)
            .attr('id', this.id);

        this.addSearch();
        this.addList();

        this.$list.appendTo(this.$container);
        this.$container
            .addClass('open');

        if(that.options.arrow) {
            this.removeDropdown();
        }
        this.initHeight();
        this.calculHeight();

        if(!this.options.animate)
            this.height = 'auto';

        var onShow = function () {
            that.$list.trigger('show.origam.' + that.type);
            that.$list.height(that.height);
            that.$search.focus();
        };

        $.support.transition && this.options.animate?
            this.$list
                .one('origamTransitionEnd', onShow)
                .emulateTransitionEnd(Select.TRANSITION_DURATION) :
            onShow();

        return false;
    };

    Select.prototype.hide = function (e) {
        var that = this;

        this.activate = false;

        if (e) e.preventDefault();

        this.$list.trigger(e = $.Event('close.origam.' + this.type));

        if(this.options.animate)
            this.$list.removeAttr( "style" );

        if (e.isDefaultPrevented()) return;

        function removeElement() {
            that.$container.removeClass('open');
            that.$list
                .detach()
                .trigger('closed.origam.' + that.type)
                .remove();
            if(that.options.arrow) {
                that.addDropdown();
            }
            setTimeout(function(){
                if(that.options.animate)
                    that.$container.removeClass('animate');
            }, Select.TRANSITION_DURATION);
        }

        $.support.transition && this.options.animate ?
            this.$list
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
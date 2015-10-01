
/**
 * Apply origamInput
 *
*/

(function ($, w) {

    'use strict';

    // INPUT PUBLIC CLASS DEFINITION
    // ===============================

    var Input = function (element, options) {
        this.type       = null;
        this.options    = null;
        this.focus    = null;
        this.blur    = null;
        this.$element   = null;

        this.init('input', element, options)
    };

    Input.VERSION  = '0.1.0';

    Input.TRANSITION_DURATION = 1000;

    Input.DEFAULTS = {
        placeholder: '',
        classes: {
            focus: 'text-field--focused',
            active: 'text-field--active',
            addonsLeft: 'text-field--addons left',
            addonsRight: 'text-field--addons right'
        },
        parentNode: 'text-field',
        placement: 'after',
        parentClass : '',
        addon: '<div class="text-field--group__addons"></div>',
        animate: false,
        animationIn: 'fadeInUp',
        animationOut: 'fadeOutDown',
        definitions: {
            "9": "[0-9]",
            a: "[A-Za-z]",
            "*": "[A-Za-z0-9]",
            "~": "[+-]"
        },
        mask: "9999 9999 9999 9999",
        onShow: function () {},
        onBeforeShow: function(){},
        onHide: function () {},
        onChange: function () {},
        onSubmit: function () {}
    };

    /**
     * @Implement init
     *
     * @definition Init input events
     *
     * @param type
     * @param element
     * @param options
     */
    Input.prototype.init = function (type, element, options) {
        this.type               = type;
        this.element            = element;
        this.$element           = $(element);
        this.options            = this.getOptions(options);
        this.$parent            = '.' + this.options.parentNode;
        this.inState            = { click: false, hover: false, focus: false };
        this.classes            = this.options.classes;
        this.mouseOnContainer   = false;
        this.activate           = false;
        this.id                 = this.getUID(8);

        var userAgent = navigator.userAgent.toLowerCase();

        this.$element
            .parents(this.$parent)
            .addClass(this.options.parentClass);

        this.event(this.options);

        this.$element
            .on('focusin', $.proxy(this.startFocus, this))
            .on('focusout', $.proxy(this.endFocus, this))
            .on('change', $.proxy(this.valChange, this));
    };

    Input.prototype.getDefaults = function () {
        return Input.DEFAULTS
    };

    Input.prototype.getOptions = function (options) {
        options = $.extend({}, this.getDefaults(), this.$element.data(), options);

        return options
    };

    /**
     * @Implement getUID
     *
     * @definition Generate random uid
     *
     * @param length
     *
     * @returns {string}
     */
    Input.prototype.getUID = function (length){
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
        if (!length) {
            length = Math.floor(Math.random() * chars.length);
        }
        var str = '';
        for (var i = 0; i < length; i++) {
            str += chars[Math.floor(Math.random() * chars.length)];
        }
        return str;
    };

    /**
     * @Implement isInStateTrue
     *
     * @definition check statement
     *
     * @returns {boolean}
     */
    Input.prototype.isInStateTrue = function () {
        for (var key in this.inState) {
            if (this.inState[key]) return true
        }

        return false
    };

    /**
     * @Implement toggle
     *
     * @definition Toggle click
     *
     * @param e
     */
    Input.prototype.toggle = function(e){
        var that = this;

        if(e){
            that.inState.click = !that.inState.click;
            if (that.isInStateTrue()) that.show(e);
            else that.hide(e);
        }
    };

    /**
     * @Implement mouseEnter
     *
     * @definition set variables mouseOnContainer to know if click is
     * inside element
     *
     * @returns {boolean}
     */
    Input.prototype.mouseEnter = function() {
        return this.mouseOnContainer = true;
    };

    /**
     * @Implement mouseLeave
     *
     * @definition set variables mouseOnContainer to know if click is
     * outside element
     *
     * @returns {boolean}
     */
    Input.prototype.mouseLeave = function() {
        return this.mouseOnContainer = false;
    };

    /**
     * @Implement bindSelector
     *
     * @definition bind events
     *
     * @params element
     */
    Input.prototype.bindSelector = function (element) {
        var that = this;

        element.bind('mouseenter.origam.'+ this.type, function(e) {
            that.mouseEnter();
        });

        element.bind('mouseleave.origam.'+ this.type, function(e) {
            that.mouseLeave();
        });

        $(element[0].ownerDocument).bind('click.origam.'+ this.type, function (e) {
            that.action(e);
        });
    };

    /**
     * @Implement moveModal
     *
     * @definition Move modal so that it's always centered
     *
     * @param element
     */
    Input.prototype.moveModal = function (element) {
        var viewportHeight  = $(window).height(),
            viewportWidtht  = $(window).width();

        element
            .css({
                'top':  (viewportHeight/2) - (element.outerHeight()/2),
                'left': (viewportWidtht/2) - (element.outerWidth()/2)
            });
    };

    /**
     * @Implement event
     *
     * @define Add event to input. (use on other type)
     *
     * @param options
     *
     * @returns {null}
     */
    Input.prototype.event = function (options) {
        return null;
    };

    /**
     * @Implement addAddon
     *
     * @define Add addon before or after input
     * (this can to be icon, help text or button)
     *
     * @param element
     *
     * @returns {*}
     */
    Input.prototype.addAddon = function(element) {
        if(typeof element === 'undefined'){
            element = this.$element;
        }

        this.classPosition = (this.options.placement === 'after') ? this.options.classes.addonsRight : this.options.classes.addonsLeft;

        element.parents(this.$parent).addClass(this.classPosition);

        var wrapper = this.options.addon;

        if(this.options.placement === 'after') {
            element.after(wrapper);
            return (element.next());
        }
        else{
            element.before(wrapper);
            return (element.prev());
        }
    };

    /**
     * @Implement removeAddon
     *
     * @define Remove addon
     *
     * @param element
     */
    Input.prototype.removeAddon = function(element) {
        if(typeof element === 'undefined'){
            element = this.$element;
        }

        element.parents(this.$parent).removeClass(this.classPosition);

        if(this.options.placement === 'after') {
            element.next().detach().remove();
        } else {
            element.prev().detach().remove();
        }


    };

    /**
     * @Implement ValChange
     *
     * @definition Add or remove active class depend value of input
     *
     * @param e
     */
    Input.prototype.valChange = function (e) {
        if($(e.currentTarget).val() !== ''){
            $(e.currentTarget)
                .closest(this.$parent)
                .addClass(this.classes.active);
        }else {
            $(e.currentTarget).removeClass(this.options.classes.active);
        }
    };

    /**
     * @Implement startFocus
     *
     * @definition Add focus class if input is focused
     *
     * @param e
     */
    Input.prototype.startFocus = function (e) {
        $(e.currentTarget)
            .closest(this.$parent)
            .addClass(this.options.classes.focus);
        this.valChange(e);
    };

    /**
     * @Implement endFocus
     *
     * @definition remove focus class if input is focused
     *
     * @param e
     */
    Input.prototype.endFocus = function (e) {
        $(e.currentTarget)
            .change()
            .closest(this.$parent)
            .removeClass(this.options.classes.focus);
        this.valChange(e);
    };

    // INPUT PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('origam.input');
            var options = typeof option == 'object' && option;

            if (!data && /destroy|hide/.test(option)) return;
            if (!data) $this.data('origam.input', (data = new Input(this, options)));
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.input;

    $.fn.input             = Plugin;
    $.fn.input.Constructor = Input;


    // INPUT NO CONFLICT
    // ===================

    $.fn.input.noConflict = function () {
        $.fn.input = old;
        return this
    };

    $(document).ready(function() {
        $('[data-form="input"]').input();
    });

})(jQuery, window);

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
/**
 * Apply origamClose
 */

(function ($, w) {
    'use strict';

    // CLOSE CLASS DEFINITION
    // ======================

    var app = '[data-button="close"]';
    var Close   = function (el) {
        $(el).on('click', app, this.close)
    };

    Close.VERSION = '0.1.0';

    Close.TRANSITION_DURATION = 1000;

    /**
     * @Implement close
     *
     * @definition Init close function, when click on button close,
     * search parent target (default : ".alert") and close them.
     *
     * @param e
     */
    Close.prototype.close = function (e) {

        // Init variables
        var $this    = $(this),
            selector = $this.attr('data-target');

        // Define Parent selector
        // Default parent is .alert (notification)
        if (!selector) {
            selector = $this.attr('href');
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '');// strip for ie7
        }

        var $parent = $(selector);

        if (e) e.preventDefault();

        if (!$parent.length) {
            $parent = $this.closest('.alert');
        }

        $parent.trigger(e = $.Event('close.origam.close'));

        // Init animation variables
        var animate = $parent.attr('data-animate');
        var animation = $parent.attr('data-animation');

        // Make closed animation
        if (animate) {
            if(animation){$parent.addClass(animation);}
            else{$parent.addClass('fadeOut');}
            $parent.addClass('animated');
            var animateClass = animation + ' animated';
        }

        if (e.isDefaultPrevented()) return;

        // Remove function
        function removeElement() {
            if ($parent.hasClass(animateClass))
                $parent.removeClass(animateClass);
            $parent
                .detach()
                .trigger('closed.origam.close')
                .remove();
        }

        // Execute function after animation
        $.support.transition && $parent.hasClass(animateClass)?
            $parent
                .one('origamTransitionEnd', removeElement)
                .emulateTransitionEnd(Close.TRANSITION_DURATION) :
            removeElement()
    };


    // CLOSE PLUGIN DEFINITION
    // =======================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data  = $this.data('origam.close');

            if (!data) $this.data('origam.close', (data = new Close(this)));
            if (typeof option == 'string') data[option].call($this)
        })
    }

    var old = $.fn.close;

    $.fn.close             = Plugin;
    $.fn.close.Constructor = Close;


    // CLOSE NO CONFLICT
    // =================

    $.fn.close.noConflict = function () {
        $.fn.close = old
        return this
    };


    // CLOSE DATA-API
    // ==============

    $(document).on('click.origam.Close.data-api', app, Close.prototype.close)

})(jQuery, window);
/**
 * Apply origamTooltip
 */

(function ($, w) {

    'use strict';

    // TOOLTIP PUBLIC CLASS DEFINITION
    // ===============================

    var Tooltip = function (element, options) {
        this.type       = null;
        this.options    = null;
        this.enabled    = null;
        this.timeout    = null;
        this.hoverState = null;
        this.$element   = null;
        this.inState    = null;

        this.init('tooltip', element, options)
    };

    Tooltip.VERSION  = '0.1.0';

    Tooltip.TRANSITION_DURATION = 1000;

    Tooltip.DEFAULTS = {
        placement: 'top',
        selector: false,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: 'hover focus',
        title: '',
        delay: 0,
        html: false,
        container: false,
        viewport: {
            selector: 'body',
            padding: 0
        }
    };

    Tooltip.prototype.init = function (type, element, options) {
        this.enabled   = true;
        this.type      = type;
        this.$element  = $(element);
        this.options   = this.getOptions(options);
        this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport));
        this.inState   = { click: false, hover: false, focus: false };

        if (this.$element[0] instanceof document.constructor && !this.options.selector) {
            throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
        }

        var triggers = this.options.trigger.split(' ');

        for (var i = triggers.length; i--;) {
            var trigger = triggers[i];

            if (trigger == 'click') {
                this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
            } else if (trigger != 'manual') {
                var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin';
                var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout';

                this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this));
                this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
            }
        }

        this.options.selector ?
            (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
            this.fixTitle()
    };

    Tooltip.prototype.getDefaults = function () {
        return Tooltip.DEFAULTS
    };

    Tooltip.prototype.getOptions = function (options) {
        options = $.extend({}, this.getDefaults(), this.$element.data(), options);

        if (options.delay && typeof options.delay == 'number') {
            options.delay = {
                show: options.delay,
                hide: options.delay
            }
        }

        return options
    };

    Tooltip.prototype.getDelegateOptions = function () {
        var options  = {};
        var defaults = this.getDefaults();

        this._options && $.each(this._options, function (key, value) {
            if (defaults[key] != value) options[key] = value
        });

        return options
    };

    Tooltip.prototype.enter = function (obj) {
        var self = obj instanceof this.constructor ?
            obj : $(obj.currentTarget).data('origam.' + this.type);

        if (!self) {
            self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
            $(obj.currentTarget).data('origam.' + this.type, self)
        }

        if (obj instanceof $.Event) {
            self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
        }

        if (self.tip().hasClass('show') || self.hoverState == 'show') {
            self.hoverState = 'show';
            return
        }

        clearTimeout(self.timeout);

        self.hoverState = 'show';

        if (!self.options.delay || !self.options.delay.show) return self.show();

        self.timeout = setTimeout(function () {
            if (self.hoverState == 'show') self.show()
        }, self.options.delay.show)
    };

    Tooltip.prototype.isInStateTrue = function () {
        for (var key in this.inState) {
            if (this.inState[key]) return true
        }

        return false
    };

    Tooltip.prototype.leave = function (obj) {
        var self = obj instanceof this.constructor ?
            obj : $(obj.currentTarget).data('origam.' + this.type);

        if (!self) {
            self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
            $(obj.currentTarget).data('origam.' + this.type, self)
        }

        if (obj instanceof $.Event) {
            self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
        }

        if (self.isInStateTrue()) return;

        clearTimeout(self.timeout);

        self.hoverState = 'hide';

        if (!self.options.delay || !self.options.delay.hide) return self.hide();

        self.timeout = setTimeout(function () {
            if (self.hoverState == 'hide') self.hide()
        }, self.options.delay.hide)
    };

    Tooltip.prototype.show = function () {
        var e = $.Event('show.origam.' + this.type);

        if (this.hasContent() && this.enabled) {
            this.$element.trigger(e);

            var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
            if (e.isDefaultPrevented() || !inDom) return;
            var that = this;

            var $tip = this.tip();

            var tipId = this.getUID(this.type);

            this.setContent();
            $tip.attr('id', tipId);
            this.$element.attr('aria-describedby', tipId);

            var animate = that.$element.attr('data-animate');
            var animationOut = that.$element.attr('data-animation-out');
            var animationIn = that.$element.attr('data-animation-in');
            var animateClass = '';

            if (animate) {
                if(animationOut){$tip.removeClass(animationOut);}
                else{$tip.removeClass('fadeOut');}
                if(animationIn){
                    $tip.addClass(animationIn);
                    animateClass = animationIn;
                }
                else{
                    $tip.addClass('fadeIn');
                    animateClass = 'fadeIn';
                }
                $tip.addClass('animated');
            }

            var placement = typeof this.options.placement == 'function' ?
                this.options.placement.call(this, $tip[0], this.$element[0]) :
                this.options.placement;

            var autoToken = /\s?auto?\s?/i;
            var autoPlace = autoToken.test(placement);
            if (autoPlace) placement = placement.replace(autoToken, '') || 'top';

            $tip
                .detach()
                .css({ top: 0, left: 0, display: 'block' })
                .addClass(placement)
                .data('origam.' + this.type, this);

            this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element);
            this.$element.trigger('inserted.origam.' + this.type);

            var pos          = this.getPosition();
            var actualWidth  = $tip[0].offsetWidth;
            var actualHeight = $tip[0].offsetHeight;

            if (autoPlace) {
                var orgPlacement = placement;
                var viewportDim = this.getPosition(this.$viewport);

                placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                        placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
                            placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                                placement;

                $tip
                    .removeClass(orgPlacement)
                    .addClass(placement)
            }

            var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight);

            this.applyPlacement(calculatedOffset, placement);

            var complete = function () {
                var prevHoverState = that.hoverState;
                that.$element.trigger('shown.origam.' + that.type);
                that.hoverState = null;

                if (prevHoverState == 'hide') that.leave(that)
            };

            $.support.transition && this.$tip.hasClass(animateClass) ?
                $tip
                    .one('origamTransitionEnd', complete)
                    .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
                complete()
        }
    };

    Tooltip.prototype.applyPlacement = function (offset, placement) {
        var $tip   = this.tip();
        var width  = $tip[0].offsetWidth;
        var height = $tip[0].offsetHeight;

        // manually read margins because getBoundingClientRect includes difference
        var marginTop = parseInt($tip.css('margin-top'), 10);
        var marginLeft = parseInt($tip.css('margin-left'), 10);

        // we must check for NaN for ie 8/9
        if (isNaN(marginTop))  marginTop  = 0;
        if (isNaN(marginLeft)) marginLeft = 0;

        offset.top  += marginTop;
        offset.left += marginLeft;

        // $.fn.offset doesn't round pixel values
        // so we use setOffset directly with our own function B-0
        $.offset.setOffset($tip[0], $.extend({
            using: function (props) {
                $tip.css({
                    top: Math.round(props.top),
                    left: Math.round(props.left)
                })
            }
        }, offset), 0);

        $tip.addClass('show');

        // check to see if placing tip in new offset caused the tip to resize itself
        var actualWidth  = $tip[0].offsetWidth;
        var actualHeight = $tip[0].offsetHeight;

        if (placement == 'top' && actualHeight != height) {
            offset.top = offset.top + height - actualHeight
        }

        var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight);

        if (delta.left) offset.left += delta.left;
        else offset.top += delta.top;

        var isVertical          = /top|bottom/.test(placement);
        var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight;
        var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight';

        $tip.offset(offset);
        this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
    };

    Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
        this.arrow()
            .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
            .css(isVertical ? 'top' : 'left', '')
    };

    Tooltip.prototype.setContent = function () {
        var $tip  = this.tip();
        var title = this.getTitle();

        $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title);
        $tip.removeClass('fade in top bottom left right')
    };

    Tooltip.prototype.hide = function (callback) {
        var that = this;
        var $tip = $(this.$tip);
        var e    = $.Event('hide.origam.' + this.type);

        function complete() {
            $tip.removeClass('show');
            if (that.hoverState != 'show') $tip.detach();
            that.$element
                .removeAttr('aria-describedby')
                .trigger('hidden.origam.' + that.type);
            callback && callback()
        }

        this.$element.trigger(e);

        if (e.isDefaultPrevented()) return;

        var animate = that.$element.attr('data-animate');
        var animationOut = that.$element.attr('data-animation-out');
        var animationIn = that.$element.attr('data-animation-in');
        var animateClass = '';

        if (animate) {
            if(animationIn){$tip.removeClass(animationIn);}
            else{$tip.removeClass('fadeIn');}
            if(animationOut){
                $tip.addClass(animationOut);
                animateClass = animationOut;
            }
            else{
                $tip.addClass('fadeOut');
                animateClass = 'fadeOut';
            }
            $tip.addClass('animated');
        }

        $.support.transition && $tip.hasClass(animateClass) ?
            $tip
                .one('origamTransitionEnd', complete)
                .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
            complete();

        this.hoverState = null;

        return this
    };

    Tooltip.prototype.fixTitle = function () {
        var $e = this.$element;
        if ($e.attr('title') || typeof $e.attr('data-title') != 'string') {
            $e.attr('data-title', $e.attr('title') || '').attr('title', '')
        }
    };

    Tooltip.prototype.hasContent = function () {
        return this.getTitle()
    };

    Tooltip.prototype.getPosition = function ($element) {
        $element   = $element || this.$element;

        var el     = $element[0];
        var isBody = el.tagName == 'BODY';

        var elRect    = el.getBoundingClientRect();
        if (elRect.width == null) {
            elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
        }
        var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset();
        var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() };
        var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null;

        return $.extend({}, elRect, scroll, outerDims, elOffset)
    };

    Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
        return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
            placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
                placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
                    /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

    };

    Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
        var delta = { top: 0, left: 0 };
        if (!this.$viewport) return delta;

        var viewportPadding = this.options.viewport && this.options.viewport.padding || 0;
        var viewportDimensions = this.getPosition(this.$viewport);

        if (/right|left/.test(placement)) {
            var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll;
            var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight;
            if (topEdgeOffset < viewportDimensions.top) { // top overflow
                delta.top = viewportDimensions.top - topEdgeOffset
            } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
                delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
            }
        } else {
            var leftEdgeOffset  = pos.left - viewportPadding;
            var rightEdgeOffset = pos.left + viewportPadding + actualWidth;
            if (leftEdgeOffset < viewportDimensions.left) { // left overflow
                delta.left = viewportDimensions.left - leftEdgeOffset
            } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
                delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
            }
        }

        return delta
    };

    Tooltip.prototype.getTitle = function () {
        var title;
        var $e = this.$element;
        var o  = this.options;

        title = $e.attr('data-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title);

        return title
    };

    Tooltip.prototype.getUID = function (prefix) {
        do prefix += ~~(Math.random() * 1000000);
        while (document.getElementById(prefix));
        return prefix
    };

    Tooltip.prototype.tip = function () {
        if (!this.$tip) {
            this.$tip = $(this.options.template);
            if (this.$tip.length != 1) {
                throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
            }
        }
        return this.$tip
    };

    Tooltip.prototype.arrow = function () {
        return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
    };

    Tooltip.prototype.enable = function () {
        this.enabled = true
    };

    Tooltip.prototype.disable = function () {
        this.enabled = false
    };

    Tooltip.prototype.toggleEnabled = function () {
        this.enabled = !this.enabled
    };

    Tooltip.prototype.toggle = function (e) {
        var self = this;
        if (e) {
            self = $(e.currentTarget).data('origam.' + this.type);
            if (!self) {
                self = new this.constructor(e.currentTarget, this.getDelegateOptions());
                $(e.currentTarget).data('origam.' + this.type, self)
            }
        }

        if (e) {
            self.inState.click = !self.inState.click;
            if (self.isInStateTrue()) self.enter(self);
            else self.leave(self)
        } else {
            self.tip().hasClass('show') ? self.leave(self) : self.enter(self)
        }
    };

    Tooltip.prototype.destroy = function () {
        var that = this;
        clearTimeout(this.timeout);
        this.hide(function () {
            that.$element.off('.' + that.type).removeData('origam.' + that.type);
            if (that.$tip) {
                that.$tip.detach()
            }
            that.$tip = null;
            that.$arrow = null;
            that.$viewport = null
        })
    };


    // TOOLTIP PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('origam.tooltip');
            var options = typeof option == 'object' && option;

            if (!data && /destroy|hide/.test(option)) return;
            if (!data) $this.data('origam.tooltip', (data = new Tooltip(this, options)));
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.tooltip;

    $.fn.tooltip             = Plugin;
    $.fn.tooltip.Constructor = Tooltip;


    // TOOLTIP NO CONFLICT
    // ===================

    $.fn.tooltip.noConflict = function () {
        $.fn.tooltip = old;
        return this
    }

    $(document).ready(function() {
        $('[data-app="tooltip"]').tooltip();
    });

})(jQuery, window);
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
            },
            currency: function (cell) {
                var val = $(cell).data('value') || $(cell).text().replace(/[^0-9\.]+/g, '');
                val = parseFloat(val);
                if (isNaN(val)) val = 0;
                return val;
            },
            date: function (cell) {
                var val = $(cell).data('value') || $(cell).text();
                val = new Date(val);
                val = Date.parse(val);
                return val;
            }
        },
        columnDataSelector: '> thead > tr:last-child > th, > thead > tr:last-child > td',
        classes: {
            main: 'origamtable',
            loading: 'origamtable-loading',
            loaded: 'origamtable-loaded'
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


        var that = this,
            colData = [];

        this.$element.find(this.options.columnDataSelector).each(function (index, e) {
            var data = that.getColumnData(e);
            colData[data.index] = data;
        });

        this.columnsData = colData;

        this.$element.addClass(this.classes.loading);

        this.tableEvent();

        this.$element.removeClass(this.classes.loading);

        this.$element.addClass(this.classes.loaded).addClass(this.classes.main);

    };

    Table.prototype.getDefaults = function () {
        return Table.DEFAULTS
    };

    Table.prototype.getOptions = function (options) {
        options = $.extend({}, this.getDefaults(), this.$element.data(), options);

        return options
    };

    Table.prototype.getColumnData = function (e) {
        var $th = $(e),
            hide = $th.data('hide'),
            index = $th.index();

        hide = hide || false;
        var data = {
            'index': index,
            'hide': hide,
            'type': $th.data('type'),
            'name': $th.data('name') || $.trim($th.text()),
            'ignore': $th.data('ignore') || false,
            'sortIgnore': $th.data('sortignore') || false,
            'className': $th.data('class') || null,
            'matches': [],
            'names': { },
            'group': $th.data('group') || null,
            'groupName': null,
            'isEditable': $th.data('editable'),
            'priority' : 'undefined',
            'width' : 0
        };

        if(typeof $th.data('priority') === 'undefined'){
            this.max = this.max + 1;
            $th.attr('data-priority', this.max);

        }

        data.priority = parseInt($th.data('priority'), 10);

        var priorityWidth = $th.outerWidth();
        $th.css('width', priorityWidth);

        data.width += priorityWidth;

        if (data.group !== null) {
            var $group = this.$element.find('> thead > tr.responsivetable-group-row > th[data-group="' + data.group + '"], > thead > tr.responsivetable-group-row > td[data-group="' + data.group + '"]').first();
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

    Table.prototype.tableEvent = function () {
        return null;
    };

    Table.prototype.parse = function (cell, column) {
        var parser = this.options.parsers[column.type] || this.options.parsers.alpha;
        return parser(cell);
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

/**
 * Apply origamCollapse
 */


/**
 * Apply origamColorPicker
 */

(function ($, w) {

    'use strict';

    // COLORPICKER PUBLIC CLASS DEFINITION
    // ===============================

    var Colorpicker = function (element, options) {
        this.type = null;
        this.options = null;
        this.$element = null;

        this.init('colorpicker', element, options)
    };

    // COLOR CONVERTION PUBLIC FUNCTIONS
    // ===============================
    var hexToRgb = function (hex) {
            var hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);
            return {
                r: hex >> 16,
                g: (hex & 0x00FF00) >> 8,
                b: (hex & 0x0000FF)
            };
        },

        hsbToHex = function (hsb) {
            return rgbToHex(hsbToRgb(hsb));
        },

        hexToHsb = function (hex) {
            return rgbToHsb(hexToRgb(hex));
        },

        rgbToHsb = function (rgb) {
            var hsb = {h: 0, s: 0, b: 0};
            var min = Math.min(rgb.r, rgb.g, rgb.b);
            var max = Math.max(rgb.r, rgb.g, rgb.b);
            var delta = max - min;
            hsb.b = max;
            hsb.s = max != 0 ? 255 * delta / max : 0;
            if (hsb.s != 0) {
                if (rgb.r == max) hsb.h = (rgb.g - rgb.b) / delta;
                else if (rgb.g == max) hsb.h = 2 + (rgb.b - rgb.r) / delta;
                else hsb.h = 4 + (rgb.r - rgb.g) / delta;
            } else hsb.h = -1;
            hsb.h *= 60;
            if (hsb.h < 0) hsb.h += 360;
            hsb.s *= 100 / 255;
            hsb.b *= 100 / 255;
            return hsb;
        },

        hsbToRgb = function (hsb) {
            var rgb = {};
            var h = hsb.h;
            var s = hsb.s * 255 / 100;
            var v = hsb.b * 255 / 100;
            if (s == 0) {
                rgb.r = rgb.g = rgb.b = v;
            } else {
                var t1 = v;
                var t2 = (255 - s) * v / 255;
                var t3 = (t1 - t2) * (h % 60) / 60;
                if (h == 360) h = 0;
                if (h < 60) {
                    rgb.r = t1;
                    rgb.b = t2;
                    rgb.g = t2 + t3
                }
                else if (h < 120) {
                    rgb.g = t1;
                    rgb.b = t2;
                    rgb.r = t1 - t3
                }
                else if (h < 180) {
                    rgb.g = t1;
                    rgb.r = t2;
                    rgb.b = t2 + t3
                }
                else if (h < 240) {
                    rgb.b = t1;
                    rgb.r = t2;
                    rgb.g = t1 - t3
                }
                else if (h < 300) {
                    rgb.b = t1;
                    rgb.g = t2;
                    rgb.r = t2 + t3
                }
                else if (h < 360) {
                    rgb.r = t1;
                    rgb.g = t2;
                    rgb.b = t1 - t3
                }
                else {
                    rgb.r = 0;
                    rgb.g = 0;
                    rgb.b = 0
                }
            }
            return {
                r: Math.round(rgb.r),
                g: Math.round(rgb.g),
                b: Math.round(rgb.b)
            };
        },

        rgbToHex = function (rgb) {
            var hex = [
                rgb.r.toString(16),
                rgb.g.toString(16),
                rgb.b.toString(16)
            ];
            $.each(hex, function (nr, val) {
                if (val.length == 1) {
                    hex[nr] = '0' + val;
                }
            });
            return hex.join('');
        },

        // COLOR FIX FORMAT PUBLIC FUNCTIONS
        // ===============================
        fixHSB = function (hsb) {
            return {
                h: Math.min(360, Math.max(0, hsb.h)),
                s: Math.min(100, Math.max(0, hsb.s)),
                b: Math.min(100, Math.max(0, hsb.b))
            };
        },

        fixRGB = function (rgb) {
            return {
                r: Math.min(255, Math.max(0, rgb.r)),
                g: Math.min(255, Math.max(0, rgb.g)),
                b: Math.min(255, Math.max(0, rgb.b))
            };
        },

        fixHex = function (hex) {
            var len = 6 - hex.length;
            if (len > 0) {
                var o = [];
                for (var i = 0; i < len; i++) {
                    o.push('0');
                }
                o.push(hex);
                hex = o.join('');
            }
            return hex;
        };

    if (!$.fn.input) throw new Error('Colorpicker requires input.js');

    Colorpicker.VERSION = '0.1.0';

    Colorpicker.TRANSITION_DURATION = 1000;

    Colorpicker.DEFAULTS = $.extend({}, $.fn.input.Constructor.DEFAULTS, {
        templateWrapper: '<div class="origam-colorpick"></div>',
        templateColor: '<div class="origam-colorpick--color"></div>',
        templateColorSelector: '<div class="origam-colorpick--selector_outer"><div class="origam-colorpick--selector_inner"></div></div>',
        templateHue: '<div class="origam-colorpick--hue"></div>',
        templateHueSelector: '<div class="origam-colorpick--hue_arrs"><div class="origam-colorpick--hue_larr"></div><div class="origam-colorpick--hue_rarr"></div></div>',
        templateForm: '<div class="origam-colorpick--form"></div>',
        templateSubmit: '<div class="origam-colorpick--submit btn btn-ghost"></div>',
        templateNewColor: '<div class="origam-colorpick--new_color"></div>',
        templateOriginColor: '<div class="origam-colorpick--current_color"></div>',
        templateWrapperField: '<div class="origam-colorpick--field text-field text-field--addons left"><div class="text-field--group"></div></div>',
        templateLabelField: '<div class="origam-colorpick--field_letter text-field--group__addons"></div>',
        templateField: '<input data-form="input" type="number" min="0" max="" />',
        templateColorElement: '<div class="text-field--color_current"></div>',
        templateOverlay: '<div class="origam-overlay"></div>',
        classes: {
            focus: 'text-field--focused',
            active: 'text-field--active',
            addonsLeft: 'text-field--addons left',
            addonsRight: 'text-field--addons right',
            field: 'text-field--group__input',
            parent: 'text-field--color'
        },
        color: 'FF0000',
        livepreview: true,
        layout: 'full',
        submittext: 'OK',
        format: '#',
        height: 230
    });

    Colorpicker.prototype = $.extend({}, $.fn.input.Constructor.prototype);

    Colorpicker.prototype.constructor = Colorpicker;

    /**
     * @Implement event
     *
     * @define Add event to input. This input Event make colorpicker
     *
     * @param options
     *
     * @returns {Colorpicker}
     */
    Colorpicker.prototype.event = function (options) {
        // Init colorpicker object
        this.options = this.getOptions(options);
        this.field = new Array();
        this.fields = {
            'hex': {
                'class': 'origam-colorpick--hex_field',
                'label': '#',
                'type': 'text',
                'maxlenght': 6,
                'size': 6
            },
            'origin': {
                'class': 'origam-colorpick--origin_field',
                'label': '#'
            },
            'rgb_r': {
                'class': 'origam-colorpick--rgb_r',
                'label': 'R',
                'max': '255'
            },
            'hsb_h': {
                'class': 'origam-colorpick--hsb_h',
                'label': 'H',
                'max': '360'
            },
            'rgb_g': {
                'class': 'origam-colorpick--rgb_g',
                'label': 'G',
                'max': '255'
            },
            'hsb_s': {
                'class': 'origam-colorpick--hsb_s',
                'label': 'S',
                'max': '100'
            },
            'rgb_b': {
                'class': 'origam-colorpick--rgb_b',
                'label': 'B',
                'max': '255'
            },
            'hsb_b': {
                'class': 'origam-colorpick--hsb_b',
                'label': 'B',
                'max': '100'
            }
        };

        this.$element.data('origam-colorpickId', this.id);

        // Convert default color to HSB color
        if (typeof this.options.color == 'string') {
            this.options.color = hexToHsb(this.options.color);
        } else if (this.options.color.r != undefined && this.options.color.g != undefined && this.options.color.b != undefined) {
            this.options.color = rgbToHsb(this.options.color);
        } else if (this.options.color.h != undefined && this.options.color.s != undefined && this.options.color.b != undefined) {
            this.options.color = fixHSB(this.options.color);
        } else {
            return this;
        }

        // Create colorpicker
        this.$overlay = $(this.options.templateOverlay);
        this.origColor = this.$element.val() ? this.$element.val() : this.options.color;

        this.$colorpick = $(this.options.templateWrapper)
            .attr('id', this.id)
            .addClass('origam-colorpick--' + this.options.layout);

        this.$submitField = $(this.options.templateSubmit).attr('data-target', '#' + this.id);

        this.$form = $(this.options.templateForm);
        this.$currentColor = $(this.options.templateOriginColor);
        this.$newColor = $(this.options.templateNewColor);

        this.$selector = $(this.options.templateColor).css({
            'height': this.options.height,
            'width': this.options.height
        });
        this.$selectorIndic = $(this.options.templateColorSelector);

        this.$hue = $(this.options.templateHueSelector);
        this.$huebar = $(this.options.templateHue).append(this.$hue);

        this.options.placement = 'before';
        this.$wrapper = this.addAddon();
        this.$wrapper.text(this.options.format);

        this.$color = $(this.options.templateColorElement);

        this.$output = $('<div/>').addClass(this.classes.field);

        // Define input event
        this.$element
            .after(this.$output)
            .parents(this.$parent)
            .addClass(this.classes.parent)
            .on('click', $.proxy(this.show, this))
            .prepend(this.$color);

        // Centering modal if window is resize
        $(w).on('resize', $.proxy(this.moveModal(this.$colorpick), this));
    };

    Colorpicker.prototype.getDefaults = function () {
        return Colorpicker.DEFAULTS
    };

    /**
     * @Implement submit
     *
     * @param e
     */
    Colorpicker.prototype.submit = function (e) {
        this.origColor = this.options.color;
        this.setCurrentColor(this.options.color);
        this.setOrigineFields(this.options.color);
        this.setElement(this.options.color);
    };

    /**
     * @Implement createSelector
     *
     * @definition Create saturation/brightness selector
     *
     */
    Colorpicker.prototype.createSelector = function () {
        this.$selector
            .html('')
            .on('mousedown touchstart', $.proxy(this.eventSelector, this))
            .append('<div class="origam-colorpick--color_overlay1"><div class="origam-colorpick--color_overlay2"></div></div>')
            .children().children().append(this.$selectorIndic);
    };

    /**
     * @Implement createHue
     *
     * @definition Create hue selector
     *
     */
    Colorpicker.prototype.createHue = function () {
        var UA = navigator.userAgent.toLowerCase(),
            isIE = navigator.appName === 'Microsoft Internet Explorer',
            IEver = isIE ? parseFloat(UA.match(/msie ([0-9]{1,}[\.0-9]{0,})/)[1]) : 0,
            ngIE = ( isIE && IEver < 10 ),
            stops = ['#ff0000', '#ff0080', '#ff00ff', '#8000ff', '#0000ff', '#0080ff', '#00ffff', '#00ff80', '#00ff00', '#80ff00', '#ffff00', '#ff8000', '#ff0000'];

        this.$huebar.html('');

        if (ngIE) {
            var i;
            for (i = 0; i <= 11; i++) {
                $('<div>')
                    .attr('style', 'height:8.333333%; filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr=' + stops[i] + ', endColorstr=' + stops[i + 1] + '); -ms-filter: "progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr=' + stops[i] + ', endColorstr=' + stops[i + 1] + ')";')
                    .appendTo(this.$huebar);
            }
        } else {
            var stopList = stops.join(',');
            this.$huebar.attr('style', 'background:-webkit-linear-gradient(top,' + stopList + '); background: -o-linear-gradient(top,' + stopList + '); background: -ms-linear-gradient(top,' + stopList + '); background:-moz-linear-gradient(top,' + stopList + '); -webkit-linear-gradient(top,' + stopList + '); background:linear-gradient(to bottom,' + stopList + '); ');
        }

        this.$huebar
            .on('mousedown touchstart', $.proxy(this.eventHue, this))
            .height(this.options.height);
    };

    /**
     * @Implement createForm
     *
     * @definition Create input form to select color with HEX color,
     * HSB color or RGB color.
     * Form contain original color and current color, you can come back to your
     * origin color when you click on.
     */

    Colorpicker.prototype.createForm = function() {
        var count = 0;

        this.$form
            .html('')
            .append(this.$newColor);

        this.$currentColor
            .on("click", $.proxy(this.restoreOriginal, this))
            .appendTo(this.$form);

        for (var i in this.fields) {
            var $wrapper = $(this.options.templateWrapperField),
                $label = $(this.options.templateLabelField),
                $field = $(this.options.templateField);

            $label
                .text(this.fields[i]['label'])
                .appendTo($wrapper.children());

            if (i === 'hex') {
                $field
                    .attr('type', this.fields[i]['type'])
                    .attr('maxlenght', this.fields[i]['maxlenght'])
                    .attr('size', this.fields[i]['size']);
            }
            else if (i === 'origin') {
                $field = $('<div>');
                $wrapper.addClass('text-field--disabled');
            }
            else {
                $field.attr('max', this.fields[i]['max']);
            }

            this.field[count] = $field
                .on('focusin', $.proxy(this.startFocus, this))
                .on('focusout', $.proxy(this.endFocus, this))
                .on('change', $.proxy(this.eventField, this))
                .addClass(this.classes.field)
                .appendTo($wrapper.children());

            $wrapper
                .addClass(this.fields[i]['class'])
                .appendTo(this.$form);

            count++;
        }

        this.$submitField
            .text(this.options.submittext)
            .on("click", $.proxy(this.submit, this))
            .appendTo(this.$form);

    };

    /**
     * @Implement change
     *
     * @definition When you change form field value, set value to selector,
     * hue and other form field to match them.
     *
     * @param field
     */
    Colorpicker.prototype.change = function(field) {

        if (field.parents(this.$parent).attr('class').indexOf('--hex') > 0) {
            this.options.color = hexToHsb(fixHex(this.field[0].val()));
            this.fillRGBFields(this.options.color);
            this.fillHSBFields(this.options.color);
        } else if (field.parents(this.$parent).attr('class').indexOf('--hsb') > 0) {
            this.options.color = fixHSB({
                h: this.field[3].val(),
                s: this.field[5].val(),
                b: this.field[7].val()
            });
            this.fillRGBFields(this.options.color);
            this.fillHexFields(this.options.color);
        } else {
            this.options.color= rgbToHsb(fixRGB({
                r: this.field[2].val(),
                g: this.field[4].val(),
                b: this.field[6].val()
            }));
            this.fillHexFields(this.options.color);
            this.fillHSBFields(this.options.color);
        }

        this.setSelector(this.options.color);
        this.setHue(this.options.color);
        this.setNewColor(this.options.color);
    };

    /**
     * @Implement eventField
     *
     * @definition Add event to all field
     *
     * @param e
     */
    Colorpicker.prototype.eventField = function (e){
        this.change($(e.currentTarget));
    };

    /**
     * @Implement eventSelector
     *
     * @definition Add event to selector
     *
     * @param e
     */
    Colorpicker.prototype.eventSelector = function (e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var offset      = 0,
            pageX       = ((e.type == 'touchstart') ? e.originalEvent.changedTouches[0].pageX : e.pageX ),
            pageY       = ((e.type == 'touchstart') ? e.originalEvent.changedTouches[0].pageY : e.pageY );

        if($(e.target).attr('class').indexOf('--color') > 0){
            offset = $(e.target).offset();
        }

        $(document).on('mouseup touchend',offset, $.proxy(this.updateSelector, this));
        $(document).on('mousemove touchmove',offset, $.proxy(this.moveSelector, this));

        this.field[5].val(parseInt(100*(Math.max(0,Math.min(this.options.height,(pageX - offset.left))))/this.options.height, 10));
        this.field[7].val(parseInt(100*(this.options.height - Math.max(0,Math.min(this.options.height,(pageY - offset.top))))/this.options.height, 10));

        this.change(this.field[5],this.field[7]);

        return false;
    };

    /**
     * @Implement moveSelector
     *
     * @definition Add event move to selector
     *
     * @param e
     */
    Colorpicker.prototype.moveSelector = function (e) {
        var offset      = 0,
            pageX       = ((e.type == 'touchmove') ? e.originalEvent.changedTouches[0].pageX : e.pageX ),
            pageY       = ((e.type == 'touchmove') ? e.originalEvent.changedTouches[0].pageY : e.pageY );

        if($(e.target).attr('class').indexOf('--color') > 0){
            offset = $(e.target).offset();
        }else {
            offset = $(e.target).parent().parent().offset();
        }

        this.field[5].val(parseInt(100*(Math.max(0,Math.min(this.options.height,(pageX - offset.left))))/this.options.height, 10));
        this.field[7].val(parseInt(100*(this.options.height - Math.max(0,Math.min(this.options.height,(pageY - offset.top))))/this.options.height, 10));

        this.change(this.field[5],this.field[7]);

        return false;
    };

    /**
     * @Implement updateSelector
     *
     * @definition Events ends
     *
     * @param e
     */
    Colorpicker.prototype.updateSelector = function (e) {
        $(document).off('mouseup touchend', $.proxy(this.updateSelector, this));
        $(document).off('mousemove touchmove', $.proxy(this.moveSelector, this));
        return false;
    };

    /**
     * @Implement eventHue
     *
     * @definition Add event to hue
     *
     * @param e
     */
    Colorpicker.prototype.eventHue = function (e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var offset      = 0,
            offsetTop   = 0,
            pageY       = ((e.type == 'touchstart') ? e.originalEvent.changedTouches[0].pageY : e.pageY );

        if($(e.target).hasClass('origam-colorpick--hue')){
            offsetTop = $(e.target).offset().top;
        }

        offset =  pageY - offsetTop;

        $(document).on('mouseup touchend', offsetTop, $.proxy(this.updateHue, this));
        $(document).on('mousemove touchmove', offsetTop, $.proxy(this.moveHue, this));

        this.field[3].val(parseInt(Math.round(360*(this.options.height - Math.max(0,Math.min(this.options.height,offset)))/this.options.height), 10));

        this.change(this.field[3]);

        return false;
    };

    /**
     * @Implement moveHue
     *
     * @definition Add event move to hue
     *
     * @param e
     */
    Colorpicker.prototype.moveHue = function (e) {
        var offset      = 0,
            offsetTop   = 0,
            pageY       = ((e.type == 'touchmove') ? e.originalEvent.changedTouches[0].pageY : e.pageY );

        if($(e.target).hasClass('origam-colorpick--hue')){
            offsetTop = $(e.target).offset().top;
        }else if($(e.target).parent().hasClass('origam-colorpick--hue')) {
            offsetTop = $(e.target).parent().offset().top;
        }

        offset =  pageY - offsetTop;

        this.field[3].val(parseInt(Math.round(360*(this.options.height - Math.max(0,Math.min(this.options.height,offset)))/this.options.height), 10));

        this.change(this.field[3]);

        return false;
    };

    /**
     * @Implement updateHue
     *
     * @definition Events ends
     *
     * @param e
     */
    Colorpicker.prototype.updateHue = function (e) {

        $(document).off('mouseup touchend', $.proxy(this.updateHue, this));
        $(document).off('mousemove touchmove',$.proxy(this.moveHue, this));
        return false;
    };

    /**
     * @Implement restoreOriginal
     *
     * @definition Restore original color to selector, hue and field
     *
     * @param e
     */
    Colorpicker.prototype.restoreOriginal = function(e) {
        var col = this.origColor;
        this.options.color = col;
        this.fillRGBFields(col);
        this.fillHSBFields(col);
        this.fillHexFields(col);
        this.setHue(col);
        this.setSelector(col);
        this.setCurrentColor(col);
        this.setNewColor(col);
    };

    /**
     * @Implement fillRGBFields
     *
     * @definition Set value to RGB fields
     *
     * @param hsb
     */
    Colorpicker.prototype.fillRGBFields = function  (hsb) {
        var rgb = hsbToRgb(hsb);
        this.field[2].val(rgb.r);
        this.field[4].val(rgb.g);
        this.field[6].val(rgb.b);
    };

    /**
     * @Implement fillHSBFields
     *
     * @definition Set value to HSB fields
     *
     * @param hsb
     */
    Colorpicker.prototype.fillHSBFields = function  (hsb) {
        this.field[3].val(Math.round(hsb.h));
        this.field[5].val(Math.round(hsb.s));
        this.field[7].val(Math.round(hsb.b));
    };

    /**
     * @Implement fillHexFields
     *
     * @definition Set value to HEX fields
     *
     * @param hsb
     */
    Colorpicker.prototype.fillHexFields = function (hsb) {
        this.field[0].val(hsbToHex(hsb));
    };

    /**
     * @Implement setHue
     *
     * @definition Set value to hue barre
     *
     * @param hsb
     */
    Colorpicker.prototype.setHue = function (hsb) {
        this.$hue.css('top', parseInt(this.options.height - this.options.height * hsb.h/360, 10));
    };

    /**
     * @Implement setSelector
     *
     * @definition Set value to selector
     *
     * @param hsb
     */
    Colorpicker.prototype.setSelector = function (hsb) {
        this.$selector.css('backgroundColor', '#' + hsbToHex({h: hsb.h, s: 100, b: 100}));
        this.$selectorIndic.css({
            left: parseInt(this.options.height * hsb.s/100, 10),
            top: parseInt(this.options.height * (100-hsb.b)/100, 10)
        });
    };

    /**
     * @Implement setCurrentColor
     *
     * @definition Set value to current color div
     *
     * @param hsb
     */
    Colorpicker.prototype.setCurrentColor = function (hsb) {
        this.$currentColor.css('backgroundColor', '#' + hsbToHex(hsb));
    };

    /**
     * @Implement setNewColor
     *
     * @definition Set value to new color div
     *
     * @param hsb
     */
    Colorpicker.prototype.setNewColor = function (hsb) {
        this.$newColor.css('backgroundColor', '#' + hsbToHex(hsb));
    };

    /**
     * @Implement setOrigineFields
     *
     * @definition Set value to original field
     *
     * @param hsb
     */
    Colorpicker.prototype.setOrigineFields = function (hsb) {
        this.field[1].text(hsbToHex(hsb));
    };

    /**
     * @Implement setElement
     *
     * @definition Set value to input
     *
     * @param hsb
     */
    Colorpicker.prototype.setElement = function (hsb) {
        var formatColor,
            rgb;

        if (this.options.format === 'rgb'){
            rgb = hsbToRgb(hsb);
            formatColor = '( ' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ') ';
        }
        else if (this.options.format === 'hsb') {
            formatColor = '( ' + hsb.h + ', ' + hsb.s + ', ' + hsb.b + ') ';
        }
        else {
            formatColor = hsbToHex(hsb)
        }

        this.$output.text(formatColor);

        if(this.$element.attr('type') == 'color'){
            formatColor = '#' + hsbToHex(hsb)
        }

        this.$element
            .val(formatColor)
            .parents(this.$parent)
            .addClass(this.classes.active);

        this.$color.css('backgroundColor', '#' + hsbToHex(hsb));

        this.hide();
    };

    /**
     * @Implement action
     *
     * @definition hide colorpicker if user click outside modal and
     * if modal is active
     *
     * @param e
     */
    Colorpicker.prototype.action = function(e){
        if (!this.mouseOnContainer && this.activate){
            this.hide();
        }
    };

    /**
     * @Implement show
     *
     * @definition Show colorpick in modal when user click on input
     *
     * @param e
     */
    Colorpicker.prototype.show = function (e) {
        var that            = this,
            viewportHeight  = $(window).height(),
            viewportWidtht  = $(window).width();

        this.activate = true;
        this.mouseOnContainer = false;
        this.$element.off('click', $.proxy(this.show, this));

        this.createSelector();
        this.createHue();
        this.createForm();

        this.$colorpick
            .append(this.$selector)
            .append(this.$huebar)
            .append(this.$form);

        if(this.options.animate) {
            this.$colorpick
                .attr('data-animate', 'true')
                .attr('data-animation', that.options.animationOut)
                .addClass(that.options.animationIn)
                .addClass('animated');
            var animateClass = this.options.animationIn + ' animated';
        }

        this.fillRGBFields(this.options.color);
        this.fillHSBFields(this.options.color);
        this.fillHexFields(this.options.color);
        this.setHue(this.options.color);
        this.setSelector(this.options.color);
        this.setCurrentColor(this.options.color);
        this.setNewColor(this.options.color);
        this.setOrigineFields(this.options.color);

        this.$overlay.appendTo(document.body);
        this.$colorpick
            .appendTo(document.body)
            .css({
                'top':  (viewportHeight/2) - (this.$colorpick.outerHeight()/2),
                'left': (viewportWidtht/2) - (this.$colorpick.outerWidth()/2)
            });

        this.bindSelector(this.$colorpick);

        var onShow = function () {
            if (that.$colorpick.hasClass(animateClass))
                that.$colorpick.removeClass(animateClass);
            that.$colorpick.trigger('show.origam.' + that.type);
        };

        $.support.transition && this.$colorpick.hasClass(animateClass) ?
            this.$colorpick
                .one('origamTransitionEnd', onShow)
                .emulateTransitionEnd(Color.TRANSITION_DURATION) :
            onShow();

        return false;
        
    };

    /**
     * @Implement hide
     *
     * @definition hide colorpick
     *
     * @param e
     */
    Colorpicker.prototype.hide = function (e) {
        var that = this;

        this.activate = false;

        if (e) e.preventDefault();

        this.$colorpick.trigger(e = $.Event('close.origam.' + this.type));

        var animate = this.$colorpick.attr('data-animate');
        var animation = this.$colorpick.attr('data-animation');

        if (animate) {
            if(animation){this.$colorpick.addClass(animation);}
            else{this.$colorpick.addClass('fadeOut');}
            this.$colorpick.addClass('animated');
            var animateClass = animation + ' animated';
        }


        if (e.isDefaultPrevented()) return;

        function removeElement() {
            if (that.$colorpick.hasClass(animateClass))
                that.$colorpick.removeClass(animateClass);
            that.$overlay.remove();
            that.$colorpick
                .detach()
                .trigger('closed.origam.' + that.type)
                .remove();
            that.$element.change();
        }

        $.support.transition && this.$colorpick.hasClass(animateClass)?
            this.$colorpick
                .one('origamTransitionEnd', removeElement)
                .emulateTransitionEnd(Colorpicker.TRANSITION_DURATION) :
            removeElement()

    };

    // COLORPICKER PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('origam.colorpicker');
            var options = typeof option == 'object' && option;

            if (!data) $this.data('origam.colorpicker', (data = new Colorpicker(this, options)));
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.colorpicker;

    $.fn.colorpicker             = Plugin;
    $.fn.colorpicker.Constructor = Colorpicker;


    // COLORPICKER NO CONFLICT
    // ===================

    $.fn.input.noConflict = function () {
        $.fn.colorpicker = old;
        return this
    };

    $(document).ready(function() {
        $('[data-form="color"]').colorpicker();
        $('[type="color"]').colorpicker();
    });

})(jQuery, window);
/**
 * Apply origamDatepickerPicker
 */

(function ($, w) {

    'use strict';

    // DATEPICKER PUBLIC CLASS DEFINITION
    // ===============================

    var Datepicker = function (element, options) {
        this.type       = null;
        this.options    = null;
        this.$element   = null;

        this.init('datepicker', element, options)
    };

    if (!$.fn.input) throw new Error('Datepicker requires input.js');

    Datepicker.VERSION  = '0.1.0';

    Datepicker.TRANSITION_DURATION = 1000;

    Datepicker.DEFAULTS = $.extend({}, $.fn.input.Constructor.DEFAULTS, {
        templateWrapper: '<div class="origam-datepick"></div>',
        templateView: '<div class="origam-datepick--view"></div>',
        templateTime: '<div class="origam-datepick--view__time"></div>',
        templateDayL: '<div class="origam-datepick--view__dayL"></div>',
        templateDayN: '<div class="origam-datepick--view__dayN"></div>',
        templateWeek: '<div class="origam-datepick--view__week"></div>',
        templateMonth: '<div class="origam-datepick--view__month"></div>',
        templateYear: '<div class="origam-datepick--view__year"></div>',
        templateForm: '<div class="origam-datepick--calendar"></div>',
        templateCalendarHeader: '<div class="origam-datepick--calendar__header"></div>',
        templateCalendarContent: '<div class="origam-datepick--calendar__content"></div>',
        templateSubmit: '<div class="origam-datepick--submit btn btn-ghost"></div>',
        templateOverlay: '<div class="origam-overlay"></div>',
        templatePrev: '<span class="origamicon origamicon-angle-left"></span>',
        templateNext: '<span class="origamicon origamicon-angle-right"></span>',
        classes: {
            focus: 'text-field--focused',
            active: 'text-field--active',
            addonsLeft: 'text-field--addons left',
            addonsRight: 'text-field--addons right',
            weekTitle: 'view-week--title',
            weekContent: 'view-week--content',
            header: 'calendar-header--title',
            col: 'calendar-header--title__col',
            selector: 'title-col--selector',
            week: 'calendar-content--week',
            weekDay: 'calendar-content--week__day',
            days: 'calendar-content--days',
            row: 'calendar-content--days__week',
            day: 'calendar-content--days__day',
            selected: 'calendar-content--days__selected',
            today: 'calendar-content--days__today',
            otherMonth: 'calendar-content--days__disable',
            hover: 'calendar-content--days__hover',
            canvas: 'view-canvas',
            prev : 'title-col--prev',
            next: 'title-col--next'
        },
        submittext: 'OK',
        startdate: '',
        enddate: '',
        startin : 0,
        weektext: 'Week',
        weekday: {
            0: "Sunday",
            1: "Monday",
            2: "Tuesday",
            3: "Wednesday",
            4: "Thursday",
            5: "Friday",
            6: "Saturday"
        },
        month: {
            0: "January",
            1: "February",
            2: "March",
            3: "April",
            4: "May",
            5: "June",
            6: "July",
            7: "August",
            8: "September",
            9: "October",
            10: "November",
            11: "December"
        },
        type: 'date',
        createView: function (content, $container) {
            if(content.time){
                $container.append(content.time);
            }
            if(content.clock){
                $container.append(content.clock);
            }
            if(content.dayL){
                $container.append(content.dayL);
            }
            if(content.month){
                $container.append(content.month);
            }
            if(content.dayN){
                $container.append(content.dayN);
            }
            if(content.week){
                $container.append(content.week);
            }
            if(content.year){
                $container.append(content.year);
            }
        }
    });

    Datepicker.prototype = $.extend({}, $.fn.input.Constructor.prototype);

    Datepicker.prototype.constructor = Datepicker;

    /**
     * @Implement event
     *
     * @define Add event to input. This input Event make datepicker
     *
     * @param options
     *
     * @returns {Datepicker}
     */
    Datepicker.prototype.event = function (options) {
        this.options            = this.getOptions(options);
        this.type               = this.$element.attr('type') && this.$element.attr('type')!== 'text' ? this.$element.attr('type') : this.options.type;
        this.lang               = navigator.language || navigator.userLanguage;
        this.viewContent        = new Array();

        this.date               = this.options.startdate.length !== 0 ? new Date(this.options.startdate) : this.$element.val() ? this.$element.val() : new Date();
        this.today              = new Date();
        this.currentDay         = this.date;
        this.minutes            = this.date.getMinutes();
        this.hours              = this.date.getHours();
        this.day                = new Array();
        this.day.letter         = this.options.weekday[this.date.getDay()];
        this.day.number         = this.date.getDate();
        this.week               = this.getWeekNumber(this.date);
        this.month              = new Array();
        this.month.letter       = this.options.month[this.date.getMonth()];
        this.month.number       = this.date.getMonth();
        this.year               = this.date.getFullYear();

        this.$overlay = $(this.options.templateOverlay);
        this.$element.data('origam-'+ this.type +'pickId', this.id);

        this.$datepick = $(this.options.templateWrapper)
            .attr('id', this.id)
            .addClass('origam-datepick--' + this.type);

        this.$submitField = $(this.options.templateSubmit).attr('data-target', '#' + this.id);

        this.$view = $(this.options.templateView);

        this.$viewTime = $(this.options.templateTime);
        this.$viewDayL = $(this.options.templateDayL);
        this.$viewDayN = $(this.options.templateDayN);
        this.$viewWeek = $(this.options.templateWeek);
        this.$viewMonth = $(this.options.templateMonth);
        this.$viewYear = $(this.options.templateYear);

        this.$viewWeekContent = $('<span/>').addClass(this.classes.weekContent);
        var weekTitle = $('<span/>')
            .addClass(this.classes.weekTitle)
            .text(this.options.weektext);

        this.$viewWeek
            .append(this.$viewWeekContent)
            .append(weekTitle);

        this.$form = $(this.options.templateForm);

        this.$header = $(this.options.templateCalendarHeader);
        this.$title = $('<div/>').addClass(this.classes.header);
        this.$content = $(this.options.templateCalendarContent);

        this.col = new Array();
        this.nextArraw = new Array();
        this.prevArraw = new Array();
        this.selector = new Array();

        for( var j = 0; j < 2; j++) {
            this.col[j] = $('<span/>').addClass(this.classes.col);
            this.selector[j] = $('<span/>').addClass(this.classes.selector);
            this.nextArraw[j] = $(this.options.templateNext).addClass(this.classes.next);
            this.prevArraw[j] = $(this.options.templatePrev).addClass(this.classes.prev);
        }

        if(this.type !== 'time') {
            if (this.type !== 'month') {
                this.$days = $('<div/>').addClass(this.classes.days);
                this.$week = $('<div/>').addClass(this.classes.week);
            }
        } else {
            this.$clock = $('<canvas/>')
                .attr('width','250')
                .attr('height','250')
                .addClass(this.classes.canvas);

            this.initDraw();
        }

        this.$element
            .parents(this.$parent)
            .on('click', $.proxy(this.show, this));

        $(w).on('resize', $.proxy(this.moveModal(this.$datepick), this));
    };

    Datepicker.prototype.getDefaults = function () {
        return Datepicker.DEFAULTS
    };

    /**
     * @Implement updateView
     *
     * @define Update view in datepicker and set result variables
     */
    Datepicker.prototype.updateView = function(){
        this.result = new Array();

        if(this.type !== 'time') {
            this.$viewYear.text(this.year);
            this.viewContent.year = this.$viewYear;
            this.result.push(this.year);

            if(this.type !== 'month' && this.type !== 'date' && this.type !== 'datetime') {
                this.$viewWeek.text(this.week);
                this.viewContent.week = this.$viewWeek;
                this.result.push('W' + this.week);
            }

            if(this.type !== 'week') {
                this.$viewMonth.text(this.month.letter.substring(0, 3) + '.');
                this.viewContent.month = this.$viewMonth;
                this.result.push(('0' + (this.month.number + 1)).slice(-2));
            }

            if(this.type !== 'month' && this.type !== 'week') {
                this.$viewDayL.text(this.day.letter);
                this.viewContent.dayL = this.$viewDayL;
                this.$viewDayN.text(this.day.number);
                this.viewContent.dayN = this.$viewDayN;
                this.result.push(('0' + this.day.number).slice(-2));
            }
        }else {
            var minutesText = this.minutes < 10 ? '0' + this.minutes : '' + this.minutes;
            this.$viewTime.text(this.hours + ':' + minutesText);
            this.viewContent.time = this.$viewTime;
            this.result.push(this.$viewTime.text());
            this.drawClock();
            this.viewContent.clock = this.$clock;
        }
    };

    /**
     * @Implement initDraw
     *
     * @define set clock variables
     */
    Datepicker.prototype.initDraw = function(){
        this.ctx = this.$clock[0].getContext("2d");
        this.radius = this.$clock[0].height /2;
    };

    /**
     * @Implement drawClock
     *
     * @define Init draw clock
     */
    Datepicker.prototype.drawClock = function(){
        this.ctx.translate(this.radius, this.radius);
        var radius = this.radius * 0.90;
        this.drawFace(radius);
        this.drawNumbers(radius);
        this.drawTime(radius);
    };

    /**
     * @Implement drawFace
     *
     * @define Create background of clock
     *
     * @param radius
     */
    Datepicker.prototype.drawFace = function(radius){
        this.ctx.beginPath();
        this.ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'white';
        this.ctx.fill();

        this.ctx.lineWidth = 5;
        this.ctx.strokeStyle = '#1976D2';
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#333';
        this.ctx.fill();
    };

    /**
     * @Implement drawNumbers
     *
     * @define Draw hours in clock
     *
     * @param radius
     */
    Datepicker.prototype.drawNumbers = function(radius){
        var ang;
        var num;
        this.ctx.font = radius * 0.15 + "px arial";
        this.ctx.textBaseline = "middle";
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = '#333';
        for(num = 1; num < 13; num++){
            ang = num * Math.PI / 6;
            this.ctx.rotate(ang);
            this.ctx.translate(0, - radius * 0.85);
            this.ctx.rotate(-ang);
            this.ctx.fillText(num.toString(), 0, 0);
            this.ctx.rotate(ang);
            this.ctx.translate(0, radius * 0.85);
            this.ctx.rotate(-ang);
        }
    };

    /**
     * @Implement drawTime
     *
     * @define Draw hours and minutes
     *
     * @param radius
     */
    Datepicker.prototype.drawTime = function(radius){
        var hour = this.hours,
            minute = this.minutes;

        //hour
        hour = hour % 12;
        hour = (hour * Math.PI / 6)+
        (minute * Math.PI / (6 * 60));
        this.drawHand(this.ctx, hour, radius * 0.5, radius * 0.07);
        //minute
        minute = (minute * Math.PI / 30);
        this.drawHand(this.ctx, minute, radius * 0.8, radius * 0.07);
    };

    /**
     * @Implement drawHand
     *
     * @define Draw clock hand
     *
     * @param ctx
     * @param pos
     * @param length
     * @param width
     */
    Datepicker.prototype.drawHand = function(ctx, pos, length, width) {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.strokeStyle = '#333';
        ctx.moveTo(0,0);
        ctx.rotate(pos);
        ctx.lineTo(0, -length);
        ctx.stroke();
        ctx.rotate(-pos);
    };

    /**
     * @Implement resetDraw
     *
     * @define Reset clock
     */
    Datepicker.prototype.resetDraw = function(){
        this.ctx.translate(- this.radius, - this.radius);
        this.ctx.clearRect(0, 0, this.$clock[0].width, this.$clock[0].height);
    };

    /**
     * @Implement update
     *
     * @define Update each variables
     * depend of input type / data-type / option type
     *
     * @param day
     * @param month
     * @param year
     * @param hours
     * @param minutes
     */
    Datepicker.prototype.update = function(day, month, year, hours, minutes){
        if(this.type !== 'time') {
            this.updateYear(year);
            this.updateMonth(month);
            if (this.type !== 'month' && this.type !== 'date' && this.type !== 'datetime') {
                this.updateWeek(day, month, year);
            }
            if (this.type !== 'month') {
                this.updateDay(day, month, year);
            }
        } else {
            this.updateHours(hours);
            this.updateMinutes(minutes);
        }
    };

    /**
     * @Implement updateYear
     *
     * @definition Update year variables and selector
     *
     * @param year
     */
    Datepicker.prototype.updateYear = function (year) {
        this.year = year;
        this.selector[1].text(year);
    };

    /**
     * @Implement updateMonth
     *
     * @definition Update month variables and selector
     *
     * @param month
     */
    Datepicker.prototype.updateMonth = function (month) {
        this.month.number = month;
        this.month.letter = this.options.month[month];
        this.selector[0].text(this.options.month[month]);
    };

    /**
     * @Implement updateHours
     *
     * @definition Update hours variables and selector
     *
     * @param hours
     */
    Datepicker.prototype.updateHours = function(hours){
        this.hours = hours;
        this.selector[0].text(hours);
    };

    /**
     * @Implement updateMinutes
     *
     * @definition Update minutes variables and selector
     *
     * @param minutes
     */
    Datepicker.prototype.updateMinutes = function(minutes){
        this.minutes = minutes;
        var minutesText = minutes < 10 ? '0' + this.minutes : '' + minutes;
        this.selector[1].text(minutesText);
    };

    /**
     * @Implement updateWeek
     *
     * @definition Update week variables
     *
     * @param day
     * @param month
     * @param year
     */
    Datepicker.prototype.updateWeek = function (day, month, year) {
        var d = new Date(year, month, day);

        this.week = this.getWeekNumber(d);
    };

    /**
     * @Implement getWeekNumber
     *
     * @definition Get week number in year selected
     *
     * @param d
     *
     * @return weekNo
     */
    Datepicker.prototype.getWeekNumber = function(d) {
        // Copy date so don't modify original
        d = new Date(+d);
        d.setHours(0,0,0);
        // Set to nearest Thursday: current date + 4 - current day number
        // Make Sunday's day number 7
        d.setDate(d.getDate() + 4 - (d.getDay()||7));
        // Get first day of year
        var yearStart = new Date(d.getFullYear(),0,1);
        // Calculate full weeks to nearest Thursday
        var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
        // Return array of year and week number
        return weekNo;
    };

    /**
     * @Implement updateDay
     *
     * @definition Update day variables and selector
     *
     * @param day
     * @param month
     * @param year
     */
    Datepicker.prototype.updateDay = function (day, month, year) {
        var d = new Date(year, month, day);

        this.day.number = day;
        this.day.letter = this.options.weekday[d.getDay()];

        this.updateCalendar(month, year);
    };

    /**
     * @Implement updateCalendar
     *
     * @definition Create calendar, depend of month and year
     *
     * @param month
     * @param year
     */
    Datepicker.prototype.updateCalendar = function(month, year){
        var that = this,
            data = this.getCalendarData(month, year);

        this.$days.html('');

        $.each(data, function (indexRow, valueRow) {

            var $row = $('<div/>')
                .addClass(that.classes.row)
                .appendTo(that.$days);

            if(that.type === 'week') {
                $row.on('click', $.proxy(that.getValue, that));
            }

            $.each(data[indexRow], function (indexField, valueField) {

                var classes = that.classes.day;
                classes += valueField.today ? ' ' + that.classes.today : '';
                classes += valueField.selectedMonth ? '' : ' ' + that.classes.otherMonth;

                if(that.type !== 'week') {
                    classes += valueField.selected ? ' ' + that.classes.selected : '';
                } else {
                    if(valueField.selected) {
                        $row.addClass(that.classes.selected);
                    }
                }

                var $field = $('<div/>')
                    .addClass(classes)
                    .text(valueField.value)
                    .appendTo($row);

                if(that.type !== 'week') {
                    $field.on('click', $.proxy(that.getValue, that));
                }

            });

        });

    };

    /**
     * @Implement getCalendarData
     *
     * @definition set Data to make calendar
     *
     * @param month
     * @param year
     *
     * @return optDataRow
     */
    Datepicker.prototype.getCalendarData = function (month, year){
        var thisMonth = new Date( year, month + 1, 0),
            monthLength = thisMonth.getDate(),
            firstDay = new Date( year, month, 1),
            prevMonth = new Date( year, month, 0),
            prevMonthLength = prevMonth.getDate(),
            nextMonthDay = 1,
            day = 1,
            index = 0,
            row = 0,
            optDataRow = [];

        this.startingDay = firstDay.getDay();

        // this loop is for weeks (rows)
        for ( var week = 0; week < 7; week++ ) {

            var optDataField = [],
                column = 0

            if (day > monthLength) {
                break;
            }

            // this loop is for weekdays (cells)
            for (var weekday = 0; weekday <= 6; weekday++) {
                var pos = this.startingDay - this.options.startin,
                    p = pos < 0 ? 6 + pos + 1 : pos,
                    today = month === this.today.getMonth() && year === this.today.getFullYear() && day === this.today.getDate(),
                    selected = month === this.currentDay.getMonth() && year === this.currentDay.getFullYear() && day === this.currentDay.getDate(),
                    weekDaySelected = this.date.getDay();

                var data = {
                    'index': index,
                    'value': 0,
                    'selected': false,
                    'today' : today ? true : false,
                    'selectedMonth': false
                };

                if (selected || (this.type === 'week' && ((day >= (this.currentDay.getDate() - weekDaySelected)) && (day <= (this.currentDay.getDate() + (6 - weekDaySelected)))))){
                    data.selected = true;
                }

                if ( day <= monthLength && ( week > 0 || weekday >= p ) ) {
                    data.value = day;
                    data.selectedMonth = true;
                    day++;
                } else if (day < monthLength) {
                    data.value = prevMonthLength - (p - (weekday + 1));
                } else {
                    data.value = nextMonthDay;
                    nextMonthDay++;
                }

                optDataField[column] = data;
                index++;
                column++;
            }

            optDataRow[row] = optDataField;
            row++;

        }
        return optDataRow;
    };

    /**
     * @Implement createHeader
     *
     * @definition Create Header of datepicker, the header content
     * depend of type.
     * Type Time : Header contain Hours and Minutes selector
     * Type Date
     *      DateTime
     *      Month
     *      Week : Header contain Month and Years selector
     */
    Datepicker.prototype.createHeader = function(){
        var length = this.col.length,
            that = this;

        for ( var i = 0; i < length; i++){

            this.col[i]
                .append(this.prevArraw[i])
                .append(this.selector[i])
                .append(this.nextArraw[i]);

            this.prevArraw[i].on('click', $.proxy(that.prev, that));
            this.nextArraw[i].on('click', $.proxy(that.next, that));

            this.$title.append(this.col[i]);
        }

        this.$header
            .append(this.$title);
    };

    /**
     * @Implement createWeekDays
     *
     * @definition Create week days first letter before calendar
     */
    Datepicker.prototype.createWeekDays = function(){
        var that = this;

        this.$week.html('');

        $.each(this.options.weekday, function (index, day) {
            var weekDay = $('<div/>')
                .addClass(that.classes.weekday)
                .text(day.substring(0, 1));

            that.$week.append(weekDay);
        });
    };

    /**
     * @Implement createForm
     *
     * @definition Create form, form contain header, weekdays and calendar,
     * depend of input type / data-type / option type.
     */
    Datepicker.prototype.createForm = function(){

        this.createHeader();

        if(this.type !== 'month' && this.type !== 'time') {
            this.createWeekDays();
            this.$content
                .append(this.$week)
                .append(this.$days);
        }

        this.$form
            .append(this.$header)
            .append(this.$content)
            .append(this.$submitField);

        this.update(this.day.number, this.month.number, this.year, this.hours, this.minutes);

        this.$submitField
            .text(this.options.submittext)
            .on("click", $.proxy(this.submit, this));

    };

    /**
     * @Implement submit
     *
     * @definition Add submit event to datepicker
     */
    Datepicker.prototype.submit = function() {
        var value = this.result;

        this.updateView();
        if(this.type !== 'time') {
            value = this.result.join('-');
        }

        this.$element
            .val(value)
            .change();
        this.hide();
    };

    /**
     * @Implement next
     *
     * @definition add event next
     * You can choose next month, hours, minutes or year when you click on.
     *
     * @param e
     */
    Datepicker.prototype.next = function(e){
        var index = $(e.currentTarget.parentNode).index();
        this.updateCol(index, 'next');
    };

    /**
     * @Implement prev
     *
     * @definition add event prev
     * You can choose prev month, hours, minutes or year when you click on.
     *
     * @param e
     */
    Datepicker.prototype.prev = function(e){
        var index  = $(e.currentTarget.parentNode).index();
        this.updateCol(index, 'prev');
    };

    /**
     * @Implement updateCol
     *
     * @definition Update header content, depend of next and prev event.
     *
     * @param index
     * @param type
     */
    Datepicker.prototype.updateCol = function(index, type){
        var month = this.month.number,
            year = this.year,
            hours = this.hours,
            minutes = this.minutes;

        if(this.type !== 'time') {
            if(type === 'next') {
                if(index === 0) {
                    if (month < 11) {
                        month = month + 1;
                    } else {
                        month = 0;
                    }
                } else if(index === 1) {
                    year = year + 1;
                }
            }else {
                if(index === 0) {
                    if (month > 0) {
                        month = month - 1;
                    } else {
                        month = 11;
                    }
                } else{
                    year = year -1;
                }
            }
        } else {
            if(type === 'next') {
                if(index === 0) {
                    if (hours < 23) {
                        hours = hours + 1;
                    } else {
                        hours = 0;
                    }
                } else {
                    if (minutes < 59) {
                        minutes = minutes + 1;
                    } else {
                        minutes = 0;
                    }
                }
            }else {
                if(index === 0) {
                    if (hours > 0) {
                        hours = hours - 1;
                    } else {
                        hours = 23;
                    }
                } else {
                    if (minutes > 0) {
                        minutes = minutes - 1;
                    } else {
                        minutes = 59;
                    }
                }
            }
        }

        this.update(this.day.number, month, year, hours, minutes);
        if(this.type === 'month' || this.type === 'time'){
            this.updateView();
        }
        if(this.type === 'time'){
            this.resetDraw();
        }
    };

    /**
     * @Implement getValue
     *
     * @definition Get value of target (day or week)
     *
     * @param e
     */
    Datepicker.prototype.getValue = function(e){
        this.update(e.target.innerText, this.month.number, this.year);
        this.updateView();
    };

    /**
     * @Implement action
     *
     * @definition hide datepicker if user click outside modal and
     * if modal is active
     *
     * @param e
     */
    Datepicker.prototype.action = function(e){
        if (!this.mouseOnContainer && this.activate){
            this.hide();
        }
    };

    /**
     * @Implement show
     *
     * @definition Show datepick in modal when user click on input
     *
     * @param e
     */
    Datepicker.prototype.show = function (e) {
        var that            = this,
            viewportHeight  = $(window).height(),
            viewportWidtht  = $(window).width();

        this.activate           = true;

        this.$element.off('click', $.proxy(this.show, this));

        this.updateView();
        this.options.createView(this.viewContent, this.$view);
        this.createForm();

        this.$datepick
            .append(this.$view)
            .append(this.$form);

        if(this.options.animate) {
            this.$datepick
                .attr('data-animate', 'true')
                .attr('data-animation', that.options.animationOut)
                .addClass(that.options.animationIn)
                .addClass('animated');
            var animateClass = this.options.animationIn + ' animated';
        }

        this.$overlay.appendTo(document.body);
        this.$datepick
            .appendTo(document.body)
            .css({
                'top':  (viewportHeight/2) - (this.$datepick.outerHeight()/2),
                'left': (viewportWidtht/2) - (this.$datepick.outerWidth()/2)
            });

        this.bindSelector(this.$datepick);

        var onShow = function () {
            if (that.$datepick.hasClass(animateClass))
                that.$datepick.removeClass(animateClass);
            that.$datepick.trigger('show.origam.' + that.type);
        };

        $.support.transition && this.$datepick.hasClass(animateClass) ?
            this.$datepick
                .one('origamTransitionEnd', onShow)
                .emulateTransitionEnd(Datepicker.TRANSITION_DURATION) :
            onShow();

        return false;

    };

    /**
     * @Implement hide
     *
     * @definition hide datepick
     *
     * @param e
     */
    Datepicker.prototype.hide = function (e) {
        var that = this;

        this.activate = false;

        if (e) e.preventDefault();

        this.$datepick.trigger(e = $.Event('close.origam.' + this.type));

        var animate = this.$datepick.attr('data-animate');
        var animation = this.$datepick.attr('data-animation');

        if (animate) {
            if(animation){this.$datepick.addClass(animation);}
            else{this.$datepick.addClass('fadeOut');}
            this.$datepick.addClass('animated');
            var animateClass = animation + ' animated';
        }


        if (e.isDefaultPrevented()) return;

        function removeElement() {
            if (that.$datepick.hasClass(animateClass))
                that.$datepick.removeClass(animateClass);
            that.$overlay.remove();
            if(that.type === 'time'){
                that.resetDraw();
            }
            that.$datepick
                .detach()
                .trigger('closed.origam.' + that.type)
                .remove();
        }

        $.support.transition && this.$datepick.hasClass(animateClass)?
            this.$datepick
                .one('origamTransitionEnd', removeElement)
                .emulateTransitionEnd(Datepicker.TRANSITION_DURATION) :
            removeElement()

    };

    // DATEPICKER PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('origam.datepicker');
            var options = typeof option == 'object' && option;

            if (!data) $this.data('origam.datepicker', (data = new Datepicker(this, options)));
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.datepicker;

    $.fn.datepicker             = Plugin;
    $.fn.datepicker.Constructor = Datepicker;


    // DATEPICKER NO CONFLICT
    // ===================

    $.fn.input.noConflict = function () {
        $.fn.datepicker = old;
        return this
    };

    $(document).ready(function() {
        $('[data-form="date"]').datepicker();
        $('[type="date"]').datepicker();
        $('[type="month"]').datepicker();
        $('[type="week"]').datepicker();
        $('[type="time"]').datepicker();
        $('[type="datetime"]').datepicker();
    });

})(jQuery, window);
/**
 * Apply origamEqualHeight on a list of elements (in a jQuery object) eq. $('ul li'),
 * all elements will get the higher element height
 * You can call equalHeight several times on the same elements, height will
 * be processed again.
 * @param  {obj} options :
 *     - contentContainerSelector: equalHeight can test the width of the
 *     content before reprocessing. Often we don't need to calculate height
 *     again of the content width doesn't change.
 *     - onResize: callback function called after equalHeight a processed on
 *     windows resize. Will not be called if the container width doesn't change.
 * @return {obj}         jQuery object
 */

(function ($, w) {
    $.fn.extend({
        origamEqualHeight: function (options) {
            var defaults = {
                contentContainerSelector: 'body',
                onResize: function () {
                },
            };

            options = $.extend(defaults, options);
            var o = options;

            var $els = $(this);

            var loadElementsHeight = function () {
                var maxHeight = 0;
                $els.removeClass('equal-height-processed');
                $els
                    .css('height', 'auto')
                    .each(function () {
                        var thisHeight = $(this).height();
                        maxHeight = ( thisHeight > maxHeight ) ? thisHeight : maxHeight;
                    });
                $els.height(maxHeight);
                $els.addClass('equal-height-processed');
            };

            var timerRedim;
            var containerWidth = $(o.contentContainerSelector).width();

            var elementResize = function () {
                clearTimeout(timerRedim);
                timerRedim = setTimeout(function () {
                    newContainerWidth = $(o.contentContainerSelector).width();
                    if (newContainerWidth != containerWidth) {
                        containerWidth = newContainerWidth;
                        loadElementsHeight();
                        o.onResize();
                    }
                }, 500);
            };

            loadElementsHeight();
            $(w).bind('resize', elementResize);
        }
    });
})(jQuery, window);
/**
 * Apply origamFile
 */

(function ($, w) {

    'use strict';

    // FILE PUBLIC CLASS DEFINITION
    // ===============================

    var File = function (element, options) {
        this.type       = null;
        this.options    = null;
        this.$element   = null;

        this.init('file', element, options)
    };

    if (!$.fn.input) throw new Error('File requires input.js');

    File.VERSION  = '0.1.0';

    File.TRANSITION_DURATION = 1000;

    File.DEFAULTS = $.extend({}, $.fn.input.Constructor.DEFAULTS, {
        livePreview: true
    });

    File.prototype = $.extend({}, $.fn.input.Constructor.prototype);

    File.prototype.constructor = File;

    File.prototype.event = function (options) {
        this.options        = this.getOptions(options);
    };

    File.prototype.getDefaults = function () {
        return File.DEFAULTS
    };

    // FILE PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('origam.file');
            var options = typeof option == 'object' && option;

            if (!data) $this.data('origam.file', (data = new File(this, options)));
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.file;

    $.fn.file             = Plugin;
    $.fn.file.Constructor = File;


    // FILE NO CONFLICT
    // ===================

    $.fn.input.noConflict = function () {
        $.fn.file = old;
        return this
    };

    $(document).ready(function() {
        $('[data-form="file"]').file();
    });

})(jQuery, window);

/**
 * follow the first link inside each element in the set of matched elements
 * maj 31-01-2013 : replace colorbox-load -> cboxElement
 * maj 24-08-2012 :
 * - added the parameter linkContainer
 * - added support for colorbox links (just trigger the click event)
 * - have to return TRUE if a link is not found, otherwise we stop to loop through the set of elements !
 * maj 01-09-2012
 * - improve colorbox links support, the click was triggered two times in case of clicking directly on the link
 * @param  {obj} options.linkContainer is a selector inside the element to click to target the link more accurately
 * @return {jquery}         the original set of elements
 */

(function ($, w) {
    $.fn.extend({
        origamLink: function (options) {
            var defaults = {
                linkContainer: false
            };

            options = $.extend(defaults, options);

            return this.each(function () {
                var elParent = ( !options.linkContainer ) ? $(this) : $(this).find(options.linkContainer);
                if (elParent.length === 0) elParent = $(this);

                var $firstLink;
                if (elParent.is('a')) $firstLink = elParent;
                else $firstLink = $('a:first', elParent);

                if ($firstLink.length === 0) return true;

                var newWindow = ( $firstLink.filter('[target="_blank"]').length > 0 ) ? true : false;

                if ($firstLink.hasClass('cboxElement')) {
                    var $tempLink = $firstLink.clone(true); // have to clone the link out of the parent $(this) to avoid infinite loop because of event delegation
                    $('body').append($tempLink.hide());
                    $firstLink.unbind('click');
                }

                $(this).click(function (e) {
                    $target = $(e.target);
                    targetIsLink = $target.is('a');

                    // test if we click on another link in the container
                    if (targetIsLink) return true;
                    else e.preventDefault();

                    if ($tempLink) {
                        $tempLink.click();
                        return false;
                    } else {
                        var url = $firstLink.attr('href');
                        if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
                            var referLink = document.createElement('a');
                            if (newWindow) referLink.setAttribute('target', '_blank');
                            referLink.href = url;
                            document.body.appendChild(referLink);
                            referLink.click();
                        } else {
                            if (newWindow) window.open(url);
                            else location.href = url;
                        }
                    }
                });
                $(this).css('cursor', 'pointer');
            });
        }
    });
})(jQuery, window);


/**
 * Apply origamFullScreen
 */
/**
 * trigger a function when all images inside the set of matched elements are
 * loaded timeout is defined in case of broken images
 *
 * maj 21-11-2014: add a callback triggered when an image load fail,
 * we give the image as parameter to the callback function.
 * maj 01-09-2014: enhance image loading detection (probably do not work
 * at all before that :-\ ), tested on FF and IE8!
 *
 * @param  {function} callbackFct the function to call when all is loaded
 * @param  {obj} options     options of the plugin
 * @return {obj}             jquery object
 */

(function ($, w) {
    $.fn.extend({
        origamImagesLoaded: function (callbackFct, options) {
            var defaults = {
                timeout: 3000,
                callbackImageLoadFail: function (image) {
                }
            };
            options = $.extend(defaults, options);

            if (typeof(callbackFct) != 'function') return this;

            return this.each(function () {
                var o = options;
                var el = this;
                var $el = $(el);
                var countImgLoaded = 0;
                var $images = $("img", $el);
                var countImg = $images.length;

                /* trigger callback immediatly if no image */
                if (countImg == 0 && typeof(callbackFct) == 'function') callbackFct(el, null);

                var triggerBehavior = function () {
                    if (typeof(callbackFct) == 'function') callbackFct(el, $images);
                };

                /* check of the image laod */
                var checkLoad = function () {
                    countImgLoaded++;
                    if (countImgLoaded >= countImg) {
                        triggerBehavior();
                    }
                };

                $images.each(function () {
                    var timeoutLoad;
                    var image = this;
                    var $image = $(image);

                    // immediately check for cached image
                    // source: http://stackoverflow.com/a/12905092
                    if (image.complete || typeof image.complete === 'undefined') {
                        image.onload = null;
                        checkLoad();
                    } else {
                        // try to force image reload in case of caching
                        $image.attr('data-src', image.src);
                        image.src = '';

                        // I use onload instead of bind('load'), because this last one does
                        // not trigger at all!
                        image.onload = function () {
                            clearTimeout(timeoutLoad);
                            checkLoad();
                        };
                        image.src = $image.attr('data-src');

                        /* each image has a 'o.timeout' millisecond timeout, if missing */
                        timeoutLoad = setTimeout(function () {
                            image.onload = null;
                            // trigger the callback on the image load failure
                            o.callbackImageLoadFail(image);

                            checkLoad();
                        }, o.timeout);
                    }
                });
            });
        }
    });
})(jQuery, window);



/**
 * Apply origamModal
 */


/**
 * Apply origamnotification
 */

(function ($, w) {
    'use strict';

    // NOTIFICATION CLASS DEFINITION
    // ======================

    var Notification = function (element, options) {
        this.type       = null;
        this.options    = null;
        this.$element   = null;

        this.init('notification', element, options)
    };

    Notification.VERSION = '0.1.0';

    Notification.TRANSITION_DURATION = 1000;

    Notification.DEFAULTS = {
        type: 'ghost',
        selector: 'body',
        animate: true,
        animationIn: 'jellyIn',
        animationOut: 'jellyOut',
        html: false,
        content: '',
        icon: false,
        direction: 'left',
        wrapperTemplate: '<div class="alert"></div>',
        mainTemplate: '<div class="alert-main"></div>',
        closeTemplate: '<div class="alert-close" data-button="close"><i class="origamicon origamicon-close"></i></div>',
        iconTemplate: '<div class="alert-icon"></div>',
        iconClass: 'origamicon origamicon-check2'
    };

    Notification.prototype.init = function (type, element, options) {
        // Element collection
        this.type       = type;
        this.$element   = $(element);
        this.options    = this.getOptions(options);
        this.$note      = $(this.options.wrapperTemplate);
        this.$main      = $(this.options.mainTemplate);
        this.$close     = $(this.options.closeTemplate);
        this.$icon      = $(this.options.iconTemplate);
        this.id         = this.getUID(8);

        this.$note
            .attr('id', this.id)
            .addClass('alert-' + this.options.type)
            .append(this.$main)
            .append(this.$close);

        this.$main[this.options.html ? 'html' : 'text'](this.options.content);

        if(this.options.icon){

            $('<i>')
                .addClass(this.options.iconClass)
                .appendTo(this.$icon);

            this.$note
                .addClass('icon')
                .addClass(this.options.direction);
            this.$note[this.options.direction === 'left' ? 'prepend': 'append'](this.$icon);
        }

        this.$element.on('click', $.proxy(this.show, this));

    };

    Notification.prototype.getDefaults = function () {
        return Notification.DEFAULTS
    };

    Notification.prototype.getOptions = function (options) {
        options = $.extend({}, this.getDefaults(), this.$element.data(), options);

        return options
    };

    Notification.prototype.getUID = function (length){
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
        if (!length) {
            length = Math.floor(Math.random() * chars.length);
        }
        var str = '';
        for (var i = 0; i < length; i++) {
            str += chars[Math.floor(Math.random() * chars.length)];
        }
        return str;
    };

    Notification.prototype.show = function () {

        var that = this;
        var $note = that.$note,
            viewportWidtht  = $(window).width();

        if(that.options.animate) {
            $note
                .attr('data-animate', 'true')
                .attr('data-animation', that.options.animationOut)
                .addClass(that.options.animationIn)
                .addClass('animated');
            var animateClass = that.options.animationIn + ' animated';
        }

        $note.appendTo(this.options.selector);

        $note.css({
           'position': 'fixed',
           'top': 0,
           'left': (viewportWidtht/2) - (this.$note.outerWidth()/2)
        });

        var onShow = function () {
            if ($note.hasClass(animateClass))
                $note.removeClass(animateClass);
            $note.trigger('show.origam.' + that.type);
        };

        $.support.transition && $note.hasClass(animateClass) ?
            $note
                .one('origamTransitionEnd', onShow)
                .emulateTransitionEnd(Notification.TRANSITION_DURATION) :
            onShow();

        return false;

    };

    Notification.prototype.hide = function () {

        var that = this;
        var $note = that.$note;

        if(that.options.animate) {
            $note
                .addClass(that.options.animationOut)
                .addClass('animated');
            var animateClass = that.options.animationOut + ' animated';
        }

    };

    // NOTIFICATION PLUGIN DEFINITION
    // =======================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data  = $this.data('origam.notification');

            if (!data) $this.data('origam.notification', (data = new Notification(this)));
            if (typeof option == 'string') data[option].call($this)
        })
    }

    var old = $.fn.notification;

    $.fn.notification             = Plugin;
    $.fn.notification.Constructor = Notification;


    // NOTIFICATION NO CONFLICT
    // =================

    $.fn.notification.noConflict = function () {
        $.fn.notification = old;
        return this
    };


    // NOTIFICATION DATA-API
    // ==============

    $(document).ready(function() {
        $('[data-app="notification"]').notification();
    });

})(jQuery, window);


/**
 * Apply origamPassword
 *
 */

(function ($, w) {

    'use strict';

    // PASSWORD PUBLIC CLASS DEFINITION
    // ===============================

    var Password = function (element, options) {
        this.type       = null;
        this.options    = null;
        this.$element   = null;

        this.init('password', element, options)
    };

    if (!$.fn.input) throw new Error('Password requires input.js');

    Password.VERSION  = '0.1.0';

    Password.TRANSITION_DURATION = 1000;

    Password.DEFAULTS = $.extend({}, $.fn.input.Constructor.DEFAULTS, {
        min_point : 49,
        max_point : 120,
        charsets : [
            // Commonly Used
            ////////////////////
            [0x0020, 0x0020], // Space
            [0x0030, 0x0039], // Numbers
            [0x0041, 0x005A], // Uppercase
            [0x0061, 0x007A], // Lowercase
            [0x0021, 0x002F], // Punctuation
            [0x003A, 0x0040], // Punctuation
            [0x005B, 0x0060], // Punctuation
            [0x007B, 0x007E], // Punctuation
            // Everything Else
            ////////////////////
            [0x0080, 0x00FF], // Latin-1 Supplement
            [0x0100, 0x017F], // Latin Extended-A
            [0x0180, 0x024F], // Latin Extended-B
            [0x0250, 0x02AF], // IPA Extensions
            [0x02B0, 0x02FF], // Spacing Modifier Letters
            [0x0300, 0x036F], // Combining Diacritical Marks
            [0x0370, 0x03FF], // Greek
            [0x0400, 0x04FF], // Cyrillic
            [0x0530, 0x058F], // Armenian
            [0x0590, 0x05FF], // Hebrew
            [0x0600, 0x06FF], // Arabic
            [0x0700, 0x074F], // Syriac
            [0x0780, 0x07BF], // Thaana
            [0x0900, 0x097F], // Devanagari
            [0x0980, 0x09FF], // Bengali
            [0x0A00, 0x0A7F], // Gurmukhi
            [0x0A80, 0x0AFF], // Gujarati
            [0x0B00, 0x0B7F], // Oriya
            [0x0B80, 0x0BFF], // Tamil
            [0x0C00, 0x0C7F], // Telugu
            [0x0C80, 0x0CFF], // Kannada
            [0x0D00, 0x0D7F], // Malayalam
            [0x0D80, 0x0DFF], // Sinhala
            [0x0E00, 0x0E7F], // Thai
            [0x0E80, 0x0EFF], // Lao
            [0x0F00, 0x0FFF], // Tibetan
            [0x1000, 0x109F], // Myanmar
            [0x10A0, 0x10FF], // Georgian
            [0x1100, 0x11FF], // Hangul Jamo
            [0x1200, 0x137F], // Ethiopic
            [0x13A0, 0x13FF], // Cherokee
            [0x1400, 0x167F], // Unified Canadian Aboriginal Syllabics
            [0x1680, 0x169F], // Ogham
            [0x16A0, 0x16FF], // Runic
            [0x1780, 0x17FF], // Khmer
            [0x1800, 0x18AF], // Mongolian
            [0x1E00, 0x1EFF], // Latin Extended Additional
            [0x1F00, 0x1FFF], // Greek Extended
            [0x2000, 0x206F], // General Punctuation
            [0x2070, 0x209F], // Superscripts and Subscripts
            [0x20A0, 0x20CF], // Currency Symbols
            [0x20D0, 0x20FF], // Combining Marks for Symbols
            [0x2100, 0x214F], // Letterlike Symbols
            [0x2150, 0x218F], // Number Forms
            [0x2190, 0x21FF], // Arrows
            [0x2200, 0x22FF], // Mathematical Operators
            [0x2300, 0x23FF], // Miscellaneous Technical
            [0x2400, 0x243F], // Control Pictures
            [0x2440, 0x245F], // Optical Character Recognition
            [0x2460, 0x24FF], // Enclosed Alphanumerics
            [0x2500, 0x257F], // Box Drawing
            [0x2580, 0x259F], // Block Elements
            [0x25A0, 0x25FF], // Geometric Shapes
            [0x2600, 0x26FF], // Miscellaneous Symbols
            [0x2700, 0x27BF], // Dingbats
            [0x2800, 0x28FF], // Braille Patterns
            [0x2E80, 0x2EFF], // CJK Radicals Supplement
            [0x2F00, 0x2FDF], // Kangxi Radicals
            [0x2FF0, 0x2FFF], // Ideographic Description Characters
            [0x3000, 0x303F], // CJK Symbols and Punctuation
            [0x3040, 0x309F], // Hiragana
            [0x30A0, 0x30FF], // Katakana
            [0x3100, 0x312F], // Bopomofo
            [0x3130, 0x318F], // Hangul Compatibility Jamo
            [0x3190, 0x319F], // Kanbun
            [0x31A0, 0x31BF], // Bopomofo Extended
            [0x3200, 0x32FF], // Enclosed CJK Letters and Months
            [0x3300, 0x33FF], // CJK Compatibility
            [0x3400, 0x4DB5], // CJK Unified Ideographs Extension A
            [0x4E00, 0x9FFF], // CJK Unified Ideographs
            [0xA000, 0xA48F], // Yi Syllables
            [0xA490, 0xA4CF], // Yi Radicals
            [0xAC00, 0xD7A3], // Hangul Syllables
            [0xD800, 0xDB7F], // High Surrogates
            [0xDB80, 0xDBFF], // High Private Use Surrogates
            [0xDC00, 0xDFFF], // Low Surrogates
            [0xE000, 0xF8FF], // Private Use
            [0xF900, 0xFAFF], // CJK Compatibility Ideographs
            [0xFB00, 0xFB4F], // Alphabetic Presentation Forms
            [0xFB50, 0xFDFF], // Arabic Presentation Forms-A
            [0xFE20, 0xFE2F], // Combining Half Marks
            [0xFE30, 0xFE4F], // CJK Compatibility Forms
            [0xFE50, 0xFE6F], // Small Form Variants
            [0xFE70, 0xFEFE], // Arabic Presentation Forms-B
            [0xFEFF, 0xFEFF], // Specials
            [0xFF00, 0xFFEF], // Halfwidth and Fullwidth Forms
            [0xFFF0, 0xFFFD]  // Specials
        ],
        MinimumChars: 8,
        ScaleFactor: 1,
        templateShowhide: '<span class="text-field--group__switchpass origamicon origamicon-eye"></span>',
        templateStrenght: '<span class="text-field--progressbar text-field--progressbar__danger"></span>',
        show: 'origamicon-eye',
        hide: 'origamicon-eye-blocked',
        progress: 'text-field--progressbar',
        strong: 'text-field--progressbar__success',
        danger: 'text-field--progressbar__danger',
        showhide: true,
        strenght: true,
        password: 'text-field--password'
    });

    Password.prototype = $.extend({}, $.fn.input.Constructor.prototype);

    Password.prototype.constructor = Password;

    Password.prototype.event = function (options) {
        this.options = this.getOptions(options);

        if (this.options.showhide) {
            this.showhide();
        }
        if (this.options.strenght) {
            this.strenght();
        }
    };

    Password.prototype.getDefaults = function () {
        return Password.DEFAULTS
    };

    Password.prototype.showhide = function(){
        this.$wrapper = this.addAddon();

        this.$switch = this.options.templateShowhide;

        this.$wrapper.append(this.$switch);
        var $switch = this.$wrapper.children();

        $switch.on('click', $.proxy(this.toggle, this));

    };

    Password.prototype.show = function(e){
        this.$element
            .focus()
            .attr('type', 'text');
        this.$wrapper.children().removeClass(this.options.show).addClass(this.options.hide);
    };

    Password.prototype.hide = function(e){
        this.$element
            .focus()
            .attr('type', 'password');
        this.$wrapper.children().removeClass(this.options.hide).addClass(this.options.show);
    };

    Password.prototype.strenght = function(){
        this.$strenght = this.options.templateStrenght;
        this.charsets = this.options.charsets;

        this.$element.on('keyup focus input propertychange mouseup', $.proxy(this.calculate, this));
    };

    Password.prototype.calculate = function(){
        var password    = this.$element.val();
        var complexity  = 0, valid = false;
        var $progress   = '.' + this.options.progress;

        // Add character complexity
        for (var i = this.charsets.length - 1; i >= 0; i--) {
            complexity += this.Score(password, this.charsets[i]);
        }

        // Use natural log to produce linear scale
        complexity = Math.log(Math.pow(complexity, password.length)) * (1 / this.options.ScaleFactor);

        valid = (complexity > this.options.min_point && password.length >= this.options.MinimumChars);

        // Scale to percentage, so it can be used for a progress bar
        complexity = (complexity / this.options.max_point) * 100;
        complexity = (complexity > 100) ? 100 : complexity;

        if(this.$element.parent().find($progress).length === 0) {
            this.$element.parent().append(this.$strenght);
        }

        var $progressBar = this.$element.siblings().last();

        $progressBar.toggleClass(this.options.strong, valid);
        $progressBar.toggleClass(this.options.danger, !valid);

        $progressBar.css({
            'width': complexity + '%'
        });

        if($progressBar.width() > 0) {
            this.$element.parents(this.$parent).addClass(this.options.password);
        } else{
            this.$element.parents(this.$parent).removeClass(this.options.password);
        }

    };

    Password.prototype.Score = function (str, charset) {
        for (var i = str.length - 1; i >= 0; i--) {
            if (charset[0] <= str.charCodeAt(i) && str.charCodeAt(i) <= charset[1]) {
                return charset[1] - charset[0] + 1;
            }
        }
        return 0;
    };

    // PASSWORD PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('origam.password');
            var options = typeof option == 'object' && option;

            if (!data) $this.data('origam.password', (data = new Password(this, options)));
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.password;

    $.fn.password             = Plugin;
    $.fn.password.Constructor = Password;


    // PASSWORD NO CONFLICT
    // ===================

    $.fn.input.noConflict = function () {
        $.fn.password = old;
        return this
    };

    $(document).ready(function() {
        $('[data-form="password"]').password();
    });

})(jQuery, window);
/**
 * Apply origamPhone
 *
 */

(function ($, w) {

    'use strict';

    // PHONE PUBLIC CLASS DEFINITION
    // ===============================

    var Phone = function (element, options) {
        this.type       = null;
        this.options    = null;
        this.$element   = null;

        this.init('phone', element, options)
    };

    if (!$.fn.input) throw new Error('Phone requires input.js');

    Phone.VERSION  = '0.1.0';

    Phone.TRANSITION_DURATION = 1000;

    Phone.DEFAULTS = $.extend({}, $.fn.input.Constructor.DEFAULTS, {
        autoFormat: true,
        autoPlaceholder: true,
        defaultCountry: "",
        onlyCountries: [],
        preferredCountries: [ "US", "GB", "FR" ],
        nationalMode: true,
        allowExtensions: false,
        numberType: "MOBILE",
        autoHideDialCode: true,
        utilsScript: ""
    });

    Phone.prototype = $.extend({}, $.fn.input.Constructor.prototype);

    Phone.prototype.constructor = Phone;

    Phone.prototype.event = function (options) {

        this.allCountries = [
                [
                    "Afghanistan (‫افغانستان‬‎)",
                    "af",
                    "93"
                ],
                [
                    "Albania (Shqipëri)",
                    "al",
                    "355"
                ],
                [
                    "Algeria (‫الجزائر‬‎)",
                    "dz",
                    "213"
                ],
                [
                    "American Samoa",
                    "as",
                    "1684"
                ],
                [
                    "Andorra",
                    "ad",
                    "376"
                ],
                [
                    "Angola",
                    "ao",
                    "244"
                ],
                [
                    "Anguilla",
                    "ai",
                    "1264"
                ],
                [
                    "Antigua and Barbuda",
                    "ag",
                    "1268"
                ],
                [
                    "Argentina",
                    "ar",
                    "54"
                ],
                [
                    "Armenia (Հայաստան)",
                    "am",
                    "374"
                ],
                [
                    "Aruba",
                    "aw",
                    "297"
                ],
                [
                    "Australia",
                    "au",
                    "61"
                ],
                [
                    "Austria (Österreich)",
                    "at",
                    "43"
                ],
                [
                    "Azerbaijan (Azərbaycan)",
                    "az",
                    "994"
                ],
                [
                    "Bahamas",
                    "bs",
                    "1242"
                ],
                [
                    "Bahrain (‫البحرين‬‎)",
                    "bh",
                    "973"
                ],
                [
                    "Bangladesh (বাংলাদেশ)",
                    "bd",
                    "880"
                ],
                [
                    "Barbados",
                    "bb",
                    "1246"
                ],
                [
                    "Belarus (Беларусь)",
                    "by",
                    "375"
                ],
                [
                    "Belgium (België)",
                    "be",
                    "32"
                ],
                [
                    "Belize",
                    "bz",
                    "501"
                ],
                [
                    "Benin (Bénin)",
                    "bj",
                    "229"
                ],
                [
                    "Bermuda",
                    "bm",
                    "1441"
                ],
                [
                    "Bhutan (འབྲུག)",
                    "bt",
                    "975"
                ],
                [
                    "Bolivia",
                    "bo",
                    "591"
                ],
                [
                    "Bosnia and Herzegovina (Босна и Херцеговина)",
                    "ba",
                    "387"
                ],
                [
                    "Botswana",
                    "bw",
                    "267"
                ],
                [
                    "Brazil (Brasil)",
                    "br",
                    "55"
                ],
                [
                    "British Indian Ocean Territory",
                    "io",
                    "246"
                ],
                [
                    "British Virgin Islands",
                    "vg",
                    "1284"
                ],
                [
                    "Brunei",
                    "bn",
                    "673"
                ],
                [
                    "Bulgaria (България)",
                    "bg",
                    "359"
                ],
                [
                    "Burkina Faso",
                    "bf",
                    "226"
                ],
                [
                    "Burundi (Uburundi)",
                    "bi",
                    "257"
                ],
                [
                    "Cambodia (កម្ពុជា)",
                    "kh",
                    "855"
                ],
                [
                    "Cameroon (Cameroun)",
                    "cm",
                    "237"
                ],
                [
                    "Canada",
                    "ca",
                    "1",
                    1,
                    ["204", "226", "236", "249", "250", "289", "306", "343", "365", "387", "403", "416", "418", "431", "437", "438", "450", "506", "514", "519", "548", "579", "581", "587", "604", "613", "639", "647", "672", "705", "709", "742", "778", "780", "782", "807", "819", "825", "867", "873", "902", "905"]
                ],
                [
                    "Cape Verde (Kabu Verdi)",
                    "cv",
                    "238"
                ],
                [
                    "Caribbean Netherlands",
                    "bq",
                    "599",
                    1
                ],
                [
                    "Cayman Islands",
                    "ky",
                    "1345"
                ],
                [
                    "Central African Republic (République centrafricaine)",
                    "cf",
                    "236"
                ],
                [
                    "Chad (Tchad)",
                    "td",
                    "235"
                ],
                [
                    "Chile",
                    "cl",
                    "56"
                ],
                [
                    "China (中国)",
                    "cn",
                    "86"
                ],
                [
                    "Colombia",
                    "co",
                    "57"
                ],
                [
                    "Comoros (‫جزر القمر‬‎)",
                    "km",
                    "269"
                ],
                [
                    "Congo (DRC) (Jamhuri ya Kidemokrasia ya Kongo)",
                    "cd",
                    "243"
                ],
                [
                    "Congo (Republic) (Congo-Brazzaville)",
                    "cg",
                    "242"
                ],
                [
                    "Cook Islands",
                    "ck",
                    "682"
                ],
                [
                    "Costa Rica",
                    "cr",
                    "506"
                ],
                [
                    "Côte d’Ivoire",
                    "ci",
                    "225"
                ],
                [
                    "Croatia (Hrvatska)",
                    "hr",
                    "385"
                ],
                [
                    "Cuba",
                    "cu",
                    "53"
                ],
                [
                    "Curaçao",
                    "cw",
                    "599",
                    0
                ],
                [
                    "Cyprus (Κύπρος)",
                    "cy",
                    "357"
                ],
                [
                    "Czech Republic (Česká republika)",
                    "cz",
                    "420"
                ],
                [
                    "Denmark (Danmark)",
                    "dk",
                    "45"
                ],
                [
                    "Djibouti",
                    "dj",
                    "253"
                ],
                [
                    "Dominica",
                    "dm",
                    "1767"
                ],
                [
                    "Dominican Republic (República Dominicana)",
                    "do",
                    "1",
                    2,
                    ["809", "829", "849"]
                ],
                [
                    "Ecuador",
                    "ec",
                    "593"
                ],
                [
                    "Egypt (‫مصر‬‎)",
                    "eg",
                    "20"
                ],
                [
                    "El Salvador",
                    "sv",
                    "503"
                ],
                [
                    "Equatorial Guinea (Guinea Ecuatorial)",
                    "gq",
                    "240"
                ],
                [
                    "Eritrea",
                    "er",
                    "291"
                ],
                [
                    "Estonia (Eesti)",
                    "ee",
                    "372"
                ],
                [
                    "Ethiopia",
                    "et",
                    "251"
                ],
                [
                    "Falkland Islands (Islas Malvinas)",
                    "fk",
                    "500"
                ],
                [
                    "Faroe Islands (Føroyar)",
                    "fo",
                    "298"
                ],
                [
                    "Fiji",
                    "fj",
                    "679"
                ],
                [
                    "Finland (Suomi)",
                    "fi",
                    "358"
                ],
                [
                    "France",
                    "fr",
                    "33"
                ],
                [
                    "French Guiana (Guyane française)",
                    "gf",
                    "594"
                ],
                [
                    "French Polynesia (Polynésie française)",
                    "pf",
                    "689"
                ],
                [
                    "Gabon",
                    "ga",
                    "241"
                ],
                [
                    "Gambia",
                    "gm",
                    "220"
                ],
                [
                    "Georgia (საქართველო)",
                    "ge",
                    "995"
                ],
                [
                    "Germany (Deutschland)",
                    "de",
                    "49"
                ],
                [
                    "Ghana (Gaana)",
                    "gh",
                    "233"
                ],
                [
                    "Gibraltar",
                    "gi",
                    "350"
                ],
                [
                    "Greece (Ελλάδα)",
                    "gr",
                    "30"
                ],
                [
                    "Greenland (Kalaallit Nunaat)",
                    "gl",
                    "299"
                ],
                [
                    "Grenada",
                    "gd",
                    "1473"
                ],
                [
                    "Guadeloupe",
                    "gp",
                    "590",
                    0
                ],
                [
                    "Guam",
                    "gu",
                    "1671"
                ],
                [
                    "Guatemala",
                    "gt",
                    "502"
                ],
                [
                    "Guinea (Guinée)",
                    "gn",
                    "224"
                ],
                [
                    "Guinea-Bissau (Guiné Bissau)",
                    "gw",
                    "245"
                ],
                [
                    "Guyana",
                    "gy",
                    "592"
                ],
                [
                    "Haiti",
                    "ht",
                    "509"
                ],
                [
                    "Honduras",
                    "hn",
                    "504"
                ],
                [
                    "Hong Kong (香港)",
                    "hk",
                    "852"
                ],
                [
                    "Hungary (Magyarország)",
                    "hu",
                    "36"
                ],
                [
                    "Iceland (Ísland)",
                    "is",
                    "354"
                ],
                [
                    "India (भारत)",
                    "in",
                    "91"
                ],
                [
                    "Indonesia",
                    "id",
                    "62"
                ],
                [
                    "Iran (‫ایران‬‎)",
                    "ir",
                    "98"
                ],
                [
                    "Iraq (‫العراق‬‎)",
                    "iq",
                    "964"
                ],
                [
                    "Ireland",
                    "ie",
                    "353"
                ],
                [
                    "Israel (‫ישראל‬‎)",
                    "il",
                    "972"
                ],
                [
                    "Italy (Italia)",
                    "it",
                    "39",
                    0
                ],
                [
                    "Jamaica",
                    "jm",
                    "1876"
                ],
                [
                    "Japan (日本)",
                    "jp",
                    "81"
                ],
                [
                    "Jordan (‫الأردن‬‎)",
                    "jo",
                    "962"
                ],
                [
                    "Kazakhstan (Казахстан)",
                    "kz",
                    "7",
                    1
                ],
                [
                    "Kenya",
                    "ke",
                    "254"
                ],
                [
                    "Kiribati",
                    "ki",
                    "686"
                ],
                [
                    "Kuwait (‫الكويت‬‎)",
                    "kw",
                    "965"
                ],
                [
                    "Kyrgyzstan (Кыргызстан)",
                    "kg",
                    "996"
                ],
                [
                    "Laos (ລາວ)",
                    "la",
                    "856"
                ],
                [
                    "Latvia (Latvija)",
                    "lv",
                    "371"
                ],
                [
                    "Lebanon (‫لبنان‬‎)",
                    "lb",
                    "961"
                ],
                [
                    "Lesotho",
                    "ls",
                    "266"
                ],
                [
                    "Liberia",
                    "lr",
                    "231"
                ],
                [
                    "Libya (‫ليبيا‬‎)",
                    "ly",
                    "218"
                ],
                [
                    "Liechtenstein",
                    "li",
                    "423"
                ],
                [
                    "Lithuania (Lietuva)",
                    "lt",
                    "370"
                ],
                [
                    "Luxembourg",
                    "lu",
                    "352"
                ],
                [
                    "Macau (澳門)",
                    "mo",
                    "853"
                ],
                [
                    "Macedonia (FYROM) (Македонија)",
                    "mk",
                    "389"
                ],
                [
                    "Madagascar (Madagasikara)",
                    "mg",
                    "261"
                ],
                [
                    "Malawi",
                    "mw",
                    "265"
                ],
                [
                    "Malaysia",
                    "my",
                    "60"
                ],
                [
                    "Maldives",
                    "mv",
                    "960"
                ],
                [
                    "Mali",
                    "ml",
                    "223"
                ],
                [
                    "Malta",
                    "mt",
                    "356"
                ],
                [
                    "Marshall Islands",
                    "mh",
                    "692"
                ],
                [
                    "Martinique",
                    "mq",
                    "596"
                ],
                [
                    "Mauritania (‫موريتانيا‬‎)",
                    "mr",
                    "222"
                ],
                [
                    "Mauritius (Moris)",
                    "mu",
                    "230"
                ],
                [
                    "Mexico (México)",
                    "mx",
                    "52"
                ],
                [
                    "Micronesia",
                    "fm",
                    "691"
                ],
                [
                    "Moldova (Republica Moldova)",
                    "md",
                    "373"
                ],
                [
                    "Monaco",
                    "mc",
                    "377"
                ],
                [
                    "Mongolia (Монгол)",
                    "mn",
                    "976"
                ],
                [
                    "Montenegro (Crna Gora)",
                    "me",
                    "382"
                ],
                [
                    "Montserrat",
                    "ms",
                    "1664"
                ],
                [
                    "Morocco (‫المغرب‬‎)",
                    "ma",
                    "212"
                ],
                [
                    "Mozambique (Moçambique)",
                    "mz",
                    "258"
                ],
                [
                    "Myanmar (Burma) (မြန်မာ)",
                    "mm",
                    "95"
                ],
                [
                    "Namibia (Namibië)",
                    "na",
                    "264"
                ],
                [
                    "Nauru",
                    "nr",
                    "674"
                ],
                [
                    "Nepal (नेपाल)",
                    "np",
                    "977"
                ],
                [
                    "Netherlands (Nederland)",
                    "nl",
                    "31"
                ],
                [
                    "New Caledonia (Nouvelle-Calédonie)",
                    "nc",
                    "687"
                ],
                [
                    "New Zealand",
                    "nz",
                    "64"
                ],
                [
                    "Nicaragua",
                    "ni",
                    "505"
                ],
                [
                    "Niger (Nijar)",
                    "ne",
                    "227"
                ],
                [
                    "Nigeria",
                    "ng",
                    "234"
                ],
                [
                    "Niue",
                    "nu",
                    "683"
                ],
                [
                    "Norfolk Island",
                    "nf",
                    "672"
                ],
                [
                    "North Korea (조선 민주주의 인민 공화국)",
                    "kp",
                    "850"
                ],
                [
                    "Northern Mariana Islands",
                    "mp",
                    "1670"
                ],
                [
                    "Norway (Norge)",
                    "no",
                    "47"
                ],
                [
                    "Oman (‫عُمان‬‎)",
                    "om",
                    "968"
                ],
                [
                    "Pakistan (‫پاکستان‬‎)",
                    "pk",
                    "92"
                ],
                [
                    "Palau",
                    "pw",
                    "680"
                ],
                [
                    "Palestine (‫فلسطين‬‎)",
                    "ps",
                    "970"
                ],
                [
                    "Panama (Panamá)",
                    "pa",
                    "507"
                ],
                [
                    "Papua New Guinea",
                    "pg",
                    "675"
                ],
                [
                    "Paraguay",
                    "py",
                    "595"
                ],
                [
                    "Peru (Perú)",
                    "pe",
                    "51"
                ],
                [
                    "Philippines",
                    "ph",
                    "63"
                ],
                [
                    "Poland (Polska)",
                    "pl",
                    "48"
                ],
                [
                    "Portugal",
                    "pt",
                    "351"
                ],
                [
                    "Puerto Rico",
                    "pr",
                    "1",
                    3,
                    ["787", "939"]
                ],
                [
                    "Qatar (‫قطر‬‎)",
                    "qa",
                    "974"
                ],
                [
                    "Réunion (La Réunion)",
                    "re",
                    "262"
                ],
                [
                    "Romania (România)",
                    "ro",
                    "40"
                ],
                [
                    "Russia (Россия)",
                    "ru",
                    "7",
                    0
                ],
                [
                    "Rwanda",
                    "rw",
                    "250"
                ],
                [
                    "Saint Barthélemy (Saint-Barthélemy)",
                    "bl",
                    "590",
                    1
                ],
                [
                    "Saint Helena",
                    "sh",
                    "290"
                ],
                [
                    "Saint Kitts and Nevis",
                    "kn",
                    "1869"
                ],
                [
                    "Saint Lucia",
                    "lc",
                    "1758"
                ],
                [
                    "Saint Martin (Saint-Martin (partie française))",
                    "mf",
                    "590",
                    2
                ],
                [
                    "Saint Pierre and Miquelon (Saint-Pierre-et-Miquelon)",
                    "pm",
                    "508"
                ],
                [
                    "Saint Vincent and the Grenadines",
                    "vc",
                    "1784"
                ],
                [
                    "Samoa",
                    "ws",
                    "685"
                ],
                [
                    "San Marino",
                    "sm",
                    "378"
                ],
                [
                    "São Tomé and Príncipe (São Tomé e Príncipe)",
                    "st",
                    "239"
                ],
                [
                    "Saudi Arabia (‫المملكة العربية السعودية‬‎)",
                    "sa",
                    "966"
                ],
                [
                    "Senegal (Sénégal)",
                    "sn",
                    "221"
                ],
                [
                    "Serbia (Србија)",
                    "rs",
                    "381"
                ],
                [
                    "Seychelles",
                    "sc",
                    "248"
                ],
                [
                    "Sierra Leone",
                    "sl",
                    "232"
                ],
                [
                    "Singapore",
                    "sg",
                    "65"
                ],
                [
                    "Sint Maarten",
                    "sx",
                    "1721"
                ],
                [
                    "Slovakia (Slovensko)",
                    "sk",
                    "421"
                ],
                [
                    "Slovenia (Slovenija)",
                    "si",
                    "386"
                ],
                [
                    "Solomon Islands",
                    "sb",
                    "677"
                ],
                [
                    "Somalia (Soomaaliya)",
                    "so",
                    "252"
                ],
                [
                    "South Africa",
                    "za",
                    "27"
                ],
                [
                    "South Korea (대한민국)",
                    "kr",
                    "82"
                ],
                [
                    "South Sudan (‫جنوب السودان‬‎)",
                    "ss",
                    "211"
                ],
                [
                    "Spain (España)",
                    "es",
                    "34"
                ],
                [
                    "Sri Lanka (ශ්‍රී ලංකාව)",
                    "lk",
                    "94"
                ],
                [
                    "Sudan (‫السودان‬‎)",
                    "sd",
                    "249"
                ],
                [
                    "Suriname",
                    "sr",
                    "597"
                ],
                [
                    "Swaziland",
                    "sz",
                    "268"
                ],
                [
                    "Sweden (Sverige)",
                    "se",
                    "46"
                ],
                [
                    "Switzerland (Schweiz)",
                    "ch",
                    "41"
                ],
                [
                    "Syria (‫سوريا‬‎)",
                    "sy",
                    "963"
                ],
                [
                    "Taiwan (台灣)",
                    "tw",
                    "886"
                ],
                [
                    "Tajikistan",
                    "tj",
                    "992"
                ],
                [
                    "Tanzania",
                    "tz",
                    "255"
                ],
                [
                    "Thailand (ไทย)",
                    "th",
                    "66"
                ],
                [
                    "Timor-Leste",
                    "tl",
                    "670"
                ],
                [
                    "Togo",
                    "tg",
                    "228"
                ],
                [
                    "Tokelau",
                    "tk",
                    "690"
                ],
                [
                    "Tonga",
                    "to",
                    "676"
                ],
                [
                    "Trinidad and Tobago",
                    "tt",
                    "1868"
                ],
                [
                    "Tunisia (‫تونس‬‎)",
                    "tn",
                    "216"
                ],
                [
                    "Turkey (Türkiye)",
                    "tr",
                    "90"
                ],
                [
                    "Turkmenistan",
                    "tm",
                    "993"
                ],
                [
                    "Turks and Caicos Islands",
                    "tc",
                    "1649"
                ],
                [
                    "Tuvalu",
                    "tv",
                    "688"
                ],
                [
                    "U.S. Virgin Islands",
                    "vi",
                    "1340"
                ],
                [
                    "Uganda",
                    "ug",
                    "256"
                ],
                [
                    "Ukraine (Україна)",
                    "ua",
                    "380"
                ],
                [
                    "United Arab Emirates (‫الإمارات العربية المتحدة‬‎)",
                    "ae",
                    "971"
                ],
                [
                    "United Kingdom",
                    "gb",
                    "44"
                ],
                [
                    "United States",
                    "us",
                    "1",
                    0
                ],
                [
                    "Uruguay",
                    "uy",
                    "598"
                ],
                [
                    "Uzbekistan (Oʻzbekiston)",
                    "uz",
                    "998"
                ],
                [
                    "Vanuatu",
                    "vu",
                    "678"
                ],
                [
                    "Vatican City (Città del Vaticano)",
                    "va",
                    "39",
                    1
                ],
                [
                    "Venezuela",
                    "ve",
                    "58"
                ],
                [
                    "Vietnam (Việt Nam)",
                    "vn",
                    "84"
                ],
                [
                    "Wallis and Futuna",
                    "wf",
                    "681"
                ],
                [
                    "Yemen (‫اليمن‬‎)",
                    "ye",
                    "967"
                ],
                [
                    "Zambia",
                    "zm",
                    "260"
                ],
                [
                    "Zimbabwe",
                    "zw",
                    "263"
                ]
            ];

    };

    Phone.prototype.getDefaults = function () {
        return Phone.DEFAULTS
    };

    // PHONE PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('origam.phone');
            var options = typeof option == 'object' && option;

            if (!data) $this.data('origam.phone', (data = new Phone(this, options)));
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.phone;

    $.fn.phone             = Plugin;
    $.fn.phone.Constructor = Phone;


    // PHONE NO CONFLICT
    // ===================

    $.fn.input.noConflict = function () {
        $.fn.phone = old;
        return this
    }

    $(document).ready(function() {
        $('[data-form="phone"]').phone();
    });

})(jQuery, window);
/**
 * Apply origamPopover
 */

(function ($, w) {
    'use strict';

    // POPOVER PUBLIC CLASS DEFINITION
    // ===============================

    var Popover = function (element, options) {
        this.init('popover', element, options)
    }

    if (!$.fn.tooltip) throw new Error('Popover requires tooltip-main.js')

    Popover.VERSION  = '0.1.0'

    Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
        placement: 'right',
        trigger: 'click',
        content: '',
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    })


    // NOTE: POPOVER EXTENDS tooltip.js
    // ================================

    Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

    Popover.prototype.constructor = Popover

    Popover.prototype.getDefaults = function () {
        return Popover.DEFAULTS
    }

    Popover.prototype.setContent = function () {
        var $tip    = this.tip()
        var title   = this.getTitle()
        var content = this.getContent()

        $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
        $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
            this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
            ](content)

        $tip.removeClass('fade top bottom left right in')

        // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
        // this manually by checking the contents.
        if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
    }

    Popover.prototype.hasContent = function () {
        return this.getTitle() || this.getContent()
    }

    Popover.prototype.getContent = function () {
        var $e = this.$element
        var o  = this.options

        return $e.attr('data-content')
            || (typeof o.content == 'function' ?
                o.content.call($e[0]) :
                o.content)
    }

    Popover.prototype.arrow = function () {
        return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
    }


    // POPOVER PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('origam.popover')
            var options = typeof option == 'object' && option

            if (!data && /destroy|hide/.test(option)) return
            if (!data) $this.data('origam.popover', (data = new Popover(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.popover

    $.fn.popover             = Plugin
    $.fn.popover.Constructor = Popover


    // POPOVER NO CONFLICT
    // ===================

    $.fn.popover.noConflict = function () {
        $.fn.popover = old
        return this
    }

    $(document).ready(function() {
        $('[data-app="popover"]').popover();
        $('body').on('click', function (e) {
            $('[data-app="popover"]').each(function () {
                //The 'is' for buttons that trigger popups
                //The 'has' for icons within a button that triggers a popup
                if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                    $(this).popover('hide');
                    $(this).next().css({display: 'none'});
                }
            });
        });
    });

})(jQuery, window);
/**
 * Apply origamRangePicker
 */

(function ($, w) {

    'use strict';

    // RANGE PUBLIC CLASS DEFINITION
    // ===============================

    var Range = function (element, options) {
        this.type       = null;
        this.options    = null;
        this.$element   = null;

        this.init('range', element, options)
    };

    if (!$.fn.input) throw new Error('Range requires input.js');

    Range.VERSION  = '0.1.0';

    Range.TRANSITION_DURATION = 1000;

    Range.DEFAULTS = $.extend({}, $.fn.input.Constructor.DEFAULTS, {
        templateHue: '<div class="range-hue"></div>',
        templateHueSelector: '<div class="range-hue--arrs"></div>',
        templateHueSelectorLeft: '<div class="range-hue--larr"></div>',
        templateHueSelectorRight: '<div class="range-hue--rarr"></div>',
        type: "single",
        circle: false,
        editable: true
    });

    Range.prototype = $.extend({}, $.fn.input.Constructor.prototype);

    Range.prototype.constructor = Range;

    Range.prototype.event = function (options) {

    };

    // RANGE PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('origam.range');
            var options = typeof option == 'object' && option;

            if (!data) $this.data('origam.range', (data = new Range(this, options)));
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.range;

    $.fn.range             = Plugin;
    $.fn.range.Constructor = Range;


    // RANGE NO CONFLICT
    // ===================

    $.fn.input.noConflict = function () {
        $.fn.range = old;
        return this
    };

    $(document).ready(function() {
        $('[data-form="range"]').range();
        $('[type="range"]').range();
    });

})(jQuery, window);
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
                    element.append($('<div/>').addClass(classes.detailInnerRow).append($('<div/>').addClass(classes.detailInnerName)
                        .append(groups[group].data[j].name + separator)).append($('<div/>').addClass(classes.detailInnerValue)
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
            sortable = [],
            active = false;

        this.$element.removeClass(this.classes.active);
        $('th', this.$element).not('[data-priority="' + this.options.priorityMin + '"]').attr('data-hide', 'true');
        $('td, th', this.$element).not('.' + this.classes.toggle).css('display', 'table-cell');

        for (var col in colSort)
            sortable.push([col, colSort[col]])
        sortable.sort(function(a, b) {return a[1].priority - b[1].priority});

        for (var curCol in sortable){
            var colIndex = sortable[curCol][1].index;
            var curColWidth = this.columnsData[colIndex].width;
            if(affWidth + curColWidth < maxWidth && maxWidth > this.columnsData[this.options.priorityMin].width ) {
                var curPriority = this.columnsData[colIndex].priority;
                this.$element.find('[data-priority="' + curPriority + '"]').removeAttr('data-hide');
                this.columnsData[colIndex].hide = false;
            } else {
                this.columnsData[colIndex].hide = true;
                active = true;
            }
            affWidth += curColWidth;
        }

        if(active){
            this.$element.addClass(this.classes.active);
        }
    };

    ResponsiveTable.prototype.setColumn = function () {
        var that = this;

        this.bindToggleSelector();

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

        this.$element
            .find('> tbody > tr:not(.' + this.classes.detail + ')').data('detail_created', false).end()
            .find('> thead > tr:last-child > th:not(.' + this.classes.toggle + ')')
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
            .find('> tbody > tr.' + this.classes.detailShow).each(function () {
                that.setOrUpdateDetailRow(this);
            });

        this.$element.find('> tbody > tr.' + that.classes.detailShow + ':visible').each(function () {
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

        this.$element.find(this.options.toggleSelector).unbind('toggleRow.origam.'+ this.type).bind('toggleRow.origam.'+ this.type, function (e) {
            var $row = $(this).is('tr') ? $(this) : $(this).parents('tr:first');
            that.toggleDetail($row);
        });

        this.$element.find(this.options.toggleSelector).unbind('click.origam.'+ this.type).bind('click.origam.'+ this.type, function (e) {
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

        if(this.options.animate) {
            $next.find('.' + this.classes.detailInnerRow).each( function(){
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

        $.support.transition && this.options.animate ?
            $next
                .one('origamTransitionEnd', onShow)
                .emulateTransitionEnd(ResponsiveTable.TRANSITION_DURATION) :
            onShow();

        return false;

    };

    ResponsiveTable.prototype.eventHide = function ($next) {

        var that = this;

        $next.trigger($.Event('close.origam.' + this.type));

        if(this.options.animate) {
            $next.find('.' + this.classes.detailInnerRow).each( function() {
                $(this).addClass(that.options.animationOut);
                $(this).addClass('animated');
            });
            var animateClass = this.options.animationOut + ' animated';
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

        $.support.transition && this.options.animate ?
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
/**
 * Apply origamRipple
 */

(function ($, w) {
    'use strict';

    // RIPPLE CLASS DEFINITION
    // ======================

    var Ripple   = function (element, options) {
        this.type       = null;
        this.options    = null;
        this.$element   = null;

        this.init('ripple', element, options)
    };

    Ripple.VERSION = '0.1.0';

    Ripple.TRANSITION_DURATION = 651;

    Ripple.prototype.init = function (type, element, options) {
        this.type       = type;
        this.$element   = $(element);

        this.$element.on('mousedown', $.proxy(this.show, this));

    };

    Ripple.prototype.show = function (e) {
        this.$element.css({
            position: 'relative',
            overflow: 'hidden'
        });

        var ripple;

        if (this.$element.find('.ripple').length === 0) {

            ripple = $('<span/>').addClass('ripple');

            if (this.$element.attr('data-ripple'))
            {
                ripple.addClass('ripple-' + this.$element.attr('data-ripple'));
            }

            this.$element.prepend(ripple);
        }
        else
        {
            ripple = this.$element.find('.ripple');
        }

        ripple.removeClass('animated');

        if (!ripple.height() && !ripple.width())
        {
            var diameter = Math.max(this.$element.outerWidth(), this.$element.outerHeight());

            ripple.css({ height: diameter, width: diameter });
        }

        var x = e.pageX - this.$element.offset().left - ripple.width() / 2;
        var y = e.pageY - this.$element.offset().top - ripple.height() / 2;

        ripple.css({ top: y+'px', left: x+'px' }).addClass('animated');

        function removeElement() {
            ripple.removeClass('animated');
        }

        $.support.transition ?
            this.$element
                .one('origamTransitionEnd', removeElement)
                .emulateTransitionEnd(Ripple.TRANSITION_DURATION) :
            removeElement()
    };


    // RIPPLE PLUGIN DEFINITION
    // =======================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data  = $this.data('origam.ripple');

            if (!data) $this.data('origam.ripple', (data = new Ripple(this)));
            if (typeof option == 'string') data[option].call($this)
        })
    }

    var old = $.fn.ripple;

    $.fn.ripple             = Plugin;
    $.fn.ripple.Constructor = Ripple;


    // RIPPLE NO CONFLICT
    // =================

    $.fn.ripple.noConflict = function () {
        $.fn.ripple = old
        return this
    };


    // RIPPLE DATA-API
    // ==============

    $(document).ready(function() {
        $('[data-button="ripple"]').ripple();
    });

})(jQuery, window);


/**
 * Apply origamScrollbar
 */


/**
 * Apply origamSlider
 */


/**
 * Apply origamSocialFeed
 */
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
/**
 * Apply origamTabs
 */


/**
 * Apply origamTextarea
 */

(function ($, w) {

    'use strict';

    // TEXTAREA PUBLIC CLASS DEFINITION
    // ===============================

    var Textarea = function (element, options) {
        this.type       = null;
        this.options    = null;
        this.$element   = null;

        this.init('textarea', element, options)
    };

    if (!$.fn.input) throw new Error('Textarea requires input.js');

    Textarea.VERSION  = '0.1.0';

    Textarea.TRANSITION_DURATION = 1000;

    Textarea.DEFAULTS = $.extend({}, $.fn.input.Constructor.DEFAULTS, {
        baseHeight: '24'
    });

    Textarea.prototype = $.extend({}, $.fn.input.Constructor.prototype);

    Textarea.prototype.constructor = Textarea;

    Textarea.prototype.event = function (options) {

        var offset = this.offset();

        this.$element.on('keyup input', function() {
            var $this = $(this);
            var baseHeight = options.baseHeight + 'px';
            $this.css('height', baseHeight);
            $this.css('height', this.scrollHeight + offset);
        });
    };

    Textarea.prototype.getDefaults = function () {
        return Textarea.DEFAULTS
    };

    Textarea.prototype.offset = function() {
        var offset = this.element.offsetHeight - this.element.clientHeight;

        return offset;
    };

    // TEXTAREA PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('origam.textarea');
            var options = typeof option == 'object' && option;

            if (!data) $this.data('origam.textarea', (data = new Textarea(this, options)));
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.textarea;

    $.fn.textarea             = Plugin;
    $.fn.textarea.Constructor = Textarea;


    // TEXTAREA NO CONFLICT
    // ===================

    $.fn.input.noConflict = function () {
        $.fn.textarea = old;
        return this
    }

    $(document).ready(function() {
        $('[data-form="textarea"]').textarea();
    });

})(jQuery, window);
/**
 * Apply origamTransition
 */

(function ($, w) {
    'use strict';

    // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
    // ============================================================

    function transitionEnd() {
        var el = document.createElement('origam');

        var transEndEventNames = {
            WebkitTransition : 'webkitTransitionEnd',
            MozTransition    : 'transitionend',
            OTransition      : 'oTransitionEnd otransitionend',
            transition       : 'transitionend'
        };

        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return { end: transEndEventNames[name] }
            }
        }

        return false;
    }

    // http://blog.alexmaccaw.com/css-transitions
    $.fn.emulateTransitionEnd = function (duration) {
        var called = false;
        var $el = this;
        $(this).one('origamTransitionEnd', function () { called = true });
        var callback = function () { if (!called) $($el).trigger($.support.transition.end) };
        setTimeout(callback, duration);
        return this
    };

    $(function () {
        $.support.transition = transitionEnd();

        if (!$.support.transition) return;

        $.event.special.origamTransitionEnd = {
            bindType: $.support.transition.end,
            delegateType: $.support.transition.end,
            handle: function (e) {
                if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
            }
        }
    })

})(jQuery, window);


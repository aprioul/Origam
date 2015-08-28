
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

        this.browser = {
            chrome: /chrome/.test( userAgent ),
            safari: /webkit/.test( userAgent )&& !/chrome/.test( userAgent ),
            opera: /opera/.test( userAgent ),
            msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ),
            mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent )
        };

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

    Input.prototype.isInStateTrue = function () {
        for (var key in this.inState) {
            if (this.inState[key]) return true
        }

        return false
    };

    Input.prototype.toggle = function(e){
        var self = this;

        if(e){
            self.inState.click = !self.inState.click;
            if (self.isInStateTrue()) self.show(e);
            else self.hide(e);
        }
    };

    Input.prototype.mouseEnter = function() {
        return this.mouseOnContainer = true;
    };

    Input.prototype.mouseLeave = function() {
        return this.mouseOnContainer = false;
    };

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

    Input.prototype.event = function (options) {
        return null;
    };

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

    Input.prototype.valChange = function (e) {
        if($(e.currentTarget).val() != '' || e.currentTarget.value != ''){
            $(e.currentTarget)
                .closest(this.$parent)
                .addClass(this.classes.active);
        }
    };

    Input.prototype.startFocus = function (e) {
        $(e.currentTarget)
            .closest(this.$parent)
            .removeClass(this.options.classes.active)
            .addClass(this.options.classes.focus);
    };

    Input.prototype.endFocus = function (e) {
        $(e.currentTarget)
            .closest(this.$parent)
            .removeClass(this.options.classes.focus);
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

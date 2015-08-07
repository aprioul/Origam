
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
        definitions: {
            "9": "[0-9]",
            a: "[A-Za-z]",
            "*": "[A-Za-z0-9]",
            "~": "[+-]"
        },
        mask: "9999 9999 9999 9999"
    };

    Input.prototype.init = function (type, element, options) {
        this.type      = type;
        this.element   = element;
        this.$element  = $(element);
        this.options   = this.getOptions(options);
        this.$parent   = '.' + this.options.parentNode;

        this.$element
            .parents(this.$parent)
            .addClass(this.options.parentClass);

        this.event(this.options);
        this.mask(this.options);

        if(this.options.placeholder){
            this.placeholder(this.options.placeholder);
        }

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

    Input.prototype.event = function (options) {
        return null;
    };

    Input.prototype.mask = function (options) {
        var placeholder;

        this.addPlaceholder(placeholder);
    };

    Input.prototype.addPlaceholder = function (placeholder){

    };

    Input.prototype.addAddon = function(element) {
        if(typeof element === 'undefined'){
            element = this.$element;
        }

        var classPosition = '';
        classPosition = (this.options.placement === 'after') ? this.options.classes.addonsRight : this.options.classes.addonsLeft;

        element.parents(this.$parent).addClass(classPosition);

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

    Input.prototype.valChange = function (e) {
        if($(e.currentTarget).val() != ''){
            $(e.currentTarget)
                .parents(this.$parent)
                .addClass(this.options.classes.active);
        }
    };

    Input.prototype.startFocus = function (e) {
        $(e.currentTarget)
            .parents(this.$parent)
            .removeClass(this.options.classes.active);
        $(e.currentTarget)
            .parents(this.$parent)
            .addClass(this.options.classes.focus);
    };

    Input.prototype.endFocus = function (e) {
        $(e.currentTarget)
            .parents(this.$parent)
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

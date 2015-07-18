
/**
 * Apply origamInput
 *
*/

(function ($, w) {

    'use strict';

    // TOOLTIP PUBLIC CLASS DEFINITION
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

        if($(e.currentTarget).val() != ''){
            $(e.currentTarget)
                .parents(this.$parent)
                .addClass(this.options.classes.active);
        }

        this.event(this.options);
        this.mask(this.options);

        this.$element.on('focusin', $.proxy(this.startFocus, this));
        this.$element.on('focusout', $.proxy(this.endFocus, this));
    };

    Input.prototype.getDefaults = function () {
        return Input.DEFAULTS
    };

    Input.prototype.getOptions = function (options) {
        options = $.extend({}, this.getDefaults(), this.$element.data(), options);

        return options
    };

    Input.prototype.event = function (options) {
        return null;
    };

    Input.prototype.mask = function (options) {
        this.addplaceholder(this.options);
    };

    Input.prototype.addPlaceholder = function (options){

    };

    Input.prototype.addAddon = function() {
        var classPosition = '';
        classPosition = (this.options.placement === 'after') ? this.options.classes.addonsRight : this.options.classes.addonsLeft;

        this.$element.parents(this.$parent).addClass(classPosition);

        var wrapper = this.options.addon;

        if(this.options.placement === 'after') {
            this.$element.after(wrapper);
            return (this.$element.next());
        }
        else{
            this.$element.before(wrapper);
            return (this.$element.prev());
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

    // TOOLTIP PLUGIN DEFINITION
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


    // TOOLTIP NO CONFLICT
    // ===================

    $.fn.input.noConflict = function () {
        $.fn.input = old;
        return this
    };

    $(document).ready(function() {
        $('[data-form="input"]').input();
    });

})(jQuery, window);

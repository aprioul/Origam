
/**
 * Apply origamInput on input elements (in a jQuery object) eq. $('input[type=text]'),
 * parent element will have focus class and active class
 * You can call origamInput on textarea to have autoresise, your element will
 * have height equal to text.
 * @param  {obj} options :
 *     - placeholder : define placeholder for input/textarea
 *     - classes : You can change default classes of element
 *          - focus : define focus class
 *          - active : define active class
 *     - parentNode : You can define parent
 *     - baseHeight : You define here your textarea height (at start)
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
        addon: '<div class="text-field--group__addons"></div>'
    };

    Input.prototype.init = function (type, element, options) {
        this.type      = type;
        this.element   = element;
        this.$element  = $(element);
        this.options   = this.getOptions(options);
        this.$parent   = '.' + this.options.parentNode;

        var event = this.event(this.options);

        var eventIn  =  'focusin';
        var eventOut =  'focusout';

        this.$element.on(eventIn, $.proxy(this.startFocus, this));
        this.$element.on(eventOut, $.proxy(this.endFocus, this));
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

    Input.prototype.addAddon = function() {
        var classPosition = '';
        this.options.placement === 'after' ? classPosition = this.options.classes.addonsRight : this.options.classes.addonsLeft;

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

    Input.prototype.startFocus = function () {
        this.$element
            .parents(this.$parent)
            .removeClass(this.options.classes.active);
        this.$element
            .parents(this.$parent)
            .addClass(this.options.classes.focus);
    };

    Input.prototype.endFocus = function () {
        this.$element
            .parents(this.$parent)
            .removeClass(this.options.classes.focus);
        if(this.$element.val() != ''){
            this.$element
                .parents(this.$parent)
                .addClass(this.options.classes.active);
        }
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
    }

    $(document).ready(function() {
        $('[data-form="input"]').input();
    });

})(jQuery, window);
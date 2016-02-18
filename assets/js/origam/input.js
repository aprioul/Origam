
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

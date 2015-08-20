
/**
 * Apply origamDatePicker
 */

(function ($, w) {

    'use strict';

    // DATE PUBLIC CLASS DEFINITION
    // ===============================

    var Date = function (element, options) {
        this.type       = null;
        this.options    = null;
        this.$element   = null;

        this.init('date', element, options)
    };

    if (!$.fn.input) throw new Error('Datepicker requires input.js');

    Date.VERSION  = '0.1.0';

    Date.TRANSITION_DURATION = 1000;

    Date.DEFAULTS = $.extend({}, $.fn.input.Constructor.DEFAULTS, {
        templateWrapper: '<div class="origam-datepick"></div>',
        templateView: '<div class="origam-datepick--view"></div>',
        templateCalendar: '<div class="origam-datepick--calendar"></div>',
        templateSubmit: '<div class="origam-datepick--submit btn btn-ghost"></div>',
        templateOverlay: '<div class="origam-overlay"></div>',
        submitText: 'OK',
        type: 'date'
    });

    Date.prototype = $.extend({}, $.fn.input.Constructor.prototype);

    Date.prototype.constructor = Date;

    Date.prototype.event = function (options) {
        this.options            = this.getOptions(options);
        this.id                 = this.getUID(8);
        this.element            = this;
        this.field              = new Array();
        this.options.type       = this.$element.attr('type') ? this.$element.attr('type') : this.options.type;

        this.$overlay = $(this.options.templateOverlay);
        this.$element.data('origam-'+ this.options.type +'pickId', this.id);

        this.$datepick = $(this.options.templateWrapper)
            .attr('id', this.id)
            .addClass('origam-datepick--' + this.options.type);

        this.$submitField = $(this.options.templateSubmit).attr('data-target', '#' + this.id);

        this.$view = $(this.options.templateView);
        this.$calendar = $(this.options.templateCalendar);

        this.$element
            .parents(this.$parent)
            .on('click', $.proxy(this.show, this));
    };

    Date.prototype.getDefaults = function () {
        return Date.DEFAULTS
    };

    Color.prototype.submit = function(e) {

    };

    Date.prototype.bindSelector = function () {
        var that = this;

        this.$colorpick.bind('mouseenter.origam.'+ this.type, function(e) {
            that.mouseEnter();
        });

        this.$colorpick.bind('mouseleave.origam.'+ this.type, function(e) {
            that.mouseLeave();
        });

        $(this.$colorpick[0].ownerDocument).bind('click.origam.'+ this.type, function (e) {
            that.action(e);
        });
    };

    Date.prototype.action = function(e){
        if (!this.mouseOnContainer && this.activate){
            this.hide();
        }
    };

    Date.prototype.show = function (e) {
        var that            = this,
            viewportHeight  = $(window).height(),
            viewportWidtht  = $(window).width();

        this.activate = true;
        this.$element.off('click', $.proxy(this.show, this));

        if(this.options.animate) {
            this.$datepick
                .attr('data-animate', 'true')
                .attr('data-animation', that.options.animationOut)
                .addClass(that.options.animationIn)
                .addClass('animated');
            var animateClass = this.options.animationIn + ' animated';
        }

        this.$submitField
            .text(this.options.submitText)
            .on("click", $.proxy(this.submit, this))
            .appendTo(this.$calendar);

        this.$overlay.appendTo(document.body);
        this.$datepick
            .appendTo(document.body)
            .css({
                'top':  (viewportHeight/2) - (this.$datepick.outerHeight()/2),
                'left': (viewportWidtht/2) - (this.$datepick.outerWidth()/2)
            });

        this.bindSelector();

        var onShow = function () {
            if (that.$datepick.hasClass(animateClass))
                that.$datepick.removeClass(animateClass);
            that.$datepick.trigger('show.origam.' + that.type);
        };

        $.support.transition && this.$datepick.hasClass(animateClass) ?
            this.$datepick
                .one('origamTransitionEnd', onShow)
                .emulateTransitionEnd(Date.TRANSITION_DURATION) :
            onShow();

        return false;

    };

    Date.prototype.hide = function (e) {
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
            that.$datepick
                .detach()
                .trigger('closed.origam.' + that.type)
                .remove();
        }

        $.support.transition && this.$datepick.hasClass(animateClass)?
            this.$datepick
                .one('origamTransitionEnd', removeElement)
                .emulateTransitionEnd(Date.TRANSITION_DURATION) :
            removeElement()

    };

    // DATE PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('origam.date');
            var options = typeof option == 'object' && option;

            if (!data) $this.data('origam.date', (data = new Date(this, options)));
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.date;

    $.fn.date             = Plugin;
    $.fn.date.Constructor = Date;


    // DATE NO CONFLICT
    // ===================

    $.fn.input.noConflict = function () {
        $.fn.date = old;
        return this
    };

    $(document).ready(function() {
        $('[data-form="date"]').date();
    });

})(jQuery, window);
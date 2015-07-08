
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
        position: 'top left',
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
        this.$main = $(this.options.mainTemplate);
        this.$close = $(this.options.closeTemplate);
        this.$icon = $(this.options.iconTemplate);
        this.$wrapper = $('<div id="notification-wrapper"></div>');

        if($('#notification-wrapper').length === 0)
            this.$wrapper.appendTo('body');

        this.$body = $('#notification-wrapper');
        this.$note
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

        this.$close.on('click', $.proxy(this.hide, this));

    };

    Notification.prototype.getDefaults = function () {
        return Notification.DEFAULTS
    };

    Notification.prototype.getOptions = function (options) {
        options = $.extend({}, this.getDefaults(), this.$element.data(), options);

        return options
    };

    Notification.prototype.show = function () {

        var that = this;
        var $note = that.$note;

        if(that.options.animate) {
            $note
                .attr('data-animate', 'true')
                .attr('data-animation', that.options.animationOut)
                .addClass(that.options.animationIn)
                .addClass('animated');
            var animateClass = that.options.animationIn + ' animated';
        }

        $note.appendTo(this.$body);

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


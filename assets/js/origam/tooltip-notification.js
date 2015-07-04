
/**
 * Apply origamTooltipNotification
 */

(function ($, w) {
    'use strict';

    // NOTIFICATION PUBLIC CLASS DEFINITION
    // ===============================

    var Notification = function (element, options) {
        this.init('notification', element, options)
    }

    if (!$.fn.tooltip) throw new Error('Notification requires tooltip.js')

    Notification.VERSION  = '0.1.0'

    Notification.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
        placement: 'right',
        trigger: 'click',
        content: '',
        template: '<div class="notification"><<h3 class="notification-title"></h3><div class="notification-content"></div><span class="notification-close" data-app="close"><i class="origamicon origamicon-close"</span></div>'
    })


    // NOTE: NOTIFICATION EXTENDS tooltip.js
    // ================================

    Notification.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

    Notification.prototype.constructor = Notification

    Notification.prototype.getDefaults = function () {
        return Notification.DEFAULTS
    }

    Notification.prototype.setContent = function () {
        var $tip    = this.tip()
        var title   = this.getTitle()
        var content = this.getContent()

        $tip.find('.notification-title')[this.options.html ? 'html' : 'text'](title)
        $tip.find('.notification-content').children().detach().end()[ // we use append for html objects to maintain js events
            this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
            ](content)

        $tip.removeClass('fade top bottom left right in')

        // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
        // this manually by checking the contents.
        if (!$tip.find('.notification-title').html()) $tip.find('.notification-title').hide()
    }

    Notification.prototype.hasContent = function () {
        return this.getTitle() || this.getContent()
    }

    Notification.prototype.getContent = function () {
        var $e = this.$element
        var o  = this.options

        return $e.attr('data-content')
            || (typeof o.content == 'function' ?
                o.content.call($e[0]) :
                o.content)
    }


    // NOTIFICATION PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('origam.notification')
            var options = typeof option == 'object' && option

            if (!data && /destroy|hide/.test(option)) return
            if (!data) $this.data('origam.notification', (data = new Notification(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.notification

    $.fn.notification             = Plugin
    $.fn.notification.Constructor = Notification


    // NOTIFICATION NO CONFLICT
    // ===================

    $.fn.notification.noConflict = function () {
        $.fn.notification = old
        return this
    }

})(jQuery, window);
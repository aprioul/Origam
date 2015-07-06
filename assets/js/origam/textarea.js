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

    if (!$.fn.input) throw new Error('Notification requires input.js');

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
    }

    // TEXTAREA PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('origam.textarea');
            var options = typeof option == 'object' && option;

            if (!data && /destroy|hide/.test(option)) return;
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
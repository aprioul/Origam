
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
        livePreview: true,
        parentClass : 'text-field--file',
        wrapperTemplate: '<div class="text-field--file_current"></div>',
        fileTemplate: '<div class="text-field--file_current__file"></div>',
        closeTemplate: '<div class="text-field--file_current__close" data-button="close"><i class="origamicon origamicon-close"></i></div>'
    });

    File.prototype = $.extend({}, $.fn.input.Constructor.prototype);

    File.prototype.constructor = File;

    File.prototype.event = function (options) {
        this.options        = this.getOptions(options);
        this.$container     = $(this.options.wrapperTemplate);
        this.$file          = $(this.options.fileTemplate);
        this.$close         = $(this.options.closeTemplate);

        this.options.placement = 'before';
        this.$wrapper = this.addAddon();

        this.$container
            .append(this.$file)
            .append(this.$close);
        this.$wrapper.append(this.$container);

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

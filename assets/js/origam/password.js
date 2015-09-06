
/**
 * Apply origamPassword
 *
 */

(function ($, w) {

    'use strict';

    // PASSWORD PUBLIC CLASS DEFINITION
    // ===============================

    var Password = function (element, options) {
        this.type       = null;
        this.options    = null;
        this.$element   = null;

        this.init('password', element, options)
    };

    if (!$.fn.input) throw new Error('Password requires input.js');

    Password.VERSION  = '0.1.0';

    Password.TRANSITION_DURATION = 1000;

    Password.DEFAULTS = $.extend({}, $.fn.input.Constructor.DEFAULTS, {
        min_point : 49,
        max_point : 120,
        charsets : [
            // Commonly Used
            ////////////////////
            [0x0020, 0x0020], // Space
            [0x0030, 0x0039], // Numbers
            [0x0041, 0x005A], // Uppercase
            [0x0061, 0x007A], // Lowercase
            [0x0021, 0x002F], // Punctuation
            [0x003A, 0x0040], // Punctuation
            [0x005B, 0x0060], // Punctuation
            [0x007B, 0x007E], // Punctuation
            // Everything Else
            ////////////////////
            [0x0080, 0x00FF], // Latin-1 Supplement
            [0x0100, 0x017F], // Latin Extended-A
            [0x0180, 0x024F], // Latin Extended-B
            [0x0250, 0x02AF], // IPA Extensions
            [0x02B0, 0x02FF], // Spacing Modifier Letters
            [0x0300, 0x036F], // Combining Diacritical Marks
            [0x0370, 0x03FF], // Greek
            [0x0400, 0x04FF], // Cyrillic
            [0x0530, 0x058F], // Armenian
            [0x0590, 0x05FF], // Hebrew
            [0x0600, 0x06FF], // Arabic
            [0x0700, 0x074F], // Syriac
            [0x0780, 0x07BF], // Thaana
            [0x0900, 0x097F], // Devanagari
            [0x0980, 0x09FF], // Bengali
            [0x0A00, 0x0A7F], // Gurmukhi
            [0x0A80, 0x0AFF], // Gujarati
            [0x0B00, 0x0B7F], // Oriya
            [0x0B80, 0x0BFF], // Tamil
            [0x0C00, 0x0C7F], // Telugu
            [0x0C80, 0x0CFF], // Kannada
            [0x0D00, 0x0D7F], // Malayalam
            [0x0D80, 0x0DFF], // Sinhala
            [0x0E00, 0x0E7F], // Thai
            [0x0E80, 0x0EFF], // Lao
            [0x0F00, 0x0FFF], // Tibetan
            [0x1000, 0x109F], // Myanmar
            [0x10A0, 0x10FF], // Georgian
            [0x1100, 0x11FF], // Hangul Jamo
            [0x1200, 0x137F], // Ethiopic
            [0x13A0, 0x13FF], // Cherokee
            [0x1400, 0x167F], // Unified Canadian Aboriginal Syllabics
            [0x1680, 0x169F], // Ogham
            [0x16A0, 0x16FF], // Runic
            [0x1780, 0x17FF], // Khmer
            [0x1800, 0x18AF], // Mongolian
            [0x1E00, 0x1EFF], // Latin Extended Additional
            [0x1F00, 0x1FFF], // Greek Extended
            [0x2000, 0x206F], // General Punctuation
            [0x2070, 0x209F], // Superscripts and Subscripts
            [0x20A0, 0x20CF], // Currency Symbols
            [0x20D0, 0x20FF], // Combining Marks for Symbols
            [0x2100, 0x214F], // Letterlike Symbols
            [0x2150, 0x218F], // Number Forms
            [0x2190, 0x21FF], // Arrows
            [0x2200, 0x22FF], // Mathematical Operators
            [0x2300, 0x23FF], // Miscellaneous Technical
            [0x2400, 0x243F], // Control Pictures
            [0x2440, 0x245F], // Optical Character Recognition
            [0x2460, 0x24FF], // Enclosed Alphanumerics
            [0x2500, 0x257F], // Box Drawing
            [0x2580, 0x259F], // Block Elements
            [0x25A0, 0x25FF], // Geometric Shapes
            [0x2600, 0x26FF], // Miscellaneous Symbols
            [0x2700, 0x27BF], // Dingbats
            [0x2800, 0x28FF], // Braille Patterns
            [0x2E80, 0x2EFF], // CJK Radicals Supplement
            [0x2F00, 0x2FDF], // Kangxi Radicals
            [0x2FF0, 0x2FFF], // Ideographic Description Characters
            [0x3000, 0x303F], // CJK Symbols and Punctuation
            [0x3040, 0x309F], // Hiragana
            [0x30A0, 0x30FF], // Katakana
            [0x3100, 0x312F], // Bopomofo
            [0x3130, 0x318F], // Hangul Compatibility Jamo
            [0x3190, 0x319F], // Kanbun
            [0x31A0, 0x31BF], // Bopomofo Extended
            [0x3200, 0x32FF], // Enclosed CJK Letters and Months
            [0x3300, 0x33FF], // CJK Compatibility
            [0x3400, 0x4DB5], // CJK Unified Ideographs Extension A
            [0x4E00, 0x9FFF], // CJK Unified Ideographs
            [0xA000, 0xA48F], // Yi Syllables
            [0xA490, 0xA4CF], // Yi Radicals
            [0xAC00, 0xD7A3], // Hangul Syllables
            [0xD800, 0xDB7F], // High Surrogates
            [0xDB80, 0xDBFF], // High Private Use Surrogates
            [0xDC00, 0xDFFF], // Low Surrogates
            [0xE000, 0xF8FF], // Private Use
            [0xF900, 0xFAFF], // CJK Compatibility Ideographs
            [0xFB00, 0xFB4F], // Alphabetic Presentation Forms
            [0xFB50, 0xFDFF], // Arabic Presentation Forms-A
            [0xFE20, 0xFE2F], // Combining Half Marks
            [0xFE30, 0xFE4F], // CJK Compatibility Forms
            [0xFE50, 0xFE6F], // Small Form Variants
            [0xFE70, 0xFEFE], // Arabic Presentation Forms-B
            [0xFEFF, 0xFEFF], // Specials
            [0xFF00, 0xFFEF], // Halfwidth and Fullwidth Forms
            [0xFFF0, 0xFFFD]  // Specials
        ],
        MinimumChars: 8,
        ScaleFactor: 1,
        templateShowhide: '<span class="text-field--group__switchpass origamicon origamicon-eye"></span>',
        templateStrenght: '<span class="text-field--progressbar text-field--progressbar__danger"></span>',
        show: 'origamicon-eye',
        hide: 'origamicon-eye-blocked',
        progress: 'text-field--progressbar',
        strong: 'text-field--progressbar__success',
        danger: 'text-field--progressbar__danger',
        showhide: true,
        strenght: true,
        password: 'text-field--password'
    });

    Password.prototype = $.extend({}, $.fn.input.Constructor.prototype);

    Password.prototype.constructor = Password;

    Password.prototype.event = function (options) {
        this.options = this.getOptions(options);

        if (this.options.showhide) {
            this.showhide();
        }
        if (this.options.strenght) {
            this.strenght();
        }
    };

    Password.prototype.getDefaults = function () {
        return Password.DEFAULTS
    };

    Password.prototype.showhide = function(){
        this.$wrapper = this.addAddon();

        this.$switch = this.options.templateShowhide;

        this.$wrapper.append(this.$switch);
        var $switch = this.$wrapper.children();

        $switch.on('click', $.proxy(this.toggle, this));

    };

    Password.prototype.show = function(e){
        this.$element
            .focus()
            .attr('type', 'text');
        this.$wrapper.children().removeClass(this.options.show).addClass(this.options.hide);
    };

    Password.prototype.hide = function(e){
        this.$element
            .focus()
            .attr('type', 'password');
        this.$wrapper.children().removeClass(this.options.hide).addClass(this.options.show);
    };

    Password.prototype.strenght = function(){
        this.$strenght = this.options.templateStrenght;
        this.charsets = this.options.charsets;

        this.$element.on('keyup focus input propertychange mouseup', $.proxy(this.calculate, this));
    };

    Password.prototype.calculate = function(){
        var password    = this.$element.val();
        var complexity  = 0, valid = false;
        var $progress   = '.' + this.options.progress;

        // Add character complexity
        for (var i = this.charsets.length - 1; i >= 0; i--) {
            complexity += this.Score(password, this.charsets[i]);
        }

        // Use natural log to produce linear scale
        complexity = Math.log(Math.pow(complexity, password.length)) * (1 / this.options.ScaleFactor);

        valid = (complexity > this.options.min_point && password.length >= this.options.MinimumChars);

        // Scale to percentage, so it can be used for a progress bar
        complexity = (complexity / this.options.max_point) * 100;
        complexity = (complexity > 100) ? 100 : complexity;

        if(this.$element.parent().find($progress).length === 0) {
            this.$element.parent().append(this.$strenght);
        }

        var $progressBar = this.$element.siblings().last();

        $progressBar.toggleClass(this.options.strong, valid);
        $progressBar.toggleClass(this.options.danger, !valid);

        $progressBar.css({
            'width': complexity + '%'
        });

        if($progressBar.width() > 0) {
            this.$element.parents(this.$parent).addClass(this.options.password);
        } else{
            this.$element.parents(this.$parent).removeClass(this.options.password);
        }

    };

    Password.prototype.Score = function (str, charset) {
        for (var i = str.length - 1; i >= 0; i--) {
            if (charset[0] <= str.charCodeAt(i) && str.charCodeAt(i) <= charset[1]) {
                return charset[1] - charset[0] + 1;
            }
        }
        return 0;
    };

    // PASSWORD PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('origam.password');
            var options = typeof option == 'object' && option;

            if (!data) $this.data('origam.password', (data = new Password(this, options)));
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.password;

    $.fn.password             = Plugin;
    $.fn.password.Constructor = Password;


    // PASSWORD NO CONFLICT
    // ===================

    $.fn.input.noConflict = function () {
        $.fn.password = old;
        return this
    };

    $(document).ready(function() {
        $('[data-form="password"]').password();
    });

})(jQuery, window);
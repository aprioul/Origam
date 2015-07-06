
/**
 * Apply origamClose
 */

(function ($, w) {
    'use strict';

    // Close CLASS DEFINITION
    // ======================

    var app = '[data-button="close"]';
    var Close   = function (el) {
        $(el).on('click', app, this.close)
    };

    Close.VERSION = '0.1.0';

    Close.TRANSITION_DURATION = 1000;

    Close.prototype.close = function (e) {

        var $this    = $(this);
        var selector = $this.attr('data-target');

        if (!selector) {
            selector = $this.attr('href');
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '');// strip for ie7
        }

        var $parent = $(selector);

        if (e) e.preventDefault();

        if (!$parent.length) {
            $parent = $this.closest('.alert')
        }

        $parent.trigger(e = $.Event('close.origam.close'));

        var animate = $parent.attr('data-animate');
        var animation = $parent.attr('data-animation');

        if (animate) {
            if(animation){$parent.addClass(animation);}
            else{$parent.addClass('fadeOut');}
            $parent.addClass('animated');
        }

        if (e.isDefaultPrevented()) return;

        function removeElement() {
            // detach from parent, fire event then clean up data
            $parent.detach().trigger('closed.origam.close').remove()
        }

        $.support.transition ?
            $parent
                .one('origamTransitionEnd', removeElement)
                .emulateTransitionEnd(Close.TRANSITION_DURATION) :
            removeElement()
    };


    // Close PLUGIN DEFINITION
    // =======================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data  = $this.data('origam.close');

            if (!data) $this.data('origam.close', (data = new Close(this)));
            if (typeof option == 'string') data[option].call($this)
        })
    }

    var old = $.fn.close;

    $.fn.close             = Plugin;
    $.fn.close.Constructor = Close;


    // Close NO CONFLICT
    // =================

    $.fn.close.noConflict = function () {
        $.fn.close = old
        return this
    };


    // Close DATA-API
    // ==============

    $(document).on('click.origam.Close.data-api', app, Close.prototype.close)

})(jQuery, window);
/**
 * Apply origamCollapse
 */


/**
 * Apply origamColorPicker
 */


/**
 * Apply origamDatePicker
 */


/**
 * Apply origamEqualHeight on a list of elements (in a jQuery object) eq. $('ul li'),
 * all elements will get the higher element height
 * You can call equalHeight several times on the same elements, height will
 * be processed again.
 * @param  {obj} options :
 *     - contentContainerSelector: equalHeight can test the width of the
 *     content before reprocessing. Often we don't need to calculate height
 *     again of the content width doesn't change.
 *     - onResize: callback function called after equalHeight a processed on
 *     windows resize. Will not be called if the container width doesn't change.
 * @return {obj}         jQuery object
 */

(function ($, w) {
    $.fn.extend({
        origamEqualHeight: function (options) {
            var defaults = {
                contentContainerSelector: 'body',
                onResize: function () {
                },
            };

            options = $.extend(defaults, options);
            var o = options;

            var $els = $(this);

            var loadElementsHeight = function () {
                var maxHeight = 0;
                $els.removeClass('equal-height-processed');
                $els
                    .css('height', 'auto')
                    .each(function () {
                        var thisHeight = $(this).height();
                        maxHeight = ( thisHeight > maxHeight ) ? thisHeight : maxHeight;
                    });
                $els.height(maxHeight);
                $els.addClass('equal-height-processed');
            };

            var timerRedim;
            var containerWidth = $(o.contentContainerSelector).width();

            var elementResize = function () {
                clearTimeout(timerRedim);
                timerRedim = setTimeout(function () {
                    newContainerWidth = $(o.contentContainerSelector).width();
                    if (newContainerWidth != containerWidth) {
                        containerWidth = newContainerWidth;
                        loadElementsHeight();
                        o.onResize();
                    }
                }, 500);
            };

            loadElementsHeight();
            $(w).bind('resize', elementResize);
        }
    });
})(jQuery, window);
/**
 * Apply origamFile
 */


/**
 * follow the first link inside each element in the set of matched elements
 * maj 31-01-2013 : replace colorbox-load -> cboxElement
 * maj 24-08-2012 :
 * - added the parameter linkContainer
 * - added support for colorbox links (just trigger the click event)
 * - have to return TRUE if a link is not found, otherwise we stop to loop through the set of elements !
 * maj 01-09-2012
 * - improve colorbox links support, the click was triggered two times in case of clicking directly on the link
 * @param  {obj} options.linkContainer is a selector inside the element to click to target the link more accurately
 * @return {jquery}         the original set of elements
 */

(function ($, w) {
    $.fn.extend({
        origamLink: function (options) {
            var defaults = {
                linkContainer: false
            };

            options = $.extend(defaults, options);

            return this.each(function () {
                var elParent = ( !options.linkContainer ) ? $(this) : $(this).find(options.linkContainer);
                if (elParent.length === 0) elParent = $(this);

                var $firstLink;
                if (elParent.is('a')) $firstLink = elParent;
                else $firstLink = $('a:first', elParent);

                if ($firstLink.length === 0) return true;

                var newWindow = ( $firstLink.filter('[target="_blank"]').length > 0 ) ? true : false;

                if ($firstLink.hasClass('cboxElement')) {
                    var $tempLink = $firstLink.clone(true); // have to clone the link out of the parent $(this) to avoid infinite loop because of event delegation
                    $('body').append($tempLink.hide());
                    $firstLink.unbind('click');
                }

                $(this).click(function (e) {
                    $target = $(e.target);
                    targetIsLink = $target.is('a');

                    // test if we click on another link in the container
                    if (targetIsLink) return true;
                    else e.preventDefault();

                    if ($tempLink) {
                        $tempLink.click();
                        return false;
                    } else {
                        var url = $firstLink.attr('href');
                        if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
                            var referLink = document.createElement('a');
                            if (newWindow) referLink.setAttribute('target', '_blank');
                            referLink.href = url;
                            document.body.appendChild(referLink);
                            referLink.click();
                        } else {
                            if (newWindow) window.open(url);
                            else location.href = url;
                        }
                    }
                });
                $(this).css('cursor', 'pointer');
            });
        }
    });
})(jQuery, window);


/**
 * trigger a function when all images inside the set of matched elements are
 * loaded timeout is defined in case of broken images
 *
 * maj 21-11-2014: add a callback triggered when an image load fail,
 * we give the image as parameter to the callback function.
 * maj 01-09-2014: enhance image loading detection (probably do not work
 * at all before that :-\ ), tested on FF and IE8!
 *
 * @param  {function} callbackFct the function to call when all is loaded
 * @param  {obj} options     options of the plugin
 * @return {obj}             jquery object
 */

(function ($, w) {
    $.fn.extend({
        origamImagesLoaded: function (callbackFct, options) {
            var defaults = {
                timeout: 3000,
                callbackImageLoadFail: function (image) {
                }
            };
            options = $.extend(defaults, options);

            if (typeof(callbackFct) != 'function') return this;

            return this.each(function () {
                var o = options;
                var el = this;
                var $el = $(el);
                var countImgLoaded = 0;
                var $images = $("img", $el);
                var countImg = $images.length;

                /* trigger callback immediatly if no image */
                if (countImg == 0 && typeof(callbackFct) == 'function') callbackFct(el, null);

                var triggerBehavior = function () {
                    if (typeof(callbackFct) == 'function') callbackFct(el, $images);
                };

                /* check of the image laod */
                var checkLoad = function () {
                    countImgLoaded++;
                    if (countImgLoaded >= countImg) {
                        triggerBehavior();
                    }
                };

                $images.each(function () {
                    var timeoutLoad;
                    var image = this;
                    var $image = $(image);

                    // immediately check for cached image
                    // source: http://stackoverflow.com/a/12905092
                    if (image.complete || typeof image.complete === 'undefined') {
                        image.onload = null;
                        checkLoad();
                    } else {
                        // try to force image reload in case of caching
                        $image.attr('data-src', image.src);
                        image.src = '';

                        // I use onload instead of bind('load'), because this last one does
                        // not trigger at all!
                        image.onload = function () {
                            clearTimeout(timeoutLoad);
                            checkLoad();
                        };
                        image.src = $image.attr('data-src');

                        /* each image has a 'o.timeout' millisecond timeout, if missing */
                        timeoutLoad = setTimeout(function () {
                            image.onload = null;
                            // trigger the callback on the image load failure
                            o.callbackImageLoadFail(image);

                            checkLoad();
                        }, o.timeout);
                    }
                });
            });
        }
    });
})(jQuery, window);



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

    Input.prototype.addPlaceholder = function (options){

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
/**
 * Apply origamModal
 */


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

    if (!$.fn.input) throw new Error('Notification requires input.js');

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
        templateSwitch: '<span class="text-field--group__switchpass origamicon origamicon-eye"></span>',
        templateStrenght: '<span class="text-field--progressbar text-field--progressbar__danger"></span>',
        show: 'origamicon-eye',
        hide: 'origamicon-eye-blocked',
        progress: 'text-field--progressbar',
        strong: 'text-field--progressbar__success',
        danger: 'text-field--progressbar__danger',
        modules: 'switch strenght',
        password: 'text-field--password'
    });

    Password.prototype = $.extend({}, $.fn.input.Constructor.prototype);

    Password.prototype.constructor = Password;

    Password.prototype.event = function (options) {
        this.inState   = { click: false, hover: false, focus: false };
        var modules    = this.options.modules.split(' ');

        for (var i = modules.length; i--;) {
            var module = modules[i];

            if (module == 'switch') {
                var toggleSee = this.switch(options);
            }
            if (module == 'strenght') {
                var strenght = this.strenght(options);
            }
        }
    };

    Password.prototype.getDefaults = function () {
        return Password.DEFAULTS
    };

    Password.prototype.switch = function(options){
        this.$wrapper = this.addAddon();

        this.$switch = options.templateSwitch;

        this.$wrapper.append(this.$switch);
        var $switch = this.$wrapper.children();

        $switch.on('click', $.proxy(this.toggle, this));

    };

    Password.prototype.isInStateTrue = function () {
        for (var key in this.inState) {
            if (this.inState[key]) return true
        }

        return false
    };

    Password.prototype.show = function(e){
        this.$element.attr('type', 'text');
        this.$wrapper.children().removeClass(this.options.show).addClass(this.options.hide);
    };

    Password.prototype.hide = function(e){
        this.$element.attr('type', 'password');
        this.$wrapper.children().removeClass(this.options.hide).addClass(this.options.show);
    };

    Password.prototype.toggle = function(e){
        var self = this;

        if(e){
            self.inState.click = !self.inState.click;
            if (self.isInStateTrue()) self.show(e);
            else self.hide(e);
        }
    };

    Password.prototype.strenght = function(options){
        this.$strenght = options.templateStrenght;
        this.charsets = options.charsets;

        this.$element.on('keyup focus input propertychange mouseup', $.proxy(this.calculate, this));
    };

    Password.prototype.calculate = function(e){
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
            'left': Math.max(0, ((this.$element.parent().width() - $progressBar.outerWidth()) / 2) + this.$element.parent().scrollLeft()) + "px",
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
    }

    $(document).ready(function() {
        $('[data-form="password"]').password();
    });

})(jQuery, window);
/**
 * Apply origamPhone
 *
 */

(function ($, w) {

    'use strict';

    // PHONE PUBLIC CLASS DEFINITION
    // ===============================

    var Phone = function (element, options) {
        this.type       = null;
        this.options    = null;
        this.$element   = null;

        this.init('phone', element, options)
    };

    if (!$.fn.input) throw new Error('Notification requires input.js');

    Phone.VERSION  = '0.1.0';

    Phone.TRANSITION_DURATION = 1000;

    Phone.DEFAULTS = $.extend({}, $.fn.input.Constructor.DEFAULTS, {
        autoFormat: true,
        autoPlaceholder: true,
        defaultCountry: "",
        onlyCountries: [],
        preferredCountries: [ "US", "GB", "FR" ],
        nationalMode: true,
        allowExtensions: false,
        numberType: "MOBILE",
        autoHideDialCode: true,
        utilsScript: ""
    });

    Phone.prototype = $.extend({}, $.fn.input.Constructor.prototype);

    Phone.prototype.constructor = Phone;

    Phone.prototype.event = function (options) {

        this.allCountries = [
                [
                    "Afghanistan (‫افغانستان‬‎)",
                    "af",
                    "93"
                ],
                [
                    "Albania (Shqipëri)",
                    "al",
                    "355"
                ],
                [
                    "Algeria (‫الجزائر‬‎)",
                    "dz",
                    "213"
                ],
                [
                    "American Samoa",
                    "as",
                    "1684"
                ],
                [
                    "Andorra",
                    "ad",
                    "376"
                ],
                [
                    "Angola",
                    "ao",
                    "244"
                ],
                [
                    "Anguilla",
                    "ai",
                    "1264"
                ],
                [
                    "Antigua and Barbuda",
                    "ag",
                    "1268"
                ],
                [
                    "Argentina",
                    "ar",
                    "54"
                ],
                [
                    "Armenia (Հայաստան)",
                    "am",
                    "374"
                ],
                [
                    "Aruba",
                    "aw",
                    "297"
                ],
                [
                    "Australia",
                    "au",
                    "61"
                ],
                [
                    "Austria (Österreich)",
                    "at",
                    "43"
                ],
                [
                    "Azerbaijan (Azərbaycan)",
                    "az",
                    "994"
                ],
                [
                    "Bahamas",
                    "bs",
                    "1242"
                ],
                [
                    "Bahrain (‫البحرين‬‎)",
                    "bh",
                    "973"
                ],
                [
                    "Bangladesh (বাংলাদেশ)",
                    "bd",
                    "880"
                ],
                [
                    "Barbados",
                    "bb",
                    "1246"
                ],
                [
                    "Belarus (Беларусь)",
                    "by",
                    "375"
                ],
                [
                    "Belgium (België)",
                    "be",
                    "32"
                ],
                [
                    "Belize",
                    "bz",
                    "501"
                ],
                [
                    "Benin (Bénin)",
                    "bj",
                    "229"
                ],
                [
                    "Bermuda",
                    "bm",
                    "1441"
                ],
                [
                    "Bhutan (འབྲུག)",
                    "bt",
                    "975"
                ],
                [
                    "Bolivia",
                    "bo",
                    "591"
                ],
                [
                    "Bosnia and Herzegovina (Босна и Херцеговина)",
                    "ba",
                    "387"
                ],
                [
                    "Botswana",
                    "bw",
                    "267"
                ],
                [
                    "Brazil (Brasil)",
                    "br",
                    "55"
                ],
                [
                    "British Indian Ocean Territory",
                    "io",
                    "246"
                ],
                [
                    "British Virgin Islands",
                    "vg",
                    "1284"
                ],
                [
                    "Brunei",
                    "bn",
                    "673"
                ],
                [
                    "Bulgaria (България)",
                    "bg",
                    "359"
                ],
                [
                    "Burkina Faso",
                    "bf",
                    "226"
                ],
                [
                    "Burundi (Uburundi)",
                    "bi",
                    "257"
                ],
                [
                    "Cambodia (កម្ពុជា)",
                    "kh",
                    "855"
                ],
                [
                    "Cameroon (Cameroun)",
                    "cm",
                    "237"
                ],
                [
                    "Canada",
                    "ca",
                    "1",
                    1,
                    ["204", "226", "236", "249", "250", "289", "306", "343", "365", "387", "403", "416", "418", "431", "437", "438", "450", "506", "514", "519", "548", "579", "581", "587", "604", "613", "639", "647", "672", "705", "709", "742", "778", "780", "782", "807", "819", "825", "867", "873", "902", "905"]
                ],
                [
                    "Cape Verde (Kabu Verdi)",
                    "cv",
                    "238"
                ],
                [
                    "Caribbean Netherlands",
                    "bq",
                    "599",
                    1
                ],
                [
                    "Cayman Islands",
                    "ky",
                    "1345"
                ],
                [
                    "Central African Republic (République centrafricaine)",
                    "cf",
                    "236"
                ],
                [
                    "Chad (Tchad)",
                    "td",
                    "235"
                ],
                [
                    "Chile",
                    "cl",
                    "56"
                ],
                [
                    "China (中国)",
                    "cn",
                    "86"
                ],
                [
                    "Colombia",
                    "co",
                    "57"
                ],
                [
                    "Comoros (‫جزر القمر‬‎)",
                    "km",
                    "269"
                ],
                [
                    "Congo (DRC) (Jamhuri ya Kidemokrasia ya Kongo)",
                    "cd",
                    "243"
                ],
                [
                    "Congo (Republic) (Congo-Brazzaville)",
                    "cg",
                    "242"
                ],
                [
                    "Cook Islands",
                    "ck",
                    "682"
                ],
                [
                    "Costa Rica",
                    "cr",
                    "506"
                ],
                [
                    "Côte d’Ivoire",
                    "ci",
                    "225"
                ],
                [
                    "Croatia (Hrvatska)",
                    "hr",
                    "385"
                ],
                [
                    "Cuba",
                    "cu",
                    "53"
                ],
                [
                    "Curaçao",
                    "cw",
                    "599",
                    0
                ],
                [
                    "Cyprus (Κύπρος)",
                    "cy",
                    "357"
                ],
                [
                    "Czech Republic (Česká republika)",
                    "cz",
                    "420"
                ],
                [
                    "Denmark (Danmark)",
                    "dk",
                    "45"
                ],
                [
                    "Djibouti",
                    "dj",
                    "253"
                ],
                [
                    "Dominica",
                    "dm",
                    "1767"
                ],
                [
                    "Dominican Republic (República Dominicana)",
                    "do",
                    "1",
                    2,
                    ["809", "829", "849"]
                ],
                [
                    "Ecuador",
                    "ec",
                    "593"
                ],
                [
                    "Egypt (‫مصر‬‎)",
                    "eg",
                    "20"
                ],
                [
                    "El Salvador",
                    "sv",
                    "503"
                ],
                [
                    "Equatorial Guinea (Guinea Ecuatorial)",
                    "gq",
                    "240"
                ],
                [
                    "Eritrea",
                    "er",
                    "291"
                ],
                [
                    "Estonia (Eesti)",
                    "ee",
                    "372"
                ],
                [
                    "Ethiopia",
                    "et",
                    "251"
                ],
                [
                    "Falkland Islands (Islas Malvinas)",
                    "fk",
                    "500"
                ],
                [
                    "Faroe Islands (Føroyar)",
                    "fo",
                    "298"
                ],
                [
                    "Fiji",
                    "fj",
                    "679"
                ],
                [
                    "Finland (Suomi)",
                    "fi",
                    "358"
                ],
                [
                    "France",
                    "fr",
                    "33"
                ],
                [
                    "French Guiana (Guyane française)",
                    "gf",
                    "594"
                ],
                [
                    "French Polynesia (Polynésie française)",
                    "pf",
                    "689"
                ],
                [
                    "Gabon",
                    "ga",
                    "241"
                ],
                [
                    "Gambia",
                    "gm",
                    "220"
                ],
                [
                    "Georgia (საქართველო)",
                    "ge",
                    "995"
                ],
                [
                    "Germany (Deutschland)",
                    "de",
                    "49"
                ],
                [
                    "Ghana (Gaana)",
                    "gh",
                    "233"
                ],
                [
                    "Gibraltar",
                    "gi",
                    "350"
                ],
                [
                    "Greece (Ελλάδα)",
                    "gr",
                    "30"
                ],
                [
                    "Greenland (Kalaallit Nunaat)",
                    "gl",
                    "299"
                ],
                [
                    "Grenada",
                    "gd",
                    "1473"
                ],
                [
                    "Guadeloupe",
                    "gp",
                    "590",
                    0
                ],
                [
                    "Guam",
                    "gu",
                    "1671"
                ],
                [
                    "Guatemala",
                    "gt",
                    "502"
                ],
                [
                    "Guinea (Guinée)",
                    "gn",
                    "224"
                ],
                [
                    "Guinea-Bissau (Guiné Bissau)",
                    "gw",
                    "245"
                ],
                [
                    "Guyana",
                    "gy",
                    "592"
                ],
                [
                    "Haiti",
                    "ht",
                    "509"
                ],
                [
                    "Honduras",
                    "hn",
                    "504"
                ],
                [
                    "Hong Kong (香港)",
                    "hk",
                    "852"
                ],
                [
                    "Hungary (Magyarország)",
                    "hu",
                    "36"
                ],
                [
                    "Iceland (Ísland)",
                    "is",
                    "354"
                ],
                [
                    "India (भारत)",
                    "in",
                    "91"
                ],
                [
                    "Indonesia",
                    "id",
                    "62"
                ],
                [
                    "Iran (‫ایران‬‎)",
                    "ir",
                    "98"
                ],
                [
                    "Iraq (‫العراق‬‎)",
                    "iq",
                    "964"
                ],
                [
                    "Ireland",
                    "ie",
                    "353"
                ],
                [
                    "Israel (‫ישראל‬‎)",
                    "il",
                    "972"
                ],
                [
                    "Italy (Italia)",
                    "it",
                    "39",
                    0
                ],
                [
                    "Jamaica",
                    "jm",
                    "1876"
                ],
                [
                    "Japan (日本)",
                    "jp",
                    "81"
                ],
                [
                    "Jordan (‫الأردن‬‎)",
                    "jo",
                    "962"
                ],
                [
                    "Kazakhstan (Казахстан)",
                    "kz",
                    "7",
                    1
                ],
                [
                    "Kenya",
                    "ke",
                    "254"
                ],
                [
                    "Kiribati",
                    "ki",
                    "686"
                ],
                [
                    "Kuwait (‫الكويت‬‎)",
                    "kw",
                    "965"
                ],
                [
                    "Kyrgyzstan (Кыргызстан)",
                    "kg",
                    "996"
                ],
                [
                    "Laos (ລາວ)",
                    "la",
                    "856"
                ],
                [
                    "Latvia (Latvija)",
                    "lv",
                    "371"
                ],
                [
                    "Lebanon (‫لبنان‬‎)",
                    "lb",
                    "961"
                ],
                [
                    "Lesotho",
                    "ls",
                    "266"
                ],
                [
                    "Liberia",
                    "lr",
                    "231"
                ],
                [
                    "Libya (‫ليبيا‬‎)",
                    "ly",
                    "218"
                ],
                [
                    "Liechtenstein",
                    "li",
                    "423"
                ],
                [
                    "Lithuania (Lietuva)",
                    "lt",
                    "370"
                ],
                [
                    "Luxembourg",
                    "lu",
                    "352"
                ],
                [
                    "Macau (澳門)",
                    "mo",
                    "853"
                ],
                [
                    "Macedonia (FYROM) (Македонија)",
                    "mk",
                    "389"
                ],
                [
                    "Madagascar (Madagasikara)",
                    "mg",
                    "261"
                ],
                [
                    "Malawi",
                    "mw",
                    "265"
                ],
                [
                    "Malaysia",
                    "my",
                    "60"
                ],
                [
                    "Maldives",
                    "mv",
                    "960"
                ],
                [
                    "Mali",
                    "ml",
                    "223"
                ],
                [
                    "Malta",
                    "mt",
                    "356"
                ],
                [
                    "Marshall Islands",
                    "mh",
                    "692"
                ],
                [
                    "Martinique",
                    "mq",
                    "596"
                ],
                [
                    "Mauritania (‫موريتانيا‬‎)",
                    "mr",
                    "222"
                ],
                [
                    "Mauritius (Moris)",
                    "mu",
                    "230"
                ],
                [
                    "Mexico (México)",
                    "mx",
                    "52"
                ],
                [
                    "Micronesia",
                    "fm",
                    "691"
                ],
                [
                    "Moldova (Republica Moldova)",
                    "md",
                    "373"
                ],
                [
                    "Monaco",
                    "mc",
                    "377"
                ],
                [
                    "Mongolia (Монгол)",
                    "mn",
                    "976"
                ],
                [
                    "Montenegro (Crna Gora)",
                    "me",
                    "382"
                ],
                [
                    "Montserrat",
                    "ms",
                    "1664"
                ],
                [
                    "Morocco (‫المغرب‬‎)",
                    "ma",
                    "212"
                ],
                [
                    "Mozambique (Moçambique)",
                    "mz",
                    "258"
                ],
                [
                    "Myanmar (Burma) (မြန်မာ)",
                    "mm",
                    "95"
                ],
                [
                    "Namibia (Namibië)",
                    "na",
                    "264"
                ],
                [
                    "Nauru",
                    "nr",
                    "674"
                ],
                [
                    "Nepal (नेपाल)",
                    "np",
                    "977"
                ],
                [
                    "Netherlands (Nederland)",
                    "nl",
                    "31"
                ],
                [
                    "New Caledonia (Nouvelle-Calédonie)",
                    "nc",
                    "687"
                ],
                [
                    "New Zealand",
                    "nz",
                    "64"
                ],
                [
                    "Nicaragua",
                    "ni",
                    "505"
                ],
                [
                    "Niger (Nijar)",
                    "ne",
                    "227"
                ],
                [
                    "Nigeria",
                    "ng",
                    "234"
                ],
                [
                    "Niue",
                    "nu",
                    "683"
                ],
                [
                    "Norfolk Island",
                    "nf",
                    "672"
                ],
                [
                    "North Korea (조선 민주주의 인민 공화국)",
                    "kp",
                    "850"
                ],
                [
                    "Northern Mariana Islands",
                    "mp",
                    "1670"
                ],
                [
                    "Norway (Norge)",
                    "no",
                    "47"
                ],
                [
                    "Oman (‫عُمان‬‎)",
                    "om",
                    "968"
                ],
                [
                    "Pakistan (‫پاکستان‬‎)",
                    "pk",
                    "92"
                ],
                [
                    "Palau",
                    "pw",
                    "680"
                ],
                [
                    "Palestine (‫فلسطين‬‎)",
                    "ps",
                    "970"
                ],
                [
                    "Panama (Panamá)",
                    "pa",
                    "507"
                ],
                [
                    "Papua New Guinea",
                    "pg",
                    "675"
                ],
                [
                    "Paraguay",
                    "py",
                    "595"
                ],
                [
                    "Peru (Perú)",
                    "pe",
                    "51"
                ],
                [
                    "Philippines",
                    "ph",
                    "63"
                ],
                [
                    "Poland (Polska)",
                    "pl",
                    "48"
                ],
                [
                    "Portugal",
                    "pt",
                    "351"
                ],
                [
                    "Puerto Rico",
                    "pr",
                    "1",
                    3,
                    ["787", "939"]
                ],
                [
                    "Qatar (‫قطر‬‎)",
                    "qa",
                    "974"
                ],
                [
                    "Réunion (La Réunion)",
                    "re",
                    "262"
                ],
                [
                    "Romania (România)",
                    "ro",
                    "40"
                ],
                [
                    "Russia (Россия)",
                    "ru",
                    "7",
                    0
                ],
                [
                    "Rwanda",
                    "rw",
                    "250"
                ],
                [
                    "Saint Barthélemy (Saint-Barthélemy)",
                    "bl",
                    "590",
                    1
                ],
                [
                    "Saint Helena",
                    "sh",
                    "290"
                ],
                [
                    "Saint Kitts and Nevis",
                    "kn",
                    "1869"
                ],
                [
                    "Saint Lucia",
                    "lc",
                    "1758"
                ],
                [
                    "Saint Martin (Saint-Martin (partie française))",
                    "mf",
                    "590",
                    2
                ],
                [
                    "Saint Pierre and Miquelon (Saint-Pierre-et-Miquelon)",
                    "pm",
                    "508"
                ],
                [
                    "Saint Vincent and the Grenadines",
                    "vc",
                    "1784"
                ],
                [
                    "Samoa",
                    "ws",
                    "685"
                ],
                [
                    "San Marino",
                    "sm",
                    "378"
                ],
                [
                    "São Tomé and Príncipe (São Tomé e Príncipe)",
                    "st",
                    "239"
                ],
                [
                    "Saudi Arabia (‫المملكة العربية السعودية‬‎)",
                    "sa",
                    "966"
                ],
                [
                    "Senegal (Sénégal)",
                    "sn",
                    "221"
                ],
                [
                    "Serbia (Србија)",
                    "rs",
                    "381"
                ],
                [
                    "Seychelles",
                    "sc",
                    "248"
                ],
                [
                    "Sierra Leone",
                    "sl",
                    "232"
                ],
                [
                    "Singapore",
                    "sg",
                    "65"
                ],
                [
                    "Sint Maarten",
                    "sx",
                    "1721"
                ],
                [
                    "Slovakia (Slovensko)",
                    "sk",
                    "421"
                ],
                [
                    "Slovenia (Slovenija)",
                    "si",
                    "386"
                ],
                [
                    "Solomon Islands",
                    "sb",
                    "677"
                ],
                [
                    "Somalia (Soomaaliya)",
                    "so",
                    "252"
                ],
                [
                    "South Africa",
                    "za",
                    "27"
                ],
                [
                    "South Korea (대한민국)",
                    "kr",
                    "82"
                ],
                [
                    "South Sudan (‫جنوب السودان‬‎)",
                    "ss",
                    "211"
                ],
                [
                    "Spain (España)",
                    "es",
                    "34"
                ],
                [
                    "Sri Lanka (ශ්‍රී ලංකාව)",
                    "lk",
                    "94"
                ],
                [
                    "Sudan (‫السودان‬‎)",
                    "sd",
                    "249"
                ],
                [
                    "Suriname",
                    "sr",
                    "597"
                ],
                [
                    "Swaziland",
                    "sz",
                    "268"
                ],
                [
                    "Sweden (Sverige)",
                    "se",
                    "46"
                ],
                [
                    "Switzerland (Schweiz)",
                    "ch",
                    "41"
                ],
                [
                    "Syria (‫سوريا‬‎)",
                    "sy",
                    "963"
                ],
                [
                    "Taiwan (台灣)",
                    "tw",
                    "886"
                ],
                [
                    "Tajikistan",
                    "tj",
                    "992"
                ],
                [
                    "Tanzania",
                    "tz",
                    "255"
                ],
                [
                    "Thailand (ไทย)",
                    "th",
                    "66"
                ],
                [
                    "Timor-Leste",
                    "tl",
                    "670"
                ],
                [
                    "Togo",
                    "tg",
                    "228"
                ],
                [
                    "Tokelau",
                    "tk",
                    "690"
                ],
                [
                    "Tonga",
                    "to",
                    "676"
                ],
                [
                    "Trinidad and Tobago",
                    "tt",
                    "1868"
                ],
                [
                    "Tunisia (‫تونس‬‎)",
                    "tn",
                    "216"
                ],
                [
                    "Turkey (Türkiye)",
                    "tr",
                    "90"
                ],
                [
                    "Turkmenistan",
                    "tm",
                    "993"
                ],
                [
                    "Turks and Caicos Islands",
                    "tc",
                    "1649"
                ],
                [
                    "Tuvalu",
                    "tv",
                    "688"
                ],
                [
                    "U.S. Virgin Islands",
                    "vi",
                    "1340"
                ],
                [
                    "Uganda",
                    "ug",
                    "256"
                ],
                [
                    "Ukraine (Україна)",
                    "ua",
                    "380"
                ],
                [
                    "United Arab Emirates (‫الإمارات العربية المتحدة‬‎)",
                    "ae",
                    "971"
                ],
                [
                    "United Kingdom",
                    "gb",
                    "44"
                ],
                [
                    "United States",
                    "us",
                    "1",
                    0
                ],
                [
                    "Uruguay",
                    "uy",
                    "598"
                ],
                [
                    "Uzbekistan (Oʻzbekiston)",
                    "uz",
                    "998"
                ],
                [
                    "Vanuatu",
                    "vu",
                    "678"
                ],
                [
                    "Vatican City (Città del Vaticano)",
                    "va",
                    "39",
                    1
                ],
                [
                    "Venezuela",
                    "ve",
                    "58"
                ],
                [
                    "Vietnam (Việt Nam)",
                    "vn",
                    "84"
                ],
                [
                    "Wallis and Futuna",
                    "wf",
                    "681"
                ],
                [
                    "Yemen (‫اليمن‬‎)",
                    "ye",
                    "967"
                ],
                [
                    "Zambia",
                    "zm",
                    "260"
                ],
                [
                    "Zimbabwe",
                    "zw",
                    "263"
                ]
            ];

    };

    Phone.prototype.getDefaults = function () {
        return Phone.DEFAULTS
    };

    // PHONE PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('origam.phone');
            var options = typeof option == 'object' && option;

            if (!data) $this.data('origam.phone', (data = new Phone(this, options)));
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.phone;

    $.fn.phone             = Plugin;
    $.fn.phone.Constructor = Phone;


    // PHONE NO CONFLICT
    // ===================

    $.fn.input.noConflict = function () {
        $.fn.phone = old;
        return this
    }

    $(document).ready(function() {
        $('[data-form="phone"]').phone();
    });

})(jQuery, window);
/**
 * Apply origamRipple
 */

(function ($, w) {
    'use strict';

    // Ripple CLASS DEFINITION
    // ======================

    var app = '[data-button="ripple"]';
    var Ripple   = function (el) {
        $(el).on('mousedown', app, this.init)
    };

    Ripple.VERSION = '0.1.0';

    Ripple.TRANSITION_DURATION = 651;

    Ripple.prototype.init = function (e) {
        var $this    = $(this);

        $this.css({
            position: 'relative',
            overflow: 'hidden'
        });

        var ripple;

        if ($this.find('.ripple').length === 0) {

            ripple = $('<span/>').addClass('ripple');

            if ($this.attr('data-ripple'))
            {
                ripple.addClass('ripple-' + $this.attr('data-ripple'));
            }

            $this.prepend(ripple);
        }
        else
        {
            ripple = $this.find('.ripple');
        }

        ripple.removeClass('animated');

        if (!ripple.height() && !ripple.width())
        {
            var diameter = Math.max($this.outerWidth(), $this.outerHeight());

            ripple.css({ height: diameter, width: diameter });
        }

        var x = e.pageX - $this.offset().left - ripple.width() / 2;
        var y = e.pageY - $this.offset().top - ripple.height() / 2;

        ripple.css({ top: y+'px', left: x+'px' }).addClass('animated');

        function removeElement() {
            ripple.removeClass('animated');
        }

        $.support.transition ?
            $this
                .one('origamTransitionEnd', removeElement)
                .emulateTransitionEnd(Ripple.TRANSITION_DURATION) :
            removeElement()
    };


    // Ripple PLUGIN DEFINITION
    // =======================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data  = $this.data('origam.ripple');

            if (!data) $this.data('origam.ripple', (data = new Ripple(this)));
            if (typeof option == 'string') data[option].call($this)
        })
    }

    var old = $.fn.ripple;

    $.fn.ripple             = Plugin;
    $.fn.ripple.Constructor = Ripple;


    // Ripple NO CONFLICT
    // =================

    $.fn.ripple.noConflict = function () {
        $.fn.ripple = old
        return this
    };


    // Ripple DATA-API
    // ==============

    $(document).on('click.origam.Ripple.data-api', app, Ripple.prototype.ripple)

})(jQuery, window);


/**
 * Apply origamScrollbar
 */


/**
 * Apply origamSelect
 */


/**
 * Apply origamSlider
 */


/**
 * Apply origamTabs
 */

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
/**
 * Apply origamTooltip
 */

(function ($, w) {

    'use strict';

    // TOOLTIP PUBLIC CLASS DEFINITION
    // ===============================

    var Tooltip = function (element, options) {
        this.type       = null;
        this.options    = null;
        this.enabled    = null;
        this.timeout    = null;
        this.hoverState = null;
        this.$element   = null;
        this.inState    = null;

        this.init('tooltip', element, options)
    };

    Tooltip.VERSION  = '0.1.0';

    Tooltip.TRANSITION_DURATION = 1000;

    Tooltip.DEFAULTS = {
        placement: 'top',
        selector: false,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: 'hover focus',
        title: '',
        delay: 0,
        html: false,
        container: false,
        viewport: {
            selector: 'body',
            padding: 0
        }
    };

    Tooltip.prototype.init = function (type, element, options) {
        this.enabled   = true;
        this.type      = type;
        this.$element  = $(element);
        this.options   = this.getOptions(options);
        this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport));
        this.inState   = { click: false, hover: false, focus: false };

        if (this.$element[0] instanceof document.constructor && !this.options.selector) {
            throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
        }

        var triggers = this.options.trigger.split(' ');

        for (var i = triggers.length; i--;) {
            var trigger = triggers[i];

            if (trigger == 'click') {
                this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
            } else if (trigger != 'manual') {
                var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin';
                var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout';

                this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this));
                this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
            }
        }

        this.options.selector ?
            (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
            this.fixTitle()
    };

    Tooltip.prototype.getDefaults = function () {
        return Tooltip.DEFAULTS
    };

    Tooltip.prototype.getOptions = function (options) {
        options = $.extend({}, this.getDefaults(), this.$element.data(), options);

        if (options.delay && typeof options.delay == 'number') {
            options.delay = {
                show: options.delay,
                hide: options.delay
            }
        }

        return options
    };

    Tooltip.prototype.getDelegateOptions = function () {
        var options  = {};
        var defaults = this.getDefaults();

        this._options && $.each(this._options, function (key, value) {
            if (defaults[key] != value) options[key] = value
        });

        return options
    };

    Tooltip.prototype.enter = function (obj) {
        var self = obj instanceof this.constructor ?
            obj : $(obj.currentTarget).data('origam.' + this.type);

        if (!self) {
            self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
            $(obj.currentTarget).data('origam.' + this.type, self)
        }

        if (obj instanceof $.Event) {
            self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
        }

        if (self.tip().hasClass('show') || self.hoverState == 'show') {
            self.hoverState = 'show';
            return
        }

        clearTimeout(self.timeout);

        self.hoverState = 'show';

        if (!self.options.delay || !self.options.delay.show) return self.show();

        self.timeout = setTimeout(function () {
            if (self.hoverState == 'show') self.show()
        }, self.options.delay.show)
    };

    Tooltip.prototype.isInStateTrue = function () {
        for (var key in this.inState) {
            if (this.inState[key]) return true
        }

        return false
    };

    Tooltip.prototype.leave = function (obj) {
        var self = obj instanceof this.constructor ?
            obj : $(obj.currentTarget).data('origam.' + this.type);

        if (!self) {
            self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
            $(obj.currentTarget).data('origam.' + this.type, self)
        }

        if (obj instanceof $.Event) {
            self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
        }

        if (self.isInStateTrue()) return;

        clearTimeout(self.timeout);

        self.hoverState = 'hide';

        if (!self.options.delay || !self.options.delay.hide) return self.hide();

        self.timeout = setTimeout(function () {
            if (self.hoverState == 'hide') self.hide()
        }, self.options.delay.hide)
    };

    Tooltip.prototype.show = function () {
        var e = $.Event('show.origam.' + this.type);

        if (this.hasContent() && this.enabled) {
            this.$element.trigger(e);

            var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
            if (e.isDefaultPrevented() || !inDom) return;
            var that = this;

            var $tip = this.tip();

            var tipId = this.getUID(this.type);

            this.setContent();
            $tip.attr('id', tipId);
            this.$element.attr('aria-describedby', tipId);

            var animate = that.$element.attr('data-animate');
            var animationOut = that.$element.attr('data-animation-out');
            var animationIn = that.$element.attr('data-animation-in');
            var animateClass = '';

            if (animate) {
                if(animationOut){$tip.removeClass(animationOut);}
                else{$tip.removeClass('fadeOut');}
                if(animationIn){
                    $tip.addClass(animationIn);
                    animateClass = animationIn;
                }
                else{
                    $tip.addClass('fadeIn');
                    animateClass = 'fadeIn';
                }
                $tip.addClass('animated');
            }

            var placement = typeof this.options.placement == 'function' ?
                this.options.placement.call(this, $tip[0], this.$element[0]) :
                this.options.placement;

            var autoToken = /\s?auto?\s?/i;
            var autoPlace = autoToken.test(placement);
            if (autoPlace) placement = placement.replace(autoToken, '') || 'top';

            $tip
                .detach()
                .css({ top: 0, left: 0, display: 'block' })
                .addClass(placement)
                .data('origam.' + this.type, this);

            this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element);
            this.$element.trigger('inserted.origam.' + this.type);

            var pos          = this.getPosition();
            var actualWidth  = $tip[0].offsetWidth;
            var actualHeight = $tip[0].offsetHeight;

            if (autoPlace) {
                var orgPlacement = placement;
                var viewportDim = this.getPosition(this.$viewport);

                placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                        placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
                            placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                                placement;

                $tip
                    .removeClass(orgPlacement)
                    .addClass(placement)
            }

            var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight);

            this.applyPlacement(calculatedOffset, placement);

            var complete = function () {
                var prevHoverState = that.hoverState;
                that.$element.trigger('shown.origam.' + that.type);
                that.hoverState = null;

                if (prevHoverState == 'hide') that.leave(that)
            };

            $.support.transition && this.$tip.hasClass(animateClass) ?
                $tip
                    .one('origamTransitionEnd', complete)
                    .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
                complete()
        }
    };

    Tooltip.prototype.applyPlacement = function (offset, placement) {
        var $tip   = this.tip();
        var width  = $tip[0].offsetWidth;
        var height = $tip[0].offsetHeight;

        // manually read margins because getBoundingClientRect includes difference
        var marginTop = parseInt($tip.css('margin-top'), 10);
        var marginLeft = parseInt($tip.css('margin-left'), 10);

        // we must check for NaN for ie 8/9
        if (isNaN(marginTop))  marginTop  = 0;
        if (isNaN(marginLeft)) marginLeft = 0;

        offset.top  += marginTop;
        offset.left += marginLeft;

        // $.fn.offset doesn't round pixel values
        // so we use setOffset directly with our own function B-0
        $.offset.setOffset($tip[0], $.extend({
            using: function (props) {
                $tip.css({
                    top: Math.round(props.top),
                    left: Math.round(props.left)
                })
            }
        }, offset), 0);

        $tip.addClass('show');

        // check to see if placing tip in new offset caused the tip to resize itself
        var actualWidth  = $tip[0].offsetWidth;
        var actualHeight = $tip[0].offsetHeight;

        if (placement == 'top' && actualHeight != height) {
            offset.top = offset.top + height - actualHeight
        }

        var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight);

        if (delta.left) offset.left += delta.left;
        else offset.top += delta.top;

        var isVertical          = /top|bottom/.test(placement);
        var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight;
        var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight';

        $tip.offset(offset);
        this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
    };

    Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
        this.arrow()
            .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
            .css(isVertical ? 'top' : 'left', '')
    };

    Tooltip.prototype.setContent = function () {
        var $tip  = this.tip();
        var title = this.getTitle();

        $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title);
        $tip.removeClass('fade in top bottom left right')
    };

    Tooltip.prototype.hide = function (callback) {
        var that = this;
        var $tip = $(this.$tip);
        var e    = $.Event('hide.origam.' + this.type);

        function complete() {
            $tip.removeClass('show');
            if (that.hoverState != 'show') $tip.detach();
            that.$element
                .removeAttr('aria-describedby')
                .trigger('hidden.origam.' + that.type);
            callback && callback()
        }

        this.$element.trigger(e);

        if (e.isDefaultPrevented()) return;

        var animate = that.$element.attr('data-animate');
        var animationOut = that.$element.attr('data-animation-out');
        var animationIn = that.$element.attr('data-animation-in');
        var animateClass = '';

        if (animate) {
            if(animationIn){$tip.removeClass(animationIn);}
            else{$tip.removeClass('fadeIn');}
            if(animationOut){
                $tip.addClass(animationOut);
                animateClass = animationOut;
            }
            else{
                $tip.addClass('fadeOut');
                animateClass = 'fadeOut';
            }
            $tip.addClass('animated');
        }

        $.support.transition && $tip.hasClass(animateClass) ?
            $tip
                .one('origamTransitionEnd', complete)
                .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
            complete();

        this.hoverState = null;

        return this
    };

    Tooltip.prototype.fixTitle = function () {
        var $e = this.$element;
        if ($e.attr('title') || typeof $e.attr('data-title') != 'string') {
            $e.attr('data-title', $e.attr('title') || '').attr('title', '')
        }
    };

    Tooltip.prototype.hasContent = function () {
        return this.getTitle()
    };

    Tooltip.prototype.getPosition = function ($element) {
        $element   = $element || this.$element;

        var el     = $element[0];
        var isBody = el.tagName == 'BODY';

        var elRect    = el.getBoundingClientRect();
        if (elRect.width == null) {
            elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
        }
        var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset();
        var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() };
        var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null;

        return $.extend({}, elRect, scroll, outerDims, elOffset)
    };

    Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
        return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
            placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
                placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
                    /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

    };

    Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
        var delta = { top: 0, left: 0 };
        if (!this.$viewport) return delta;

        var viewportPadding = this.options.viewport && this.options.viewport.padding || 0;
        var viewportDimensions = this.getPosition(this.$viewport);

        if (/right|left/.test(placement)) {
            var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll;
            var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight;
            if (topEdgeOffset < viewportDimensions.top) { // top overflow
                delta.top = viewportDimensions.top - topEdgeOffset
            } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
                delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
            }
        } else {
            var leftEdgeOffset  = pos.left - viewportPadding;
            var rightEdgeOffset = pos.left + viewportPadding + actualWidth;
            if (leftEdgeOffset < viewportDimensions.left) { // left overflow
                delta.left = viewportDimensions.left - leftEdgeOffset
            } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
                delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
            }
        }

        return delta
    };

    Tooltip.prototype.getTitle = function () {
        var title;
        var $e = this.$element;
        var o  = this.options;

        title = $e.attr('data-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title);

        return title
    };

    Tooltip.prototype.getUID = function (prefix) {
        do prefix += ~~(Math.random() * 1000000);
        while (document.getElementById(prefix));
        return prefix
    };

    Tooltip.prototype.tip = function () {
        if (!this.$tip) {
            this.$tip = $(this.options.template);
            if (this.$tip.length != 1) {
                throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
            }
        }
        return this.$tip
    };

    Tooltip.prototype.arrow = function () {
        return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
    };

    Tooltip.prototype.enable = function () {
        this.enabled = true
    };

    Tooltip.prototype.disable = function () {
        this.enabled = false
    };

    Tooltip.prototype.toggleEnabled = function () {
        this.enabled = !this.enabled
    };

    Tooltip.prototype.toggle = function (e) {
        var self = this;
        if (e) {
            self = $(e.currentTarget).data('origam.' + this.type);
            if (!self) {
                self = new this.constructor(e.currentTarget, this.getDelegateOptions());
                $(e.currentTarget).data('origam.' + this.type, self)
            }
        }

        if (e) {
            self.inState.click = !self.inState.click;
            if (self.isInStateTrue()) self.enter(self);
            else self.leave(self)
        } else {
            self.tip().hasClass('show') ? self.leave(self) : self.enter(self)
        }
    };

    Tooltip.prototype.destroy = function () {
        var that = this;
        clearTimeout(this.timeout);
        this.hide(function () {
            that.$element.off('.' + that.type).removeData('origam.' + that.type);
            if (that.$tip) {
                that.$tip.detach()
            }
            that.$tip = null;
            that.$arrow = null;
            that.$viewport = null
        })
    };


    // TOOLTIP PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('origam.tooltip');
            var options = typeof option == 'object' && option;

            if (!data && /destroy|hide/.test(option)) return;
            if (!data) $this.data('origam.tooltip', (data = new Tooltip(this, options)));
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.tooltip;

    $.fn.tooltip             = Plugin;
    $.fn.tooltip.Constructor = Tooltip;


    // TOOLTIP NO CONFLICT
    // ===================

    $.fn.tooltip.noConflict = function () {
        $.fn.tooltip = old;
        return this
    }

    $(document).ready(function() {
        $('[data-app="tooltip"]').tooltip();
    });

})(jQuery, window);
/**
 * Apply origamNotification
 */

(function ($, w) {
    'use strict';

    // NOTIFICATION PUBLIC CLASS DEFINITION
    // ===============================

    var Notification = function (element, options) {
        this.init('notification', element, options)
    };

    if (!$.fn.tooltip) throw new Error('Notification requires tooltip-main.js');

    Notification.VERSION  = '0.1.0';

    Notification.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
        placement: 'right',
        trigger: 'click',
        content: '',
        template: '<div class="notification"><h3 class="notification-title"></h3><div class="notification-content"></div><span class="notification-close" data-button="close" data-target=".notification"><i class="origamicon origamicon-close"></i></span></div>'
    });


    // NOTE: NOTIFICATION EXTENDS tooltip-main.js
    // ================================

    Notification.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype);

    Notification.prototype.constructor = Notification;

    Notification.prototype.getDefaults = function () {
        return Notification.DEFAULTS
    };

    Notification.prototype.setContent = function () {
        var $tip    = this.tip();
        var title   = this.getTitle();
        var content = this.getContent();
        var app = '[data-app="close"]';

        $tip.find('.notification-title')[this.options.html ? 'html' : 'text'](title);
        $tip.find('.notification-content').children().detach().end()[ // we use append for html objects to maintain js events
            this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
            ](content);

        $tip.removeClass('fade top bottom left right in');

        // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
        // this manually by checking the contents.
        if (!$tip.find('.notification-title').html()) $tip.find('.notification-title').hide();

        // Add close event
        var data  = $tip.find('.notification-close').data('origam.close');

        if (!data) $tip.find('.notification-close').data('origam.close', (data = $tip.find('.notification-close').on('click', app, this.close)));
    }

    Notification.prototype.hasContent = function () {
        return this.getTitle() || this.getContent()
    }

    Notification.prototype.getContent = function () {
        var $e = this.$element;
        var o  = this.options;

        return $e.attr('data-content')
            || (typeof o.content == 'function' ?
                o.content.call($e[0]) :
                o.content)
    };


    // NOTIFICATION PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('origam.notification');
            var options = typeof option == 'object' && option;

            if (!data && /destroy|hide/.test(option)) return;
            if (!data) $this.data('origam.notification', (data = new Notification(this, options)));
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.notification;

    $.fn.notification             = Plugin;
    $.fn.notification.Constructor = Notification;


    // NOTIFICATION NO CONFLICT
    // ===================

    $.fn.notification.noConflict = function () {
        $.fn.notification = old;
        return this
    }

    $(document).ready(function() {
        $('[data-app="notification"]').notification();
    });

})(jQuery, window);
/**
 * Apply origamPopover
 */

(function ($, w) {
    'use strict';

    // POPOVER PUBLIC CLASS DEFINITION
    // ===============================

    var Popover = function (element, options) {
        this.init('popover', element, options)
    }

    if (!$.fn.tooltip) throw new Error('Popover requires tooltip-main.js')

    Popover.VERSION  = '0.1.0'

    Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
        placement: 'right',
        trigger: 'click',
        content: '',
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    })


    // NOTE: POPOVER EXTENDS tooltip.js
    // ================================

    Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

    Popover.prototype.constructor = Popover

    Popover.prototype.getDefaults = function () {
        return Popover.DEFAULTS
    }

    Popover.prototype.setContent = function () {
        var $tip    = this.tip()
        var title   = this.getTitle()
        var content = this.getContent()

        $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
        $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
            this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
            ](content)

        $tip.removeClass('fade top bottom left right in')

        // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
        // this manually by checking the contents.
        if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
    }

    Popover.prototype.hasContent = function () {
        return this.getTitle() || this.getContent()
    }

    Popover.prototype.getContent = function () {
        var $e = this.$element
        var o  = this.options

        return $e.attr('data-content')
            || (typeof o.content == 'function' ?
                o.content.call($e[0]) :
                o.content)
    }

    Popover.prototype.arrow = function () {
        return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
    }


    // POPOVER PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('origam.popover')
            var options = typeof option == 'object' && option

            if (!data && /destroy|hide/.test(option)) return
            if (!data) $this.data('origam.popover', (data = new Popover(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.popover

    $.fn.popover             = Plugin
    $.fn.popover.Constructor = Popover


    // POPOVER NO CONFLICT
    // ===================

    $.fn.popover.noConflict = function () {
        $.fn.popover = old
        return this
    }

    $(document).ready(function() {
        $('[data-app="popover"]').notification();
        $('body').on('click', function (e) {
            $('[data-app="popover"]').each(function () {
                //The 'is' for buttons that trigger popups
                //The 'has' for icons within a button that triggers a popup
                if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                    $(this).popover('hide');
                    $(this).next().css({display: 'none'});
                }
            });
        });
    });

})(jQuery, window);
/**
 * Apply origamTransition
 */

(function ($, w) {
    'use strict';

    // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
    // ============================================================

    function transitionEnd() {
        var el = document.createElement('origam')

        var transEndEventNames = {
            WebkitTransition : 'webkitTransitionEnd',
            MozTransition    : 'transitionend',
            OTransition      : 'oTransitionEnd otransitionend',
            transition       : 'transitionend'
        }

        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return { end: transEndEventNames[name] }
            }
        }

        return false // explicit for ie8 (  ._.)
    }

    // http://blog.alexmaccaw.com/css-transitions
    $.fn.emulateTransitionEnd = function (duration) {
        var called = false
        var $el = this
        $(this).one('origamTransitionEnd', function () { called = true })
        var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
        setTimeout(callback, duration)
        return this
    }

    $(function () {
        $.support.transition = transitionEnd()

        if (!$.support.transition) return

        $.event.special.origamTransitionEnd = {
            bindType: $.support.transition.end,
            delegateType: $.support.transition.end,
            handle: function (e) {
                if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
            }
        }
    })

})(jQuery, window);


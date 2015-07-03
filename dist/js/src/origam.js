
/**
 * Apply origamClose
 */

(function ($, w) {
    'use strict';

    // Close CLASS DEFINITION
    // ======================

    var dismiss = '[data-dismiss="close"]';
    var Close   = function (el) {
        $(el).on('click', dismiss, this.close)
    };

    Close.VERSION = '1.0.0';

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

    var old = $.fn.Close;

    $.fn.Close             = Plugin;
    $.fn.Close.Constructor = Close;


    // Close NO CONFLICT
    // =================

    $.fn.Close.noConflict = function () {
        $.fn.Close = old
        return this
    };


    // Close DATA-API
    // ==============

    $(document).on('click.origam.Close.data-api', dismiss, Close.prototype.close)

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

    var origamInput = function () {
        var
            defaults = {
                placeholder: '',
                classes: {
                    focus: 'text-field--focused',
                    active: 'text-field--active'
                },
                parentNode: 'text-field',
                baseHeight: '24'
            },

            /**
             * Init Functions
             */
            placeholder = function(){

            },
            focus = function(){
                $(this).parents('.text-field').removeClass(defaults.classes.active);
                $(this).parents('.text-field').addClass(defaults.classes.focus);
            },
            blur = function(){
                $(this)
                    .parents('.text-field')
                    .removeClass(defaults.classes.focus);
                if($(this).val() != ''){
                    $(this)
                        .parents('.text-field')
                        .addClass(defaults.classes.active);
                }
            },
            /**
             * Textare Functions
             */
            resizeTextarea = function(e, $textarea, opt) {
                var offset = e.offsetHeight - e.clientHeight;
                $textarea.on('keyup input', function () {
                    var baseHeight = opt.baseHeight + 'px';
                    $textarea.css('height', baseHeight).css('height', e.scrollHeight + offset);
                });
            }

        return {
            init: function (opt) {
                opt = $.extend({}, defaults, opt || {});

                //For each selected DOM element
                return this.each(function () {
                    var event = this;
                    var $input = $(event);
                    var options = $.extend({}, opt);
                    var parentNode = '.' + options.parentNode;
                    var $inputParent = $input.parents(parentNode);
                    var $inputlabel = $inputParent.children('label');
                    var cls = options.classes;
                    var modules = options.modules;

                    $input.focus(focus).blur(blur);

                    if ($input.is('textarea')) {
                        resizeTextarea(event, $input, opt);
                    }
                });
            }
        };
    }();

    $.fn.extend({
        origamInput: origamInput.init
    });

})(jQuery, window);


/**
 * Apply origamModal
 */


/**
 * Apply origamClose
 */


/**
 * Apply origamPassword on input elements (in a jQuery object) eq. $('input[type=password]'),
 * password have 2 modules :
 *  - passwordswitch
 *  - passwordstrenght
 * passwordswitch allow you to add switch button to hide or show password
 * passwordstreght add progressbar to show to user if him password is nice or
 * useless
 * @param  {obj} options :
 *     - classes : You can change default classes of element
 *          - addonsLeft :
 *          - addonsRight :
 *          - wrapper :
 *          - password :
 *          - icon :
 *          - show :
 *          - hide :
 *          - switch :
 *          - progressbar :
 *          - progressbarDanger :
 *          - progressbarSuccess :
 *     - parentNode : You can define parent
 *     - HtmlElement :
 *     - AddonHtmlElement :
 *     - AdddAfter :
 *     - strenght :
 *          - MinimumChars :
 *          - ScaleFactor :
 *     - modules :
 */

(function ($, w) {

    var origamPassword = function () {
        var
            defaults = {
                classes: {
                    addonsLeft: 'text-field--addons left',
                    addonsRight: 'text-field--addons right',
                    wrapper: 'text-field--group__addons',
                    password: 'text-field--password',
                    icon : 'origamicon',
                    show: 'origamicon-eye',
                    hide: 'origamicon-eye-blocked',
                    switch: 'text-field--group__switchpass',
                    progressbar: 'text-field--progressbar',
                    progressbarDanger: 'text-field--progressbar__danger',
                    progressbarSuccess: 'text-field--progressbar__success'
                },
                parentNode: 'text-field',
                HtmlElement: 'span',
                AddonHtmlElement : 'div',
                AdddAfter: true,
                strenght: {
                    MinimumChars: 8,
                    ScaleFactor: 1
                },
                modules: [
                    'passwordswitch',
                    'passwordstrenght'
                ]
            },
            min_point = 49,
            max_point = 120,
            charsets = [
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
            /**
             * Global Functions
             */
            addAddons = function($element,opt){
                var parentNode = '.' + opt.parentNode;
                var classPosition = '';
                optAddonsPosition = opt.AdddAfter;
                optAddonsPosition ? classPosition = opt.classes.addonsRight : opt.classes.addonsLeft;

                $element.parents(parentNode).addClass(classPosition);

                var wrapper = addWrapper(opt.AddonHtmlElement,opt.classes.wrapper);

                if(optAddonsPosition) {
                    $element.after(wrapper);
                    return ($element.next());
                }
                else{
                    $element.before(wrapper);
                    return ($element.prev());
                }
            },
            addWrapper = function(element, opt){
                var wrapper = createHtmlElement(element);
                var $wrapper = $(wrapper).addClass(opt);

                return $wrapper;
            },
            createHtmlElement = function (element){
                element = '<' + element + '/>';

                return element;
            },
            Switch = function(e, $password, parent, opt){
                var $wrapper = addAddons($password, opt);
                var switchElement = createHtmlElement(opt.HtmlElement);
                var switchbutton = $(switchElement)
                    .addClass(opt.classes.switch)
                    .addClass(opt.classes.icon)
                    .addClass(opt.classes.show);

                $wrapper.append(switchbutton);
                var $switch = $wrapper.children();

                $switch.bind('click', function () {
                    $password.focus();
                    if ($switch.hasClass(opt.classes.show)) {
                        $password.attr('type', 'text');
                        $switch.removeClass(opt.classes.show).addClass(opt.classes.hide);
                    } else {
                        $password.attr('type', 'password');
                        $switch.removeClass(opt.classes.hide).addClass(opt.classes.show);
                    }
                });
            },
            Strenght = function(e,$password, parent, opt){
                $password.bind('keyup focus input propertychange mouseup', function() {
                    var password = $password.val();
                    var complexity = 0, valid = false;
                    var parentNode = '.' + opt.parentNode;
                    var $inputParent = $password.parents(parentNode);

                    $inputParent.addClass(opt.classes.password);

                    // Add character complexity
                    for (var i = charsets.length - 1; i >= 0; i--) {
                        complexity += Score(password, charsets[i]);
                    }

                    // Use natural log to produce linear scale
                    complexity = Math.log(Math.pow(complexity, password.length)) * (1 / opt.strenght.ScaleFactor);

                    valid = (complexity > min_point && password.length >= opt.strenght.MinimumChars);

                    // Scale to percentage, so it can be used for a progress bar
                    complexity = (complexity / max_point) * 100;
                    complexity = (complexity > 100) ? 100 : complexity;

                    var $element = createHtmlElement(opt.HtmlElement);
                    var progressBarClass = '.' + opt.classes.progressbar;
                    var $progressBar = null;

                    if($password.parent().find(progressBarClass).length === 0) {
                        $password.parent().append($($element));
                        $progressBar = $password.siblings().last();
                        $progressBar.addClass(opt.classes.progressbar);
                    }else{
                        $progressBar = $password.siblings().last();
                    }

                    $progressBar.toggleClass(opt.classes.progressbarSuccess, valid);
                    $progressBar.toggleClass(opt.classes.progressbarDanger, !valid);
                    $progressBar.css({'width': complexity + '%'});
                });
            },
            Score = function (str, charset) {
                for (var i = str.length - 1; i >= 0; i--) {
                    if (charset[0] <= str.charCodeAt(i) && str.charCodeAt(i) <= charset[1]) {
                        return charset[1] - charset[0] + 1;
                    }
                }
                return 0;
            };
        return {
            init: function (opt) {
                opt = $.extend({}, defaults, opt || {});

                //For each selected DOM element
                return this.each(function () {
                    var event = this;
                    var $input = $(event);
                    var options = $.extend({}, opt);
                    var parentNode = '.' + options.parentNode;
                    var $inputParent = $input.parents(parentNode);
                    var $inputlabel = $inputParent.children('label');
                    var cls = options.classes;
                    var modules = options.modules;

                    if($input.attr('type') === 'password') {
                        modules.forEach(function(index) {
                            if (index === 'passwordswitch') {
                                Switch(event, $input, parentNode, options);
                            }
                            if (index === 'passwordstrenght') {
                                Strenght(event, $input, parentNode, options);
                            }
                        });
                    }
                });
            }
        };
    }();

    $.fn.extend({
        origamPassword: origamPassword.init
    });

})(jQuery, window);


/**
 * Apply origamPassword on input elements (in a jQuery object) eq. $('input[type=phone]').
 * Allow you to format phone with country.
 * Add country select and format number to specific country you selected.
 * @param  {obj} options :
 *     - classes : You can change default classes of element
 *          - addonsLeft :
 *          - addonsRight :
 *          - wrapper :
 *          - phone :
 *          - selected :
 *          - items :
 *          - icon :
 *          - show :
 *          - hide :
 *          - group :
 *          - flagicon :
 *          - flagPrefix :
 *          - flagPrefix :
 *          - selectValue :
 *          - selectList :
 *          - selectedFlag :
 *          - selectedValue :
 *     - parentNode : You can define parent
 *     - HtmlElement :
 *     - AddonHtmlElement :
 *     - buttonHtmlElement :
 *     - flagHtmlElement :
 *     - itemsHtmlElement :
 *     - AdddAfter :
 *     - autoFormat :
 *     - autoPlaceholder :
 *     - defaultCountry :
 *     - onlyCountries :
 *     - preferredCountries :
 */

(function ($, w) {

    var origamPhone = function () {
        var
            defaults = {
                classes: {
                    addonsLeft: 'text-field--addons left',
                    addonsRight: 'text-field--addons right',
                    wrapper: 'text-field--group__addons',
                    phone: 'text-field--phone',
                    selected: 'selectcountry-selected',
                    items: 'selectcountry-select',
                    icon: 'origamicon',
                    group : 'text-field--group__selectcountry',
                    Show: 'origamicon-angle-down',
                    Hide: 'origamicon-angle-up',
                    flagicon: 'flag-icon',
                    flagPrefix: 'flag-',
                    selectFlag: 'selectcountry-select--list__icon',
                    selectValue: 'selectcountry-select--list__value',
                    selectList: 'selectcountry-select--list',
                    selectedFlag: 'selectcountry-selected--icon',
                    selectedValue: 'selectcountry-selected--value'
                },
                parentNode: 'text-field',
                HtmlElement: 'span',
                AddonHtmlElement : 'div',
                buttonHtmlElement : 'div',
                flagHtmlElement: 'i',
                itemsHtmlElement: 'div',
                AdddAfter: true,
                autoFormat: true,
                autoPlaceholder: true,
                defaultCountry: "",
                onlyCountries: [],
                preferredCountries: [ "US", "GB", "FR" ],
            },
            countries = {
                "AF": "Afghanistan",
                "AL": "Albania",
                "DZ": "Algeria",
                "AS": "American Samoa",
                "AD": "Andorra",
                "AO": "Angola",
                "AI": "Anguilla",
                "AG": "Antigua and Barbuda",
                "AR": "Argentina",
                "AM": "Armenia",
                "AW": "Aruba",
                "AU": "Australia",
                "AT": "Austria",
                "AZ": "Azerbaijan",
                "BS": "Bahamas",
                "BH": "Bahrain",
                "BD": "Bangladesh",
                "BB": "Barbados",
                "BY": "Belarus",
                "BE": "Belgium",
                "BZ": "Belize",
                "BJ": "Benin",
                "BM": "Bermuda",
                "BT": "Bhutan",
                "BO": "Bolivia, Plurinational State of",
                "BA": "Bosnia and Herzegovina",
                "BW": "Botswana",
                "BV": "Bouvet Island",
                "BR": "Brazil",
                "IO": "British Indian Ocean Territory",
                "BN": "Brunei Darussalam",
                "BG": "Bulgaria",
                "BF": "Burkina Faso",
                "BI": "Burundi",
                "KH": "Cambodia",
                "CM": "Cameroon",
                "CA": "Canada",
                "CV": "Cape Verde",
                "KY": "Cayman Islands",
                "CF": "Central African Republic",
                "TD": "Chad",
                "CL": "Chile",
                "CN": "China",
                "CO": "Colombia",
                "KM": "Comoros",
                "CG": "Congo",
                "CD": "Congo, the Democratic Republic of the",
                "CK": "Cook Islands",
                "CR": "Costa Rica",
                "CI": "CÃ´te d'Ivoire",
                "HR": "Croatia",
                "CU": "Cuba",
                "CW": "CuraÃ§ao",
                "CY": "Cyprus",
                "CZ": "Czech Republic",
                "DK": "Denmark",
                "DJ": "Djibouti",
                "DM": "Dominica",
                "DO": "Dominican Republic",
                "EC": "Ecuador",
                "EG": "Egypt",
                "SV": "El Salvador",
                "GQ": "Equatorial Guinea",
                "ER": "Eritrea",
                "EE": "Estonia",
                "ET": "Ethiopia",
                "FK": "Falkland Islands (Malvinas)",
                "FO": "Faroe Islands",
                "FJ": "Fiji",
                "FI": "Finland",
                "FR": "France",
                "GF": "French Guiana",
                "PF": "French Polynesia",
                "TF": "French Southern Territories",
                "GA": "Gabon",
                "GM": "Gambia",
                "GE": "Georgia",
                "DE": "Germany",
                "GH": "Ghana",
                "GI": "Gibraltar",
                "GR": "Greece",
                "GL": "Greenland",
                "GD": "Grenada",
                "GP": "Guadeloupe",
                "GU": "Guam",
                "GT": "Guatemala",
                "GG": "Guernsey",
                "GN": "Guinea",
                "GW": "Guinea-Bissau",
                "GY": "Guyana",
                "HT": "Haiti",
                "HM": "Heard Island and McDonald Islands",
                "VA": "Holy See (Vatican City State)",
                "HN": "Honduras",
                "HK": "Hong Kong",
                "HU": "Hungary",
                "IS": "Iceland",
                "IN": "India",
                "ID": "Indonesia",
                "IR": "Iran, Islamic Republic of",
                "IQ": "Iraq",
                "IE": "Ireland",
                "IM": "Isle of Man",
                "IL": "Israel",
                "IT": "Italy",
                "JM": "Jamaica",
                "JP": "Japan",
                "JE": "Jersey",
                "JO": "Jordan",
                "KZ": "Kazakhstan",
                "KE": "Kenya",
                "KI": "Kiribati",
                "KP": "Korea, Democratic People's Republic of",
                "KR": "Korea, Republic of",
                "KW": "Kuwait",
                "KG": "Kyrgyzstan",
                "LA": "Lao People's Democratic Republic",
                "LV": "Latvia",
                "LB": "Lebanon",
                "LS": "Lesotho",
                "LR": "Liberia",
                "LY": "Libya",
                "LI": "Liechtenstein",
                "LT": "Lithuania",
                "LU": "Luxembourg",
                "MO": "Macao",
                "MK": "Macedonia, the former Yugoslav Republic of",
                "MG": "Madagascar",
                "MW": "Malawi",
                "MY": "Malaysia",
                "MV": "Maldives",
                "ML": "Mali",
                "MT": "Malta",
                "MH": "Marshall Islands",
                "MQ": "Martinique",
                "MR": "Mauritania",
                "MU": "Mauritius",
                "YT": "Mayotte",
                "MX": "Mexico",
                "FM": "Micronesia, Federated States of",
                "MD": "Moldova, Republic of",
                "MC": "Monaco",
                "MN": "Mongolia",
                "ME": "Montenegro",
                "MS": "Montserrat",
                "MA": "Morocco",
                "MZ": "Mozambique",
                "MM": "Myanmar",
                "NA": "Namibia",
                "NR": "Nauru",
                "NP": "Nepal",
                "NL": "Netherlands",
                "NC": "New Caledonia",
                "NZ": "New Zealand",
                "NI": "Nicaragua",
                "NE": "Niger",
                "NG": "Nigeria",
                "NU": "Niue",
                "NF": "Norfolk Island",
                "MP": "Northern Mariana Islands",
                "NO": "Norway",
                "OM": "Oman",
                "PK": "Pakistan",
                "PW": "Palau",
                "PS": "Palestinian Territory, Occupied",
                "PA": "Panama",
                "PG": "Papua New Guinea",
                "PY": "Paraguay",
                "PE": "Peru",
                "PH": "Philippines",
                "PN": "Pitcairn",
                "PL": "Poland",
                "PT": "Portugal",
                "PR": "Puerto Rico",
                "QA": "Qatar",
                "RE": "RÃ©union",
                "RO": "Romania",
                "RU": "Russian Federation",
                "RW": "Rwanda",
                "SH": "Saint Helena, Ascension and Tristan da Cunha",
                "KN": "Saint Kitts and Nevis",
                "LC": "Saint Lucia",
                "MF": "Saint Martin (French part)",
                "PM": "Saint Pierre and Miquelon",
                "VC": "Saint Vincent and the Grenadines",
                "WS": "Samoa",
                "SM": "San Marino",
                "ST": "Sao Tome and Principe",
                "SA": "Saudi Arabia",
                "SN": "Senegal",
                "RS": "Serbia",
                "SC": "Seychelles",
                "SL": "Sierra Leone",
                "SG": "Singapore",
                "SX": "Sint Maarten (Dutch part)",
                "SK": "Slovakia",
                "SI": "Slovenia",
                "SB": "Solomon Islands",
                "SO": "Somalia",
                "ZA": "South Africa",
                "GS": "South Georgia and the South Sandwich Islands",
                "SS": "South Sudan",
                "ES": "Spain",
                "LK": "Sri Lanka",
                "SD": "Sudan",
                "SR": "Suriname",
                "SZ": "Swaziland",
                "SE": "Sweden",
                "CH": "Switzerland",
                "SY": "Syrian Arab Republic",
                "TW": "Taiwan, Province of China",
                "TJ": "Tajikistan",
                "TZ": "Tanzania, United Republic of",
                "TH": "Thailand",
                "TL": "Timor-Leste",
                "TG": "Togo",
                "TK": "Tokelau",
                "TO": "Tonga",
                "TT": "Trinidad and Tobago",
                "TN": "Tunisia",
                "TR": "Turkey",
                "TM": "Turkmenistan",
                "TC": "Turks and Caicos Islands",
                "TV": "Tuvalu",
                "UG": "Uganda",
                "UA": "Ukraine",
                "AE": "United Arab Emirates",
                "GB": "United Kingdom",
                "US": "United States",
                "UM": "United States Minor Outlying Islands",
                "UY": "Uruguay",
                "UZ": "Uzbekistan",
                "VU": "Vanuatu",
                "VE": "Venezuela, Bolivarian Republic of",
                "VN": "Viet Nam",
                "VG": "Virgin Islands, British",
                "VI": "Virgin Islands, U.S.",
                "WF": "Wallis and Futuna",
                "EH": "Western Sahara",
                "YE": "Yemen",
                "ZM": "Zambia",
                "ZW": "Zimbabwe"
            },
            /**
             * Global Functions
             */
            generateId = function(length) {
                var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
                if (!length) {
                    length = Math.floor(Math.random() * chars.length);
                }
                var str = '';
                for (var i = 0; i < length; i++) {
                    str += chars[Math.floor(Math.random() * chars.length)];
                }
                return str;
            },
            addAddons = function($element,opt){
                var parentNode = '.' + opt.parentNode;
                var classPosition = '';
                optAddonsPosition = opt.AdddAfter;
                optAddonsPosition ? classPosition = opt.classes.addonsRight : opt.classes.addonsLeft;

                $element.parents(parentNode).addClass(classPosition);

                var wrapper = addWrapper(opt.AddonHtmlElement,opt.classes.wrapper);

                if(optAddonsPosition) {
                    $element.after(wrapper);
                    return ($element.next());
                }
                else{
                    $element.before(wrapper);
                    return ($element.prev());
                }
            },
            addWrapper = function(element, opt){
                var wrapper = createHtmlElement(element);
                var $wrapper = $(wrapper).addClass(opt);

                return $wrapper;
            },
            createHtmlElement = function (element){
                element = '<' + element + '/>';

                return element;
            },
            Select = function (plugin, htmlSelectId, opt) {
                var selectHtml = createHtmlElement('select');
                var optionHtml = createHtmlElement('option');
                var htmlSelectElement = $(selectHtml)
                    .attr('id', htmlSelectId)
                    .attr('name', plugin.settings.inputName);

                $.each(plugin.countries, function (code, country) {
                    var optionAttributes = {value: code};
                    if (plugin.settings.selectedCountry !== undefined) {
                        if (plugin.settings.selectedCountry === code) {
                            optionAttributes = {value: code, selected: "selected"};
                            plugin.selected = {value: code, text: code}
                        }
                    }
                    htmlSelectElement.append($(optionHtml, optionAttributes).text(country));
                });

                return htmlSelectElement;
            },
            Button = function (plugin, uniqueId, htmlSelect, opt) {

                var selectedText = $(htmlSelect).find('option').first().text();
                var selectedValue = $(htmlSelect).find('option').first().val();
                var buttonHtml = createHtmlElement(opt.buttonHtmlElement);
                var textHtml = createHtmlElement(opt.HtmlElement);
                var flagHtml = createHtmlElement(opt.flagHtmlElement);

                var $selectedLabel = $(flagHtml)
                    .addClass(opt.classes.selectedFlag)
                    .addClass(opt.classes.flagicon)
                    .addClass(opt.classes.flagPrefix + selectedValue.toLowerCase());;
                selectedText = $(textHtml)
                    .addClass(opt.classes.selectedValue)
                    .html( plugin.selected.value || selectedText );

                selectedValue = plugin.selected.value || selectedValue;

                var button = $(buttonHtml)
                    .addClass(opt.classes.selected)
                    .attr('id', 'selectcountry-' + uniqueId)
                    .attr('data-value', selectedValue)
                    .html($selectedLabel)
                    .append(selectedText);

                return button;

            },
            ItemList = function (plugin, uniqueId, htmlSelect, opt) {
                var itemsHtml = createHtmlElement(opt.itemsHtmlElement);
                var textHtml = createHtmlElement(opt.HtmlElement);
                var flagHtml = createHtmlElement(opt.flagHtmlElement);
                var linkHtml = createHtmlElement('a');

                var items = $(itemsHtml)
                    .attr('id', 'selectcountry-' + uniqueId + '-list')
                    .addClass(opt.classes.items)
                    .addClass('hide');

                // Populate the bootstrap dropdown item list
                $(htmlSelect).find('option').each(function () {

                    // Get original select option values and labels
                    var title = $(this).text();
                    var value = $(this).val();
                    var text = title;
                    var $element = $(textHtml)
                        .addClass(opt.classes.selectValue)
                        .html(text);

                    // Build the flag icon
                    var flagIcon = $(flagHtml)
                        .addClass(opt.classes.selectFlag)
                        .addClass(opt.classes.flagicon)
                        .addClass(opt.classes.flagPrefix + value.toLowerCase());

                    // Build a clickable drop down option item, insert the flag and label, attach click event
                    var flagItem = $(linkHtml)
                        .attr('data-val', value)
                        .attr('title', title)
                        .html(flagIcon)
                        .append($element)
                        .on('click', function (e) {
                            $(htmlSelect).find('option').removeAttr('selected');
                            $(htmlSelect).find('option[value="' + $(this).data('val') + '"]').attr("selected", "selected");
                            $('.selectcountry-selected').html($(this).html());
                            e.preventDefault();
                        });

                    // Make it a list item
                    var listItem = $(itemsHtml).addClass(opt.classes.selectList).prepend(flagItem);

                    // Append it to the drop down item list
                    items.append(listItem);

                });

                return items;
            };
        return {
            init: function (opt) {
                opt = $.extend({}, defaults, opt || {});

                //For each selected DOM element
                return this.each(function () {
                    var event = this;
                    var $input = $(event);
                    var options = $.extend({}, opt);
                    var parentNode = '.' + options.parentNode;
                    var $inputParent = $input.parents(parentNode);
                    var $inputlabel = $inputParent.children('label');
                    var cls = options.classes;

                    if($input.attr('type') === 'phone') {

                        var select = createHtmlElement(opt.HtmlElement);
                        var $wrapper = addAddons($input, opt).append($(select));
                        var plugin = this;
                        var $container = $wrapper.children();

                        var uniqueId = generateId(8);

                        plugin.countries = {};
                        plugin.selected = {value: null, text: null};
                        plugin.settings = {inputName: 'country-' + uniqueId};

                        var htmlSelectId = 'selectcountry-' + uniqueId;
                        var htmlSelect = '#' + htmlSelectId;

                        // Merge in global settings then merge in individual settings via data attributes
                        plugin.countries = countries;

                        if (undefined !== plugin.settings.countries) {
                            plugin.countries = plugin.settings.countries;
                        }

                        // Build HTML Select, Construct the drop down button, Assemble the drop down list items element and insert
                        $container
                            .addClass(opt.classes.group)
                            .addClass(opt.classes.icon)
                            .addClass(opt.classes.Show)
                            .append(Select(plugin, htmlSelectId, options))
                            .append(Button(plugin, uniqueId, htmlSelect, options));

                        $inputParent.append(ItemList(plugin, uniqueId, htmlSelect, options))

                        var $button = $('.selectcountry-selected');

                        $button.bind('click', function(){
                            var button = $(this);
                            var id = $(this).attr('id');
                            var $list = $('#' +  id + '-list');
                        });

                        // Hide the actual HTML select
                        $(htmlSelect).hide();
                    }
                });
            }
        };
    }();

    $.fn.extend({
        origamPhone: origamPhone.init
    });

})(jQuery, window);


/**
 * Apply origamPopover
 */


/**
 * Apply origamRipple
 */

(function ($, w) {

    var origamRipple = function () {

        var
            defaults = {};

        return {
            init: function (opt) {
                opt = $.extend({}, defaults, opt || {});

                //For each selected DOM element
                return this.each(function () {
                    var event = this;
                    var $element = $(event);
                    var options = $.extend({}, opt);

                    $element
                        .css({
                            position: 'relative',
                            overflow: 'hidden'
                        })
                        .bind('mousedown', function(e) {
                            var ripple;

                            if ($element.find('.ripple').length === 0) {

                                ripple = $('<span/>').addClass('ripple');

                                if ($element.attr('data-ripple'))
                                {
                                    ripple.addClass('ripple-' + $element.attr('data-ripple'));
                                }

                                $element.prepend(ripple);
                            }
                            else
                            {
                                ripple = $element.find('.ripple');
                            }

                            ripple.removeClass('ripple-is--animated');

                            if (!ripple.height() && !ripple.width())
                            {
                                var diameter = Math.max($element.outerWidth(), $element.outerHeight());

                                ripple.css({ height: diameter, width: diameter });
                            }

                            var x = e.pageX - $element.offset().left - ripple.width() / 2;
                            var y = e.pageY - $element.offset().top - ripple.height() / 2;

                            ripple.css({ top: y+'px', left: x+'px' }).addClass('ripple-is--animated');

                            setTimeout(function()
                            {
                                ripple.removeClass('ripple-is--animated');
                            }, 651);
                        });
                });
            }
        };

    }();

    $.fn.extend({
        origamRipple: origamRipple.init
    });

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


/**
 * Apply origamTooltip
 */


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


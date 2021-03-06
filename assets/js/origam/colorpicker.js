
/**
 * Apply origamColorPicker
 */

(function ($, w) {

    'use strict';

    // COLORPICKER PUBLIC CLASS DEFINITION
    // ===============================

    var Colorpicker = function (element, options) {
        this.type = null;
        this.options = null;
        this.$element = null;

        this.init('colorpicker', element, options)
    };

    // COLOR CONVERTION PUBLIC FUNCTIONS
    // ===============================
    var hexToRgb = function (hex) {
            var hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);
            return {
                r: hex >> 16,
                g: (hex & 0x00FF00) >> 8,
                b: (hex & 0x0000FF)
            };
        },

        hsbToHex = function (hsb) {
            return rgbToHex(hsbToRgb(hsb));
        },

        hexToHsb = function (hex) {
            return rgbToHsb(hexToRgb(hex));
        },

        rgbToHsb = function (rgb) {
            var hsb = {h: 0, s: 0, b: 0};
            var min = Math.min(rgb.r, rgb.g, rgb.b);
            var max = Math.max(rgb.r, rgb.g, rgb.b);
            var delta = max - min;
            hsb.b = max;
            hsb.s = max != 0 ? 255 * delta / max : 0;
            if (hsb.s != 0) {
                if (rgb.r == max) hsb.h = (rgb.g - rgb.b) / delta;
                else if (rgb.g == max) hsb.h = 2 + (rgb.b - rgb.r) / delta;
                else hsb.h = 4 + (rgb.r - rgb.g) / delta;
            } else hsb.h = -1;
            hsb.h *= 60;
            if (hsb.h < 0) hsb.h += 360;
            hsb.s *= 100 / 255;
            hsb.b *= 100 / 255;
            return hsb;
        },

        hsbToRgb = function (hsb) {
            var rgb = {};
            var h = hsb.h;
            var s = hsb.s * 255 / 100;
            var v = hsb.b * 255 / 100;
            if (s == 0) {
                rgb.r = rgb.g = rgb.b = v;
            } else {
                var t1 = v;
                var t2 = (255 - s) * v / 255;
                var t3 = (t1 - t2) * (h % 60) / 60;
                if (h == 360) h = 0;
                if (h < 60) {
                    rgb.r = t1;
                    rgb.b = t2;
                    rgb.g = t2 + t3
                }
                else if (h < 120) {
                    rgb.g = t1;
                    rgb.b = t2;
                    rgb.r = t1 - t3
                }
                else if (h < 180) {
                    rgb.g = t1;
                    rgb.r = t2;
                    rgb.b = t2 + t3
                }
                else if (h < 240) {
                    rgb.b = t1;
                    rgb.r = t2;
                    rgb.g = t1 - t3
                }
                else if (h < 300) {
                    rgb.b = t1;
                    rgb.g = t2;
                    rgb.r = t2 + t3
                }
                else if (h < 360) {
                    rgb.r = t1;
                    rgb.g = t2;
                    rgb.b = t1 - t3
                }
                else {
                    rgb.r = 0;
                    rgb.g = 0;
                    rgb.b = 0
                }
            }
            return {
                r: Math.round(rgb.r),
                g: Math.round(rgb.g),
                b: Math.round(rgb.b)
            };
        },

        rgbToHex = function (rgb) {
            var hex = [
                rgb.r.toString(16),
                rgb.g.toString(16),
                rgb.b.toString(16)
            ];
            $.each(hex, function (nr, val) {
                if (val.length == 1) {
                    hex[nr] = '0' + val;
                }
            });
            return hex.join('');
        },

        // COLOR FIX FORMAT PUBLIC FUNCTIONS
        // ===============================
        fixHSB = function (hsb) {
            return {
                h: Math.min(360, Math.max(0, hsb.h)),
                s: Math.min(100, Math.max(0, hsb.s)),
                b: Math.min(100, Math.max(0, hsb.b))
            };
        },

        fixRGB = function (rgb) {
            return {
                r: Math.min(255, Math.max(0, rgb.r)),
                g: Math.min(255, Math.max(0, rgb.g)),
                b: Math.min(255, Math.max(0, rgb.b))
            };
        },

        fixHex = function (hex) {
            var len = 6 - hex.length;
            if (len > 0) {
                var o = [];
                for (var i = 0; i < len; i++) {
                    o.push('0');
                }
                o.push(hex);
                hex = o.join('');
            }
            return hex;
        };

    if (!$.fn.input) throw new Error('Colorpicker requires input.js');

    Colorpicker.VERSION = '0.1.0';

    Colorpicker.TRANSITION_DURATION = 1000;

    Colorpicker.DEFAULTS = $.extend({}, $.fn.input.Constructor.DEFAULTS, {
        templateWrapper: '<div class="origam-colorpick"></div>',
        templateColor: '<div class="origam-colorpick--color"></div>',
        templateColorSelector: '<div class="origam-colorpick--selector_outer"><div class="origam-colorpick--selector_inner"></div></div>',
        templateHue: '<div class="origam-colorpick--hue"></div>',
        templateHueSelector: '<div class="origam-colorpick--hue_arrs"><div class="origam-colorpick--hue_larr"></div><div class="origam-colorpick--hue_rarr"></div></div>',
        templateForm: '<div class="origam-colorpick--form"></div>',
        templateSubmit: '<div class="origam-colorpick--submit btn btn-ghost"></div>',
        templateNewColor: '<div class="origam-colorpick--new_color"></div>',
        templateOriginColor: '<div class="origam-colorpick--current_color"></div>',
        templateWrapperField: '<div class="origam-colorpick--field text-field text-field--addons left"><div class="text-field--group"></div></div>',
        templateLabelField: '<div class="origam-colorpick--field_letter text-field--group__addons"></div>',
        templateField: '<input data-form="input" type="number" min="0" max="" />',
        templateColorElement: '<div class="text-field--color_current"></div>',
        templateOverlay: '<div class="origam-overlay"></div>',
        classes: {
            focus: 'text-field--focused',
            active: 'text-field--active',
            addonsLeft: 'text-field--addons left',
            addonsRight: 'text-field--addons right',
            field: 'text-field--group__input',
            parent: 'text-field--color'
        },
        color: 'FF0000',
        livepreview: true,
        layout: 'full',
        submittext: 'OK',
        format: '#',
        height: 230
    });

    Colorpicker.prototype = $.extend({}, $.fn.input.Constructor.prototype);

    Colorpicker.prototype.constructor = Colorpicker;

    /**
     * @Implement event
     *
     * @define Add event to input. This input Event make colorpicker
     *
     * @param options
     *
     * @returns {Colorpicker}
     */
    Colorpicker.prototype.event = function (options) {
        // Init colorpicker object
        this.options = this.getOptions(options);
        this.field = new Array();
        this.fields = {
            'hex': {
                'class': 'origam-colorpick--hex_field',
                'label': '#',
                'type': 'text',
                'maxlenght': 6,
                'size': 6
            },
            'origin': {
                'class': 'origam-colorpick--origin_field',
                'label': '#'
            },
            'rgb_r': {
                'class': 'origam-colorpick--rgb_r',
                'label': 'R',
                'max': '255'
            },
            'hsb_h': {
                'class': 'origam-colorpick--hsb_h',
                'label': 'H',
                'max': '360'
            },
            'rgb_g': {
                'class': 'origam-colorpick--rgb_g',
                'label': 'G',
                'max': '255'
            },
            'hsb_s': {
                'class': 'origam-colorpick--hsb_s',
                'label': 'S',
                'max': '100'
            },
            'rgb_b': {
                'class': 'origam-colorpick--rgb_b',
                'label': 'B',
                'max': '255'
            },
            'hsb_b': {
                'class': 'origam-colorpick--hsb_b',
                'label': 'B',
                'max': '100'
            }
        };

        this.$element.data('origam-colorpickId', this.id);

        // Convert default color to HSB color
        if (typeof this.options.color == 'string') {
            this.options.color = hexToHsb(this.options.color);
        } else if (this.options.color.r != undefined && this.options.color.g != undefined && this.options.color.b != undefined) {
            this.options.color = rgbToHsb(this.options.color);
        } else if (this.options.color.h != undefined && this.options.color.s != undefined && this.options.color.b != undefined) {
            this.options.color = fixHSB(this.options.color);
        } else {
            return this;
        }

        // Create colorpicker
        this.$overlay = $(this.options.templateOverlay);
        this.origColor = this.$element.val() ? this.$element.val() : this.options.color;

        this.$colorpick = $(this.options.templateWrapper)
            .attr('id', this.id)
            .addClass('origam-colorpick--' + this.options.layout);

        this.$submitField = $(this.options.templateSubmit).attr('data-target', '#' + this.id);

        this.$form = $(this.options.templateForm);
        this.$currentColor = $(this.options.templateOriginColor);
        this.$newColor = $(this.options.templateNewColor);

        this.$selector = $(this.options.templateColor).css({
            'height': this.options.height,
            'width': this.options.height
        });
        this.$selectorIndic = $(this.options.templateColorSelector);

        this.$hue = $(this.options.templateHueSelector);
        this.$huebar = $(this.options.templateHue).append(this.$hue);

        this.options.placement = 'before';
        this.$wrapper = this.addAddon();
        this.$wrapper.text(this.options.format);

        this.$color = $(this.options.templateColorElement);

        this.$output = $('<div/>').addClass(this.classes.field);

        // Define input event
        this.$element
            .after(this.$output)
            .parents(this.$parent)
            .addClass(this.classes.parent)
            .on('click', $.proxy(this.show, this))
            .prepend(this.$color);

        // Centering modal if window is resize
        $(w).on('resize', $.proxy(this.moveModal(this.$colorpick), this));
    };

    Colorpicker.prototype.getDefaults = function () {
        return Colorpicker.DEFAULTS
    };

    /**
     * @Implement submit
     *
     * @param e
     */
    Colorpicker.prototype.submit = function (e) {
        this.origColor = this.options.color;
        this.setCurrentColor(this.options.color);
        this.setOrigineFields(this.options.color);
        this.setElement(this.options.color);
    };

    /**
     * @Implement createSelector
     *
     * @definition Create saturation/brightness selector
     *
     */
    Colorpicker.prototype.createSelector = function () {
        this.$selector
            .html('')
            .on('mousedown touchstart', $.proxy(this.eventSelector, this))
            .append('<div class="origam-colorpick--color_overlay1"><div class="origam-colorpick--color_overlay2"></div></div>')
            .children().children().append(this.$selectorIndic);
    };

    /**
     * @Implement createHue
     *
     * @definition Create hue selector
     *
     */
    Colorpicker.prototype.createHue = function () {
        var UA = navigator.userAgent.toLowerCase(),
            isIE = navigator.appName === 'Microsoft Internet Explorer',
            IEver = isIE ? parseFloat(UA.match(/msie ([0-9]{1,}[\.0-9]{0,})/)[1]) : 0,
            ngIE = ( isIE && IEver < 10 ),
            stops = ['#ff0000', '#ff0080', '#ff00ff', '#8000ff', '#0000ff', '#0080ff', '#00ffff', '#00ff80', '#00ff00', '#80ff00', '#ffff00', '#ff8000', '#ff0000'];

        this.$huebar.html('');

        if (ngIE) {
            var i;
            for (i = 0; i <= 11; i++) {
                $('<div>')
                    .attr('style', 'height:8.333333%; filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr=' + stops[i] + ', endColorstr=' + stops[i + 1] + '); -ms-filter: "progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr=' + stops[i] + ', endColorstr=' + stops[i + 1] + ')";')
                    .appendTo(this.$huebar);
            }
        } else {
            var stopList = stops.join(',');
            this.$huebar.attr('style', 'background:-webkit-linear-gradient(top,' + stopList + '); background: -o-linear-gradient(top,' + stopList + '); background: -ms-linear-gradient(top,' + stopList + '); background:-moz-linear-gradient(top,' + stopList + '); -webkit-linear-gradient(top,' + stopList + '); background:linear-gradient(to bottom,' + stopList + '); ');
        }

        this.$huebar
            .on('mousedown touchstart', $.proxy(this.eventHue, this))
            .height(this.options.height);
    };

    /**
     * @Implement createForm
     *
     * @definition Create input form to select color with HEX color,
     * HSB color or RGB color.
     * Form contain original color and current color, you can come back to your
     * origin color when you click on.
     */

    Colorpicker.prototype.createForm = function() {
        var count = 0;

        this.$form
            .html('')
            .append(this.$newColor);

        this.$currentColor
            .on("click", $.proxy(this.restoreOriginal, this))
            .appendTo(this.$form);

        for (var i in this.fields) {
            var $wrapper = $(this.options.templateWrapperField),
                $label = $(this.options.templateLabelField),
                $field = $(this.options.templateField);

            $label
                .text(this.fields[i]['label'])
                .appendTo($wrapper.children());

            if (i === 'hex') {
                $field
                    .attr('type', this.fields[i]['type'])
                    .attr('maxlenght', this.fields[i]['maxlenght'])
                    .attr('size', this.fields[i]['size']);
            }
            else if (i === 'origin') {
                $field = $('<div>');
                $wrapper.addClass('text-field--disabled');
            }
            else {
                $field.attr('max', this.fields[i]['max']);
            }

            this.field[count] = $field
                .on('focusin', $.proxy(this.startFocus, this))
                .on('focusout', $.proxy(this.endFocus, this))
                .on('change', $.proxy(this.eventField, this))
                .addClass(this.classes.field)
                .appendTo($wrapper.children());

            $wrapper
                .addClass(this.fields[i]['class'])
                .appendTo(this.$form);

            count++;
        }

        this.$submitField
            .text(this.options.submittext)
            .on("click", $.proxy(this.submit, this))
            .appendTo(this.$form);

    };

    /**
     * @Implement change
     *
     * @definition When you change form field value, set value to selector,
     * hue and other form field to match them.
     *
     * @param field
     */
    Colorpicker.prototype.change = function(field) {

        if (field.parents(this.$parent).attr('class').indexOf('--hex') > 0) {
            this.options.color = hexToHsb(fixHex(this.field[0].val()));
            this.fillRGBFields(this.options.color);
            this.fillHSBFields(this.options.color);
        } else if (field.parents(this.$parent).attr('class').indexOf('--hsb') > 0) {
            this.options.color = fixHSB({
                h: this.field[3].val(),
                s: this.field[5].val(),
                b: this.field[7].val()
            });
            this.fillRGBFields(this.options.color);
            this.fillHexFields(this.options.color);
        } else {
            this.options.color= rgbToHsb(fixRGB({
                r: this.field[2].val(),
                g: this.field[4].val(),
                b: this.field[6].val()
            }));
            this.fillHexFields(this.options.color);
            this.fillHSBFields(this.options.color);
        }

        this.setSelector(this.options.color);
        this.setHue(this.options.color);
        this.setNewColor(this.options.color);
    };

    /**
     * @Implement eventField
     *
     * @definition Add event to all field
     *
     * @param e
     */
    Colorpicker.prototype.eventField = function (e){
        this.change($(e.currentTarget));
    };

    /**
     * @Implement eventSelector
     *
     * @definition Add event to selector
     *
     * @param e
     */
    Colorpicker.prototype.eventSelector = function (e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var offset      = 0,
            pageX       = ((e.type == 'touchstart') ? e.originalEvent.changedTouches[0].pageX : e.pageX ),
            pageY       = ((e.type == 'touchstart') ? e.originalEvent.changedTouches[0].pageY : e.pageY );

        if($(e.target).attr('class').indexOf('--color') > 0){
            offset = $(e.target).offset();
        }

        $(document).on('mouseup touchend',offset, $.proxy(this.updateSelector, this));
        $(document).on('mousemove touchmove',offset, $.proxy(this.moveSelector, this));

        this.field[5].val(parseInt(100*(Math.max(0,Math.min(this.options.height,(pageX - offset.left))))/this.options.height, 10));
        this.field[7].val(parseInt(100*(this.options.height - Math.max(0,Math.min(this.options.height,(pageY - offset.top))))/this.options.height, 10));

        this.change(this.field[5],this.field[7]);

        return false;
    };

    /**
     * @Implement moveSelector
     *
     * @definition Add event move to selector
     *
     * @param e
     */
    Colorpicker.prototype.moveSelector = function (e) {
        var offset      = 0,
            pageX       = ((e.type == 'touchmove') ? e.originalEvent.changedTouches[0].pageX : e.pageX ),
            pageY       = ((e.type == 'touchmove') ? e.originalEvent.changedTouches[0].pageY : e.pageY );

        if($(e.target).attr('class').indexOf('--color') > 0){
            offset = $(e.target).offset();
        }else {
            offset = $(e.target).parent().parent().offset();
        }

        this.field[5].val(parseInt(100*(Math.max(0,Math.min(this.options.height,(pageX - offset.left))))/this.options.height, 10));
        this.field[7].val(parseInt(100*(this.options.height - Math.max(0,Math.min(this.options.height,(pageY - offset.top))))/this.options.height, 10));

        this.change(this.field[5],this.field[7]);

        return false;
    };

    /**
     * @Implement updateSelector
     *
     * @definition Events ends
     *
     * @param e
     */
    Colorpicker.prototype.updateSelector = function (e) {
        $(document).off('mouseup touchend', $.proxy(this.updateSelector, this));
        $(document).off('mousemove touchmove', $.proxy(this.moveSelector, this));
        return false;
    };

    /**
     * @Implement eventHue
     *
     * @definition Add event to hue
     *
     * @param e
     */
    Colorpicker.prototype.eventHue = function (e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var offset      = 0,
            offsetTop   = 0,
            pageY       = ((e.type == 'touchstart') ? e.originalEvent.changedTouches[0].pageY : e.pageY );

        if($(e.target).hasClass('origam-colorpick--hue')){
            offsetTop = $(e.target).offset().top;
        }

        offset =  pageY - offsetTop;

        $(document).on('mouseup touchend', offsetTop, $.proxy(this.updateHue, this));
        $(document).on('mousemove touchmove', offsetTop, $.proxy(this.moveHue, this));

        this.field[3].val(parseInt(Math.round(360*(this.options.height - Math.max(0,Math.min(this.options.height,offset)))/this.options.height), 10));

        this.change(this.field[3]);

        return false;
    };

    /**
     * @Implement moveHue
     *
     * @definition Add event move to hue
     *
     * @param e
     */
    Colorpicker.prototype.moveHue = function (e) {
        var offset      = 0,
            offsetTop   = 0,
            pageY       = ((e.type == 'touchmove') ? e.originalEvent.changedTouches[0].pageY : e.pageY );

        if($(e.target).hasClass('origam-colorpick--hue')){
            offsetTop = $(e.target).offset().top;
        }else if($(e.target).parent().hasClass('origam-colorpick--hue')) {
            offsetTop = $(e.target).parent().offset().top;
        }

        offset =  pageY - offsetTop;

        this.field[3].val(parseInt(Math.round(360*(this.options.height - Math.max(0,Math.min(this.options.height,offset)))/this.options.height), 10));

        this.change(this.field[3]);

        return false;
    };

    /**
     * @Implement updateHue
     *
     * @definition Events ends
     *
     * @param e
     */
    Colorpicker.prototype.updateHue = function (e) {

        $(document).off('mouseup touchend', $.proxy(this.updateHue, this));
        $(document).off('mousemove touchmove',$.proxy(this.moveHue, this));
        return false;
    };

    /**
     * @Implement restoreOriginal
     *
     * @definition Restore original color to selector, hue and field
     *
     * @param e
     */
    Colorpicker.prototype.restoreOriginal = function(e) {
        var col = this.origColor;
        this.options.color = col;
        this.fillRGBFields(col);
        this.fillHSBFields(col);
        this.fillHexFields(col);
        this.setHue(col);
        this.setSelector(col);
        this.setCurrentColor(col);
        this.setNewColor(col);
    };

    /**
     * @Implement fillRGBFields
     *
     * @definition Set value to RGB fields
     *
     * @param hsb
     */
    Colorpicker.prototype.fillRGBFields = function  (hsb) {
        var rgb = hsbToRgb(hsb);
        this.field[2].val(rgb.r);
        this.field[4].val(rgb.g);
        this.field[6].val(rgb.b);
    };

    /**
     * @Implement fillHSBFields
     *
     * @definition Set value to HSB fields
     *
     * @param hsb
     */
    Colorpicker.prototype.fillHSBFields = function  (hsb) {
        this.field[3].val(Math.round(hsb.h));
        this.field[5].val(Math.round(hsb.s));
        this.field[7].val(Math.round(hsb.b));
    };

    /**
     * @Implement fillHexFields
     *
     * @definition Set value to HEX fields
     *
     * @param hsb
     */
    Colorpicker.prototype.fillHexFields = function (hsb) {
        this.field[0].val(hsbToHex(hsb));
    };

    /**
     * @Implement setHue
     *
     * @definition Set value to hue barre
     *
     * @param hsb
     */
    Colorpicker.prototype.setHue = function (hsb) {
        this.$hue.css('top', parseInt(this.options.height - this.options.height * hsb.h/360, 10));
    };

    /**
     * @Implement setSelector
     *
     * @definition Set value to selector
     *
     * @param hsb
     */
    Colorpicker.prototype.setSelector = function (hsb) {
        this.$selector.css('backgroundColor', '#' + hsbToHex({h: hsb.h, s: 100, b: 100}));
        this.$selectorIndic.css({
            left: parseInt(this.options.height * hsb.s/100, 10),
            top: parseInt(this.options.height * (100-hsb.b)/100, 10)
        });
    };

    /**
     * @Implement setCurrentColor
     *
     * @definition Set value to current color div
     *
     * @param hsb
     */
    Colorpicker.prototype.setCurrentColor = function (hsb) {
        this.$currentColor.css('backgroundColor', '#' + hsbToHex(hsb));
    };

    /**
     * @Implement setNewColor
     *
     * @definition Set value to new color div
     *
     * @param hsb
     */
    Colorpicker.prototype.setNewColor = function (hsb) {
        this.$newColor.css('backgroundColor', '#' + hsbToHex(hsb));
    };

    /**
     * @Implement setOrigineFields
     *
     * @definition Set value to original field
     *
     * @param hsb
     */
    Colorpicker.prototype.setOrigineFields = function (hsb) {
        this.field[1].text(hsbToHex(hsb));
    };

    /**
     * @Implement setElement
     *
     * @definition Set value to input
     *
     * @param hsb
     */
    Colorpicker.prototype.setElement = function (hsb) {
        var formatColor,
            rgb;

        if (this.options.format === 'rgb'){
            rgb = hsbToRgb(hsb);
            formatColor = '( ' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ') ';
        }
        else if (this.options.format === 'hsb') {
            formatColor = '( ' + hsb.h + ', ' + hsb.s + ', ' + hsb.b + ') ';
        }
        else {
            formatColor = hsbToHex(hsb)
        }

        this.$output.text(formatColor);

        if(this.$element.attr('type') == 'color'){
            formatColor = '#' + hsbToHex(hsb)
        }

        this.$element
            .val(formatColor)
            .parents(this.$parent)
            .addClass(this.classes.active);

        this.$color.css('backgroundColor', '#' + hsbToHex(hsb));

        this.hide();
    };

    /**
     * @Implement action
     *
     * @definition hide colorpicker if user click outside modal and
     * if modal is active
     *
     * @param e
     */
    Colorpicker.prototype.action = function(e){
        if (!this.mouseOnContainer && this.activate){
            this.hide();
        }
    };

    /**
     * @Implement show
     *
     * @definition Show colorpick in modal when user click on input
     *
     * @param e
     */
    Colorpicker.prototype.show = function (e) {
        var that            = this,
            viewportHeight  = $(window).height(),
            viewportWidtht  = $(window).width();

        this.activate = true;
        this.mouseOnContainer = false;
        this.$element.off('click', $.proxy(this.show, this));

        this.createSelector();
        this.createHue();
        this.createForm();

        this.$colorpick
            .append(this.$selector)
            .append(this.$huebar)
            .append(this.$form);

        if(this.options.animate) {
            this.$colorpick
                .attr('data-animate', 'true')
                .attr('data-animation', that.options.animationOut)
                .addClass(that.options.animationIn)
                .addClass('animated');
            var animateClass = this.options.animationIn + ' animated';
        }

        this.fillRGBFields(this.options.color);
        this.fillHSBFields(this.options.color);
        this.fillHexFields(this.options.color);
        this.setHue(this.options.color);
        this.setSelector(this.options.color);
        this.setCurrentColor(this.options.color);
        this.setNewColor(this.options.color);
        this.setOrigineFields(this.options.color);

        this.$overlay.appendTo(document.body);
        this.$colorpick
            .appendTo(document.body)
            .css({
                'top':  (viewportHeight/2) - (this.$colorpick.outerHeight()/2),
                'left': (viewportWidtht/2) - (this.$colorpick.outerWidth()/2)
            });

        this.bindSelector(this.$colorpick);

        var onShow = function () {
            if (that.$colorpick.hasClass(animateClass))
                that.$colorpick.removeClass(animateClass);
            that.$colorpick.trigger('show.origam.' + that.type);
        };

        $.support.transition && this.$colorpick.hasClass(animateClass) ?
            this.$colorpick
                .one('origamTransitionEnd', onShow)
                .emulateTransitionEnd(Color.TRANSITION_DURATION) :
            onShow();

        return false;
        
    };

    /**
     * @Implement hide
     *
     * @definition hide colorpick
     *
     * @param e
     */
    Colorpicker.prototype.hide = function (e) {
        var that = this;

        this.activate = false;

        if (e) e.preventDefault();

        this.$colorpick.trigger(e = $.Event('close.origam.' + this.type));

        var animate = this.$colorpick.attr('data-animate');
        var animation = this.$colorpick.attr('data-animation');

        if (animate) {
            if(animation){this.$colorpick.addClass(animation);}
            else{this.$colorpick.addClass('fadeOut');}
            this.$colorpick.addClass('animated');
            var animateClass = animation + ' animated';
        }


        if (e.isDefaultPrevented()) return;

        function removeElement() {
            if (that.$colorpick.hasClass(animateClass))
                that.$colorpick.removeClass(animateClass);
            that.$overlay.remove();
            that.$colorpick
                .detach()
                .trigger('closed.origam.' + that.type)
                .remove();
            that.$element.change();
        }

        $.support.transition && this.$colorpick.hasClass(animateClass)?
            this.$colorpick
                .one('origamTransitionEnd', removeElement)
                .emulateTransitionEnd(Colorpicker.TRANSITION_DURATION) :
            removeElement()

    };

    // COLORPICKER PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('origam.colorpicker');
            var options = typeof option == 'object' && option;

            if (!data) $this.data('origam.colorpicker', (data = new Colorpicker(this, options)));
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.colorpicker;

    $.fn.colorpicker             = Plugin;
    $.fn.colorpicker.Constructor = Colorpicker;


    // COLORPICKER NO CONFLICT
    // ===================

    $.fn.input.noConflict = function () {
        $.fn.colorpicker = old;
        return this
    };

    $(document).ready(function() {
        $('[data-form="color"]').colorpicker();
        $('[type="color"]').colorpicker();
    });

})(jQuery, window);
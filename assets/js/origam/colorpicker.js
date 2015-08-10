
/**
 * Apply origamColorPicker
 */

(function ($, w) {

    'use strict';

    // COLOR PUBLIC CLASS DEFINITION
    // ===============================

    var Color = function (element, options) {
        this.type       = null;
        this.options    = null;
        this.$element   = null;

        this.init('color', element, options)
    };

    //Color space convertions
    var hexToRgb = function (hex) {
            var hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);
            return {r: hex >> 16, g: (hex & 0x00FF00) >> 8, b: (hex & 0x0000FF)};
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
            hsb.s *= 100/255;
            hsb.b *= 100/255;
            return hsb;
        },

        hsbToRgb = function (hsb) {
            var rgb = {};
            var h = hsb.h;
            var s = hsb.s*255/100;
            var v = hsb.b*255/100;
            if(s == 0) {
                rgb.r = rgb.g = rgb.b = v;
            } else {
                var t1 = v;
                var t2 = (255-s)*v/255;
                var t3 = (t1-t2)*(h%60)/60;
                if(h==360) h = 0;
                if(h<60) {rgb.r=t1;	rgb.b=t2; rgb.g=t2+t3}
                else if(h<120) {rgb.g=t1; rgb.b=t2;	rgb.r=t1-t3}
                else if(h<180) {rgb.g=t1; rgb.r=t2;	rgb.b=t2+t3}
                else if(h<240) {rgb.b=t1; rgb.r=t2;	rgb.g=t1-t3}
                else if(h<300) {rgb.b=t1; rgb.g=t2;	rgb.r=t2+t3}
                else if(h<360) {rgb.r=t1; rgb.g=t2;	rgb.b=t1-t3}
                else {rgb.r=0; rgb.g=0;	rgb.b=0}
            }
            return {r:Math.round(rgb.r), g:Math.round(rgb.g), b:Math.round(rgb.b)};
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
                for (var i=0; i<len; i++) {
                    o.push('0');
                }
                o.push(hex);
                hex = o.join('');
            }
            return hex;
        };

    if (!$.fn.input) throw new Error('Colorpicker requires input.js');

    Color.VERSION  = '0.1.0';

    Color.TRANSITION_DURATION = 1000;

    Color.DEFAULTS = $.extend({}, $.fn.input.Constructor.DEFAULTS, {
        showEvent: 'click',
        templateWrapper: '<div class="origam-colorpick"></div>',
        templateColor: '<div class="origam-colorpick--color"></div>',
        templateColorSelector: '<div class="origam-colorpick--selector_outer"><div class="origam-colorpick--selector_inner"></div></div>',
        templateHue: '<div class="origam-colorpick--hue"></div>',
        templateHueSelector: '<div class="origam-colorpick--hue_arrs"><div class="origam-colorpick--hue_larr"></div><div class="origam-colorpick--hue_rarr"></div></div>',
        templateForm: '<div class="origam-colorpick--form"></div>',
        templateSubmit: '<div class="origam-colorpick--submit btn btn-primary" data-button="close"></div>',
        templateNewColor: '<div class="origam-colorpick--new_color"></div>',
        templateOriginColor: '<div class="origam-colorpick--current_color"></div>',
        templateWrapperField : '<div class="origam-colorpick--field text-field text-field--addons left"><div class="text-field--group"></div></div>',
        templateLabelField : '<div class="origam-colorpick--field_letter text-field--group__addons"></div>',
        templateField: '<input data-form="input" type="number" min="0" max="" />',
        templateClose: '<div class="origam-colorpick--close" data-button="close"><i class="origamicon origamicon-close"></i></div>',
        templateOverlay: '<div class="origam-overlay" data-type="overlay" data-button="close"></div>',
        templateColorElement: '<div class="text-field--color_current"></div>',
        fieldClass : 'text-field--group__input',
        parentClass : 'text-field--color',
        color: 'FF0000',
        livePreview: true,
        layout: 'full',
        submitText: 'OK',
        animate: true,
        animationIn: 'fadeInDown',
        animationOut: 'fadeOutUp',
        format: '#',
        height: 276,
        onShow: function () {},
        onBeforeShow: function(){},
        onHide: function () {},
        onChange: function () {},
        onSubmit: function () {}
    });

    Color.prototype = $.extend({}, $.fn.input.Constructor.prototype);

    Color.prototype.constructor = Color;

    Color.prototype.event = function (options) {
        this.options        = this.getOptions(options);
        this.id             = this.getUID(8);
        this.element        = this;
        this.$element.data('origam-colorpickId', this.id);
        this.field = new Array();
        this.fields = {
            'hex' : {
                'class': 'origam-colorpick--hex_field',
                'label': '#',
                'type': 'text',
                'maxlenght' : 6,
                'size' : 6
            },
            'origin' : {
                'class': 'origam-colorpick--origin_field',
                'label': '#'
            },
            'rgb_r' : {
                'class': 'origam-colorpick--rgb_r',
                'label': 'R',
                'max': '255'
            },
            'hsb_h' : {
                'class': 'origam-colorpick--hsb_h',
                'label': 'H',
                'max': '360'
            },
            'rgb_g' : {
                'class': 'origam-colorpick--rgb_g',
                'label': 'G',
                'max': '255'
            },
            'hsb_s' : {
                'class': 'origam-colorpick--hsb_s',
                'label': 'S',
                'max': '100'
            },
            'rgb_b' : {
                'class': 'origam-colorpick--rgb_b',
                'label': 'B',
                'max': '255'
            },
            'hsb_b' : {
                'class': 'origam-colorpick--hsb_b',
                'label': 'B',
                'max': '100'
            }
        };

        if (typeof this.options.color == 'string') {
            this.options.color = hexToHsb(this.options.color);
        } else if (this.options.color.r != undefined && this.options.color.g != undefined && this.options.color.b != undefined) {
            this.options.color = rgbToHsb(this.options.color);
        } else if (this.options.color.h != undefined && this.options.color.s != undefined && this.options.color.b != undefined) {
            this.options.color = fixHSB(this.options.color);
        } else {
            return this;
        }

        this.origColor = this.options.color;

        this.colorpick = $(this.options.templateWrapper)
            .attr('id', this.id)
            .addClass('origam-colorpick--'+this.options.layout);


        this.close = $(this.options.templateClose).attr('data-target', '#' + this.id);
        this.overlay = $(this.options.templateOverlay).attr('data-target', '#' + this.id);
        this.submitField = $(this.options.templateSubmit).attr('data-target', '#' + this.id);


        this.form = $(this.options.templateForm);
        this.currentColor = $(this.options.templateOriginColor);
        this.newColor = $(this.options.templateNewColor);


        this.selector = $(this.options.templateColor);
        this.selectorIndic = $(this.options.templateColorSelector);


        this.hue = $(this.options.templateHueSelector);
        this.huebar = $(this.options.templateHue);

        this.options.placement = 'before';
        this.$wrapper = this.addAddon();
        this.$wrapper.text(this.options.format);

        this.color = $(this.options.templateColorElement);

        this.$element
            .parents(this.$parent)
            .on(this.options.showEvent, $.proxy(this.show, this))
            .prepend(this.color);

    };

    Color.prototype.getDefaults = function () {
        return Color.DEFAULTS
    };

    Color.prototype.submit = function(e) {
        this.origColor = this.options.color;
        this.setCurrentColor(this.options.color);
        this.setOrigineFields(this.options.color);
        this.setElement(this.options.color);
    };

    Color.prototype.change = function(field) {

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

    Color.prototype.eventField = function (e){
        this.change($(e.currentTarget));
    };

    Color.prototype.eventSelector = function (e) {
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

    Color.prototype.moveSelector = function (e) {
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

    Color.prototype.updateSelector = function (e) {
        $(document).off('mouseup touchend', $.proxy(this.updateSelector, this));
        $(document).off('mousemove touchmove', $.proxy(this.moveSelector, this));
        return false;
    };

    Color.prototype.eventHue = function (e) {
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

    Color.prototype.moveHue = function (e) {
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

    Color.prototype.updateHue = function (e) {

        $(document).off('mouseup touchend', $.proxy(this.updateHue, this));
        $(document).off('mousemove touchmove',$.proxy(this.moveHue, this));
        return false;
    };

    Color.prototype.restoreOriginal = function(e) {
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

    Color.prototype.fillRGBFields = function  (hsb) {
        var rgb = hsbToRgb(hsb);
        this.field[2].val(rgb.r);
        this.field[4].val(rgb.g);
        this.field[6].val(rgb.b);
    };

    Color.prototype.fillHSBFields = function  (hsb) {
        this.field[3].val(Math.round(hsb.h));
        this.field[5].val(Math.round(hsb.s));
        this.field[7].val(Math.round(hsb.b));
    };

    Color.prototype.fillHexFields = function (hsb) {
        this.field[0].val(hsbToHex(hsb));
    };

    Color.prototype.setHue = function (hsb) {
        this.hue.css('top', parseInt(this.options.height - this.options.height * hsb.h/360, 10));
    };

    Color.prototype.setSelector = function (hsb) {
        this.selector.css('backgroundColor', '#' + hsbToHex({h: hsb.h, s: 100, b: 100}));
        this.selectorIndic.css({
            left: parseInt(this.options.height * hsb.s/100, 10),
            top: parseInt(this.options.height * (100-hsb.b)/100, 10)
        });
    };

    Color.prototype.setCurrentColor = function (hsb) {
        this.currentColor.css('backgroundColor', '#' + hsbToHex(hsb));
    };

    Color.prototype.setNewColor = function (hsb) {
        this.newColor.css('backgroundColor', '#' + hsbToHex(hsb));
    };

    Color.prototype.setOrigineFields = function (hsb) {
        this.field[1].text(hsbToHex(hsb));
    };

    Color.prototype.setElement = function (hsb) {
        var formatColor,
            rgb;

        if (this.options.format === 'rgb'){
            rgb = hsbToRgb(hsb)
            formatColor = '( ' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ') ';
        }
        else if (this.options.format === 'hsb') {
            formatColor = '( ' + hsb.h + ', ' + hsb.s + ', ' + hsb.b + ') ';
        }
        else {
            formatColor = hsbToHex(hsb)
        }


        this.$element
            .val(formatColor)
            .parents(this.$parent)
            .addClass(this.options.classes.active);

        this.color.css('backgroundColor', '#' + hsbToHex(hsb));
    }

    Color.prototype.show = function () {
        var that            = this,
            $color          = that.colorpick,
            viewportHeight  = $(window).height(),
            viewportWidtht  = $(window).width(),
            count           = 0,
            UA              = navigator.userAgent.toLowerCase(),
            isIE            = navigator.appName === 'Microsoft Internet Explorer',
            IEver           = isIE ? parseFloat( UA.match( /msie ([0-9]{1,}[\.0-9]{0,})/ )[1] ) : 0,
            ngIE            = ( isIE && IEver < 10 ),
            stops           = ['#ff0000','#ff0080','#ff00ff','#8000ff','#0000ff','#0080ff','#00ffff','#00ff80','#00ff00','#80ff00','#ffff00','#ff8000','#ff0000'];


        this.selector
            .html('')
            .on('mousedown touchstart', $.proxy(this.eventSelector, this))
            .append('<div class="origam-colorpick--color_overlay1"><div class="origam-colorpick--color_overlay2"></div></div>')
            .children().children().append(this.selectorIndic);

        if(ngIE) {
            var i;
            for(i=0; i<=11; i++) {
                $('<div>')
                    .attr('style','height:8.333333%; filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr='+stops[i]+', endColorstr='+stops[i+1]+'); -ms-filter: "progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr='+stops[i]+', endColorstr='+stops[i+1]+')";')
                    .appendTo(this.huebar);
            }
        } else {
            var stopList = stops.join(',');
            this.huebar.attr('style','background:-webkit-linear-gradient(top,'+stopList+'); background: -o-linear-gradient(top,'+stopList+'); background: -ms-linear-gradient(top,'+stopList+'); background:-moz-linear-gradient(top,'+stopList+'); -webkit-linear-gradient(top,'+stopList+'); background:linear-gradient(to bottom,'+stopList+'); ');
        }

        this.huebar
            .on('mousedown touchstart', $.proxy(this.eventHue, this))
            .append(this.hue);

        this.form
            .html('')
            .append(this.newColor);

        this.currentColor
            .on("click", $.proxy(this.restoreOriginal, this))
            .appendTo(this.form);

        for(var i in this.fields) {
            var $wrapper         = $(this.options.templateWrapperField),
                $label           = $(this.options.templateLabelField),
                $field           = $(this.options.templateField);

            $label
                .text(this.fields[i]['label'])
                .appendTo($wrapper.children());

            if(i === 'hex'){
                $field
                    .attr('type', this.fields[i]['type'])
                    .attr('maxlenght', this.fields[i]['maxlenght'])
                    .attr('size', this.fields[i]['size']);
            }
            else if(i === 'origin'){
                $field = $('<div>');
                $wrapper.addClass('text-field--disabled');
            }
            else {
                $field
                    .attr('max', this.fields[i]['max']);
            }

            this.field[count] = $field
                .on('focusin', $.proxy(this.startFocus, this))
                .on('focusout', $.proxy(this.endFocus, this))
                .on('change', $.proxy(this.eventField, this))
                .addClass(this.options.fieldClass)
                .appendTo($wrapper.children());

            $wrapper
                .addClass(this.fields[i]['class'])
                .appendTo(this.form);

            count++;
        }

        this.submitField
            .text(this.options.submitText)
            .on("click", $.proxy(this.submit, this))
            .appendTo(this.form);

        this.colorpick
            .append(this.close)
            .append(this.selector)
            .append(this.huebar)
            .append(this.form);

        if(that.options.animate) {
            $color
                .attr('data-animate', 'true')
                .attr('data-animation', that.options.animationOut)
                .addClass(that.options.animationIn)
                .addClass('animated');
            var animateClass = that.options.animationIn + ' animated';
        }

        this.fillRGBFields(this.options.color);
        this.fillHSBFields(this.options.color);
        this.fillHexFields(this.options.color);
        this.setHue(this.options.color);
        this.setSelector(this.options.color);
        this.setCurrentColor(this.options.color);
        this.setNewColor(this.options.color);
        this.setOrigineFields(this.options.color);

        this.overlay.appendTo(document.body);
        this.colorpick
            .appendTo(document.body)
            .css({
                'top':  (viewportHeight/2) - (this.colorpick.outerHeight()/2),
                'left': (viewportWidtht/2) - (this.colorpick.outerWidth()/2)
            });

        var onShow = function () {
            if ($color.hasClass(animateClass))
                $color.removeClass(animateClass);
            $color.trigger('show.origam.' + that.type);
        };

        $.support.transition && $color.hasClass(animateClass) ?
            $color
                .one('origamTransitionEnd', onShow)
                .emulateTransitionEnd(Color.TRANSITION_DURATION) :
            onShow();

        return false;
        
    };

    // COLOR PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('origam.color');
            var options = typeof option == 'object' && option;

            if (!data) $this.data('origam.color', (data = new Color(this, options)));
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.color;

    $.fn.color             = Plugin;
    $.fn.color.Constructor = Color;


    // COLOR NO CONFLICT
    // ===================

    $.fn.input.noConflict = function () {
        $.fn.color = old;
        return this
    };

    $(document).ready(function() {
        $('[data-form="color"]').color();
    });

})(jQuery, window);
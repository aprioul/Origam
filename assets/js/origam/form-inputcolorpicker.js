
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

    if (!$.fn.input) throw new Error('Color requires input.js');

    Color.VERSION  = '0.1.0';

    Color.TRANSITION_DURATION = 1000;

    Color.DEFAULTS = $.extend({}, $.fn.input.Constructor.DEFAULTS, {
        showEvent: 'click',
        template: '<div class="origam-colorpick"><div class="origam-colorpick--color"><div class="origam-colorpick--color_overlay1"><div class="origam-colorpick--color_overlay2"><div class="origam-colorpick--selector_outer"><div class="origam-colorpick--selector_inner"></div></div></div></div></div><div class="origam-colorpick--hue"><div class="origam-colorpick--hue_arrs"><div class="origam-colorpick--hue_larr"></div><div class="origam-colorpick--hue_rarr"></div></div></div><div class="origam-colorpick--form"><div class="origam-colorpick--new_color"></div><div class="origam-colorpick--current_color"></div><div class="origam-colorpick--hex_field text-field text-field--addons left"><div class="text-field--group"><div class="origam-colorpick--field_letter text-field--group__addons">#</div><input class="text-field--group__input" data-form="input" type="text" maxlength="6" size="6" /></div></div><div class="origam-colorpick--origin_field text-field text-field--addons left text-field--disabled"><div class="text-field--group"><div class="origam-colorpick--field_letter text-field--group__addons">#</div><div class="text-field--group__input"></div></div></div><div class="origam-colorpick--rgb_r origam-colorpick--field text-field text-field--addons left"><div class="text-field--group"><div class="origam-colorpick--field_letter text-field--group__addons">R</div><input class="text-field--group__input" data-form="input" type="text" maxlength="3" size="3" /></div></div><div class="origam-colorpick--hsb_h origam-colorpick--field text-field text-field--addons left"><div class="text-field--group"><div class="origam-colorpick--field_letter text-field--group__addons">H</div><input class="text-field--group__input" data-form="input" type="text" maxlength="3" size="3" /></div></div><div class="origam-colorpick--rgb_g origam-colorpick--field text-field text-field--addons left"><div class="text-field--group"><div class="origam-colorpick--field_letter text-field--group__addons">G</div><input class="text-field--group__input" data-form="input" type="text" maxlength="3" size="3" /></div></div><div class="origam-colorpick--hsb_s origam-colorpick--field text-field text-field--addons left"><div class="text-field--group"><div class="origam-colorpick--field_letter text-field--group__addons">S</div><input class="text-field--group__input" data-form="input" type="text" maxlength="3" size="3" /></div></div><div class="origam-colorpick--rgb_b origam-colorpick--field text-field text-field--addons left"><div class="text-field--group"><div class="origam-colorpick--field_letter text-field--group__addons">B</div><input class="text-field--group__input" data-form="input" type="text" maxlength="3" size="3" /></div></div><div class="origam-colorpick--hsb_b origam-colorpick--field text-field text-field--addons left"><div class="text-field--group"><div class="origam-colorpick--field_letter text-field--group__addons">B</div><input class="text-field--group__input" data-form="input" type="text" maxlength="3" size="3" /></div></div><div class="origam-colorpick--submit btn btn-primary" data-button="close"></div></div></div>',
        closeTemplate: '<div class="origam-colorpick--close" data-button="close"><i class="origamicon origamicon-close"></i></div>',
        overlayTemplate: '<div class="origam-colorpick--overlay" data-self="true" data-button="close"></div>',
        color: 'FF0000',
        livePreview: true,
        layout: 'full',
        submit: 1,
        submitText: 'OK',
        animate: true,
        animationIn: 'fadeInDown',
        animationOut: 'fadeOutUp',
        height: 276,
        onShow: function () {},
        onBeforeShow: function(){},
        onHide: function () {},
        onChange: function () {},
        onSubmit: function () {}
    });

    Color.prototype = $.extend({}, $.fn.input.Constructor.prototype);

    Color.prototype.constructor = Color;

    Color.prototype.getUID = function (length){
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
        if (!length) {
            length = Math.floor(Math.random() * chars.length);
        }
        var str = '';
        for (var i = 0; i < length; i++) {
            str += chars[Math.floor(Math.random() * chars.length)];
        }
        return str;
    };

    Color.prototype.event = function (options) {
        this.options        = this.getOptions(options);
        this.id             = this.getUID(8);
        this.element        = this;

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

        this.$element.data('origam-colorpickId', this.id);
        this.$overlay = $(this.options.overlayTemplate).attr('data-target', '#' + this.id);
        this.colorpick = $(this.options.template).attr('id', this.id);
        this.$close = $(this.options.closeTemplate).attr('data-target', '#' + this.id);

        this.colorpick
            .addClass('origam-colorpick--'+this.options.layout)
            .addClass(this.options.submit?'':' origam-colorpick--'+this.options.layout+'_ns')
            .prepend(this.$close);

        this.colorpick
            .find('.origam-colorpick--submit')
            .html(this.options.submitText)
            .on("click", $.proxy(this.submit, this));

        this.fields = this.colorpick
            .find('input')
            .on("change", $.proxy(this.change, this))
            .on("blur", $.proxy(this.blur, this))
            .on("focus", $.proxy(this.focus, this));

        this.colorpick
            .find('.origam-colorpick--field_arrs')
            .on("mousedown", $.proxy(this.eventIncrement, this))
            .end()
            .find('.origam-colorpick--current_color')
            .on("click", $.proxy(this.restoreOriginal, this));

        this.selector = this.colorpick
            .find('.origam-colorpick--color')
            .on('mousedown touchstart', $.proxy(this.eventSelector, this));

        this.selectorIndic = this.selector
            .find('.origam-colorpick--selector_outer');

        this.el = this;
        this.hue = this.colorpick
            .find('.origam-colorpick--hue_arrs');

        var huebar = this.hue.parent();
        var UA = navigator.userAgent.toLowerCase();
        var isIE = navigator.appName === 'Microsoft Internet Explorer';
        var IEver = isIE ? parseFloat( UA.match( /msie ([0-9]{1,}[\.0-9]{0,})/ )[1] ) : 0;
        var ngIE = ( isIE && IEver < 10 );
        var stops = ['#ff0000','#ff0080','#ff00ff','#8000ff','#0000ff','#0080ff','#00ffff','#00ff80','#00ff00','#80ff00','#ffff00','#ff8000','#ff0000'];
        if(ngIE) {
            var i;
            for(i=0; i<=11; i++) {
                $('<div>')
                    .attr('style','height:8.333333%; filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr='+stops[i]+', endColorstr='+stops[i+1]+'); -ms-filter: "progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr='+stops[i]+', endColorstr='+stops[i+1]+')";')
                    .appendTo(huebar);
            }
        } else {
            var stopList = stops.join(',');
            huebar.attr('style','background:-webkit-linear-gradient(top,'+stopList+'); background: -o-linear-gradient(top,'+stopList+'); background: -ms-linear-gradient(top,'+stopList+'); background:-moz-linear-gradient(top,'+stopList+'); -webkit-linear-gradient(top,'+stopList+'); background:linear-gradient(to bottom,'+stopList+'); ');
        }
        this.colorpick
            .find('.origam-colorpick--hue')
            .on('mousedown touchstart', $.proxy(this.eventHue, this));

        this.newColor = this.colorpick.find('.origam-colorpick--new_color');
        this.currentColor = this.colorpick.find('.origam-colorpick--current_color');

        this.fillRGBFields(this.options.color);
        this.fillHSBFields(this.options.color);
        this.fillHexFields(this.options.color);
        this.setHue(this.options.color);
        this.setSelector(this.options.color);
        this.setCurrentColor(this.options.color);
        this.setNewColor(this.options.color);
        this.setOrigineFields(this.options.color);

        this.$element.on(this.options.showEvent, $.proxy(this.show, this));

    };

    Color.prototype.getDefaults = function () {
        return Color.DEFAULTS
    };

    Color.prototype.submit = function(e) {
        this.origColor = this.options.color;
        this.setCurrentColor(this.options.color);
        this.setOrigineFields(this.options.color);
        this.$element.val(hsbToHex(this.options.color));
    };

    Color.prototype.change = function(field) {

        if (field.parents('.text-field').attr('class').indexOf('--hex') > 0) {
            this.options.color = hexToHsb(fixHex(this.value));
            this.fillRGBFields(this.options.color);
            this.fillHSBFields(this.options.color);
        } else if (field.parents('.text-field').attr('class').indexOf('--hsb') > 0) {
            this.options.color = fixHSB({
                h: this.fields.eq(2).val(),
                s: this.fields.eq(4).val(),
                b: this.fields.eq(6).val()
            });
            this.fillRGBFields(this.options.color);
            this.fillHexFields(this.options.color);
        } else {
            this.options.color= rgbToHsb(fixRGB({
                r: this.fields.eq(1).val(),
                g: this.fields.eq(3).val(),
                b: this.fields.eq(5).val()
            }));
            this.fillHexFields(this.options.color);
            this.fillHSBFields(this.options.color);
        }

        this.setSelector(this.options.color);
        this.setHue(this.options.color);
        this.setNewColor(this.options.color);
    };

    Color.prototype.blur = function(e) {
        $(this)
            .parents(this.$parent)
            .removeClass(this.options.classes.active);
        $(this)
            .parents(this.$parent)
            .addClass(this.options.classes.focus);
    };

    Color.prototype.focus = function(e) {
        $(this)
            .parents(this.$parent)
            .removeClass(this.options.classes.focus);
        if($(this).val() != ''){
            $(this)
                .parents(this.$parent)
                .addClass(this.options.classes.active);
        }
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

        this.fields.eq(4).val(parseInt(100*(Math.max(0,Math.min(this.options.height,(pageX - offset.left))))/this.options.height, 10));
        this.fields.eq(6).val(parseInt(100*(this.options.height - Math.max(0,Math.min(this.options.height,(pageY - offset.top))))/this.options.height, 10));

        this.change(this.fields.eq(4).end().eq(6));

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

        this.fields.eq(4).val(parseInt(100*(Math.max(0,Math.min(this.options.height,(pageX - offset.left))))/this.options.height, 10));
        this.fields.eq(6).val(parseInt(100*(this.options.height - Math.max(0,Math.min(this.options.height,(pageY - offset.top))))/this.options.height, 10));

        this.change(this.fields.eq(4).end().eq(6));

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

        this.fields.eq(2).val(parseInt(Math.round(360*(this.options.height - Math.max(0,Math.min(this.options.height,offset)))/this.options.height), 10));

        this.change(this.fields.eq(2));

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

        this.fields.eq(2).val(parseInt(Math.round(360*(this.options.height - Math.max(0,Math.min(this.options.height,offset)))/this.options.height), 10));

        this.change(this.fields.eq(2));

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
        this.fields
            .eq(1).val(rgb.r).end()
            .eq(3).val(rgb.g).end()
            .eq(5).val(rgb.b).end();
    };

    Color.prototype.fillHSBFields = function  (hsb) {
        this.fields
            .eq(2).val(Math.round(hsb.h)).end()
            .eq(4).val(Math.round(hsb.s)).end()
            .eq(6).val(Math.round(hsb.b)).end();
    };

    Color.prototype.fillHexFields = function (hsb) {
        this.fields.eq(0).val(hsbToHex(hsb));
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
        this.colorpick.find('.text-field--disabled').find('.text-field--group__input').text(hsbToHex(hsb));
    };

    Color.prototype.show = function () {

        var that            = this,
            $color          = that.colorpick,
            viewportHeight  = $(window).height(),
            viewportWidtht  = $(window).width();

        if(that.options.animate) {
            $color
                .attr('data-animate', 'true')
                .attr('data-animation', that.options.animationOut)
                .addClass(that.options.animationIn)
                .addClass('animated');
            var animateClass = that.options.animationIn + ' animated';
        }

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
    }

    $(document).ready(function() {
        $('[data-form="color"]').color();
    });

})(jQuery, window);
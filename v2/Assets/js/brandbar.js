(function (BRANDBAR, $, undefined) {

    BRANDBAR.Timer = function () {
        ///<summary>Simple timer object created around a timeout.</summary>
        this.id = null;
        this.busy = false;
        var _this = this;

        this.start = function (func, milliseconds, thisArg) {
            ///<summary>Starts the timer and waits the specified amount of <paramref name="milliseconds"/> before executing the supplied <paramref name="func"/>.</summary>
            ///<param name="func">The function to execute once the timer runs out.</param>
            ///<param name="milliseconds">The time in milliseconds to wait before executing the supplied <paramref name="func"/>.</param>
            ///<param name="thisArg">The value of this provided for the call to func.</param>
            thisArg = thisArg || func;
            _this.stop();
            _this.id = setTimeout(function () {
                func.call(thisArg);
                _this.id = null;
                _this.busy = false;
            }, milliseconds);
            _this.busy = true;
        };

        this.stop = function () {
            ///<summary>Stops the timer if its runnning and resets it back to its starting state.</summary>
            if (_this.id === null) return;
            clearTimeout(_this.id);
            _this.id = null;
            _this.busy = false;
        };
        return this;
    };

    BRANDBAR.resize = function () {
        var header_height = $('#brandbar').outerHeight();

//        $('#brandbar, #brandbar-buttons span').css({
//            'line-height': header_height + "px"
//        });

        $('#brandbar-iframe')
            .height($(window).height() - header_height)
            .width($(window).width())
            .css('margin-top', header_height + 'px');
    };

    BRANDBAR.breakout = function() {
        //break out of any frames!
        if (window.top.location != window.location) {
            window.top.location.replace(window.location);
        }
    };

    BRANDBAR.init = function () {
        //init remove frame button
        $('#brandbar-remove-iframe').click(function (e) {
            e.preventDefault();
            top.location.href = BRANDBAR.url;
        });

        //init resize buttons
        $('.brandbar-resize').click(function (e) {
            e.preventDefault();
            var $iframe = $('#brandbar-iframe');
            var width = $(this).data('width');
            if (width == 'full') {
                width = $(window).width();
            }
            $iframe.css({'position': 'absolute'});
            var left = (parseInt(width) / 2) * -1;
            $iframe.animate({ 'width': width, 'left': left, 'margin-left': '50%'});
        });

        //select a menu option if possible
        $('#brandbar-menu option').each(function () {
            if ($(this).attr('value') == $('#brandbar-iframe').attr('src')) {
                $('#brandbar-menu').val($(this).attr('value'));
            }
        });

        //bind menu changes
        $('#brandbar-menu').change(function (e) {
            var url = $(this).val();
            var behaviour = $(this).data('behaviour');
            if (behaviour == 'open' && url.length > 0) {
                $('#brandbar-iframe').attr('src', url).show();
                $('#brandbar-page-content').hide();
            } else if (behaviour == 'event') {
                $('body').trigger('brandbar-menu-selected', $(this));
            }
        });

        //call resize when page is loaded
        BRANDBAR.resize();

        BRANDBAR.resizeTimer = new BRANDBAR.Timer();

        //bind resize event
        $(window).resize(function () {
            if (BRANDBAR.resizeTimer.busy) return;
            BRANDBAR.resizeTimer.start(function() {
                BRANDBAR.resize();
            }, 300);
        });
    };
}(window.BRANDBAR = window.BRANDBAR || {}, jQuery));
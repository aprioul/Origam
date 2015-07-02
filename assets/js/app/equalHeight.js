(function ($, w) {
    $.fn.extend({
        /**
         * Apply equalHeight on a list of elements (in a jQuery object) eq. $('ul li'),
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
        equalHeight: function (options) {
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
(function ($, w) {

    BRANDBAR.breakout();

    (function (BRANDBAR, $, undefined) {
        BRANDBAR.url = 'demo/demo.html';
    }(w.BRANDBAR = w.BRANDBAR || {}, $));


    $(function () {
        BRANDBAR.init();
    });

})(jQuery, window);
(function ($, w) {
    if (typeof BRANDBAR == 'function') {
        BRANDBAR.breakout();
        BRANDBAR.url = 'demo.html';
        BRANDBAR.init();
    }

    hljs.configure({
        tabReplace: '    ',
        classPrefix: 'hljs-origam-'
   });

    $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
    });

})(jQuery, window);

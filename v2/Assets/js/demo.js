(function ($, w) {
    hljs.configure({
        tabReplace: '    ',
        classPrefix: 'hljs-origam-'
   });

    $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
    });

})(jQuery, window);

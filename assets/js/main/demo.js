/**
 * Created by aprioul on 22/06/2015.
 */
(function ($, w) {

    $(document).ready(function() {
        $('.origam-nav').css('height',window.innerHeight-100);

        $(window).resize(function(){
            $('.origam-nav').css('height',window.innerHeight-100);
        });

        $(document).on('scroll',function(){
            var scrollPos = $(document).scrollTop();

            if(scrollPos < 100)
                $('.origam-nav').removeClass('fixed');
            else
                $('.origam-nav').addClass('fixed');

            $('.origam-nav .origam-nav--menu > li > a, .origam-nav .origam-nav--menu .origam-nav--menu > li > a').each(function () {
                var currLink = $(this),
                    refElement = $(currLink.attr("href")),
                    refElementOffset = refElement.offset();

                console.log(currLink);

                var list = currLink.parent().next();

                console.log(list);

                if (refElementOffset.top <= scrollPos) {

                    $('.origam-nav .active').removeClass('active');
                    currLink.parent().addClass("active");

                    var prevHeading = currLink.parent().parent().prev();

                    console.log(prevHeading);
                }
            });
        })
    });

})(jQuery, window);
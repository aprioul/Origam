/**
 * Created by aprioul on 22/06/2015.
 */
(function ($, w) {

    $(document).ready(function() {
        $('.origam-nav').css('height',window.innerHeight);

        $lastSection = $('#content').children().children().children().last();
        if($lastSection.innerHeight() < window.innerHeight + 22) {
            $lastSection.css('height', window.innerHeight + 22);
        }

        $(window).resize(function(){
            $('.origam-nav').css('height',window.innerHeight);
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

                if (refElementOffset.top <= scrollPos) {

                    $('.origam-nav .active').removeClass('active');
                    currLink.closest('.origam-nav--menu__tab').addClass("active").parents('.origam-nav--menu__tab').addClass("active");
                }
            });
        })
    });

})(jQuery, window);
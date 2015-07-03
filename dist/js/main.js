/**
 * Created by aprioul on 22/06/2015.
 */
(function ($, w) {

    $(document).ready(function() {
        if($('#form').length > 0) {
            if ($(".text-field--group__input").length > 0) {
                $(".text-field--group__input").origamInput();
            }
            if ($(".text-field--group__input[type=password]").length > 0) {
                $(".text-field--group__input[type=password]").origamPassword();
            }
            if ($(".text-field--group__input[type=phone]").length > 0) {
                $(".text-field--group__input[type=phone]").origamPhone();
            }
        }
        if($("#message-notification").length > 0) {

        }

        /*if($("#button").length > 0) {
            var $btn = $(".btn[data-ripple]");
            $btn.each(function(){
                if($(this).data('ripple') === 1) {
                    $(this).origamRipple();
                }
            });
        }*/

    });

})(jQuery, window);
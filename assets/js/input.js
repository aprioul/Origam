(function ($) {

    var origamInput = function () {
        var
            defaults = {
                placeholder: '',
                classes: {
                    clsloading: 'text-field--loading',
                    clsloaded: 'text-field--loaded',
                    clsfocus: 'text-field--focused',
                    clsactive: 'text-field--active',
                    clssuccess: 'text-field--success',
                    clswarning: 'text-field--warning',
                    clserror: 'text-field--error'
                }
            },
            animationfocus = function(){
                $(this).parents('.text-field').removeClass(defaults.classes.clsactive);
                $(this).parents('.text-field').addClass(defaults.classes.clsfocus);
            },
            animationBlur = function(){
                $(this).parents('.text-field').removeClass(defaults.classes.clsfocus);
                if($(this).val() != ''){
                    $(this).parents('.text-field').addClass(defaults.classes.clsactive);
                }
            }

        return {
            init: function (opt) {
                opt = $.extend({}, defaults, opt || {});

                //For each selected DOM element
                return this.each(function () {
                    var $input = $(this);
                    var $inputParent = $input.parents('.text-field');
                    var $inputlabel = $inputParent.children('label');
                    var options = $.extend({}, opt);
                    var cls = options.classes;

                    $inputParent.addClass(cls.clsloaded);
                    $input.focus(animationfocus).blur(animationBlur);

                });
            }
        };
    }();

    $.fn.extend({
        origamInput: origamInput.init
    });

})(jQuery);
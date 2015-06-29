(function ($) {

    var origamInput = function () {
        var
            defaults = {
                placeholder: '',
                classes: {
                    loading: 'text-field--loading',
                    loaded: 'text-field--loaded',
                    focus: 'text-field--focused',
                    active: 'text-field--active',
                    success: 'text-field--success',
                    warning: 'text-field--warning',
                    error: 'text-field--error'
                },
                wrapper: 'text-field--group__addons',
                parentNode: 'text-field',
                textarea: {
                    baseHeight: '24'
                }
            },

            /**
             * Init Functions
             */
            placeholder = function(){

            },
            focus = function(){
                $(this).parents('.text-field').removeClass(defaults.classes.active);
                $(this).parents('.text-field').addClass(defaults.classes.focus);
            },
            blur = function(){
                $(this)
                    .parents('.text-field')
                    .removeClass(defaults.classes.focus);
                if($(this).val() != ''){
                    $(this)
                        .parents('.text-field')
                        .addClass(defaults.classes.active);
                }
            },
            /**
             * Textare Functions
             */
            resizeTextarea = function(e, $textarea, opt) {
                var offset = e.offsetHeight - e.clientHeight;
                $textarea.on('keyup input', function () {
                    var baseHeight = opt.textarea.baseHeight + 'px';
                    $textarea.css('height', baseHeight).css('height', e.scrollHeight + offset);
                });
            }

        return {
            init: function (opt) {
                opt = $.extend({}, defaults, opt || {});

                //For each selected DOM element
                return this.each(function () {
                    var event = this;
                    var $input = $(event);
                    var options = $.extend({}, opt);
                    var parentNode = '.' + options.parentNode;
                    var $inputParent = $input.parents(parentNode);
                    var $inputlabel = $inputParent.children('label');
                    var cls = options.classes;
                    var modules = options.modules;

                    $inputParent.addClass(cls.loaded);
                    $input.focus(focus).blur(blur);

                    if ($input.is('textarea')) {
                        resizeTextarea(event, $input, opt);
                    }
                });
            }
        };
    }();

    $.fn.extend({
        origamInput: origamInput.init
    });

})(jQuery);
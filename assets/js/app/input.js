
/**
 * Apply origamInput on input elements (in a jQuery object) eq. $('input[type=text]'),
 * parent element will have focus class and active class
 * You can call origamInput on textarea to have autoresise, your element will
 * have height equal to text.
 * @param  {obj} options :
 *     - placeholder : define placeholder for input/textarea
 *     - classes : You can change default classes of element
 *          - focus : define focus class
 *          - active : define active class
 *     - parentNode : You can define parent
 *     - baseHeight : You define here your textarea height (at start)
 */

(function ($, w) {

    var origamInput = function () {
        var
            defaults = {
                placeholder: '',
                classes: {
                    focus: 'text-field--focused',
                    active: 'text-field--active'
                },
                parentNode: 'text-field',
                baseHeight: '24'
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
                    var baseHeight = opt.baseHeight + 'px';
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

})(jQuery, window);


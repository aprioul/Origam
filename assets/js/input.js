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
                    addonsLeft: 'text-field--addons left',
                    addonsRight: 'text-field--addons right',
                    success: 'text-field--success',
                    warning: 'text-field--warning',
                    error: 'text-field--error'
                },
                parentNode: 'text-field',
                phone: {},
                textarea: {
                    baseHeight: '24'
                },
                password: {
                    wrapper: '<div class="text-field--group__addons"></div>',
                    element: 'span',
                    icon: 'origamicon text-field--group__switchpass',
                    show: 'origamicon-eye',
                    hide: 'origamicon-eye-blocked',
                    appendafter: true
                },
                modules: [
                    'phone',
                    'textarea',
                    'password'
                ]
            },
            focus = function(){
                $(this).parents('.text-field').removeClass(defaults.classes.active);
                $(this).parents('.text-field').addClass(defaults.classes.focus);
            },
            blur = function(){
                $(this).parents('.text-field').removeClass(defaults.classes.focus);
                if($(this).val() != ''){
                    $(this).parents('.text-field').addClass(defaults.classes.active);
                }
            },
            placeholder = function(){

            },
            moduleSwitch = function(mdl, e, $i, opt){
                switch (mdl){
                    case "textarea":
                        if ($i.is('textarea')) {
                            resizeTextarea(e, $i, opt);
                        }
                        break;
                    case "phone":
                        if($i.attr('type') === 'phone') {
                            phoneFormat(e, $i, opt);
                        }
                        break;
                    case "password":
                        if($i.attr('type') === 'password') {
                            passwordSwitch(e, $i, opt);
                            passwordStrenght(e, $i, opt);
                        }
                        break;
                }
            }
            resizeTextarea = function(e, $textarea, opt) {
                var offset = e.offsetHeight - e.clientHeight;
                $textarea.on('keyup input', function () {
                    var baseHeight = opt.textarea.baseHeight + 'px';
                    $textarea.css('height', baseHeight).css('height', e.scrollHeight + offset);
                });
            },
            phoneFormat = function(e,$phone, opt){

            },
            passwordSwitch = function(e, $password, opt){
                var parentNode = '.' + opt.parentNode;
                var classposition = '';
                var $element = document.createElement(opt.password.element);
                opt.password.appendafter ? classposition = opt.classes.addonsRight : opt.classes.addonsLeft;

                $password.parents(parentNode).addClass(classposition);
                $password.parent().append(opt.password.wrapper);
                $password.next().append($element);

                var $switch = $password.next().children();
                $switch.addClass(opt.password.icon).addClass(opt.password.show);
                $switch.bind('click', function () {
                    if ($switch.hasClass(opt.password.show)) {
                        $password.attr('type', 'text');
                        $switch.removeClass(opt.password.show).addClass(opt.password.hide);
                    } else {
                        $password.attr('type', 'password');
                        $switch.removeClass(opt.password.hide).addClass(opt.password.show);
                    }
                })
            },
            passwordStrenght = function(e,$password, opt){

            };


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

                    modules.forEach(function(index){
                        moduleSwitch(index, event, $input, options);
                    });

                });
            },
            validate: function(opt) {
                opt = $.extend({}, defaults, opt || {});

                //For each selected DOM element
                return this.each(function () {
                    var event = this;
                    var $input = $(event);
                    var $inputParent = $input.parents('.text-field');
                    var $inputlabel = $inputParent.children('label');
                    var options = $.extend({}, opt);
                    var cls = options.classes;


                });
            }
        };
    }();

    $.fn.extend({
        origamInput: origamInput.init,
        origamInputValidate: origamInput.validate
    });

})(jQuery);
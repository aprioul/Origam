
/**
 * Apply origamDatepickerPicker
 */

(function ($, w) {

    'use strict';

    // DATEPICKER PUBLIC CLASS DEFINITION
    // ===============================

    var Datepicker = function (element, options) {
        this.type       = null;
        this.options    = null;
        this.$element   = null;

        this.init('datepicker', element, options)
    };

    if (!$.fn.input) throw new Error('Datepicker requires input.js');

    Datepicker.VERSION  = '0.1.0';

    Datepicker.TRANSITION_DURATION = 1000;

    Datepicker.DEFAULTS = $.extend({}, $.fn.input.Constructor.DEFAULTS, {
        templateWrapper: '<div class="origam-datepick"></div>',
        templateView: '<div class="origam-datepick--view"></div>',
        templateDayL: '<div class="origam-datepick--view__dayL"></div>',
        templateDayN: '<div class="origam-datepick--view__dayN"></div>',
        templateMonth: '<div class="origam-datepick--view__month"></div>',
        templateYear: '<div class="origam-datepick--view__year"></div>',
        templateForm: '<div class="origam-datepick--calendar"></div>',
        templateCalendarHeader: '<div class="origam-datepick--calendar__header"></div>',
        templateCalendarContent: '<div class="origam-datepick--calendar__content"></div>',
        templateSubmit: '<div class="origam-datepick--submit btn btn-ghost"></div>',
        templateOverlay: '<div class="origam-overlay"></div>',
        templatePrev: '<span class="calendar-header--prev origamicon origamicon-angle-left"></span>',
        templateNext: '<span class="calendar-header--next origamicon origamicon-angle-right"></span>',
        classes: {
            focus: 'text-field--focused',
            active: 'text-field--active',
            addonsLeft: 'text-field--addons left',
            addonsRight: 'text-field--addons right',
            header: 'calendar-header--title',
            month: 'calendar-header--title__month',
            year: 'calendar-header--title__year'
        },
        submittext: 'OK',
        startdate: '',
        enddate: '',
        startIn : 1,
        weekday: {
            0: "Sunday",
            1: "Monday",
            2: "Tuesday",
            3: "Wednesday",
            4: "Thursday",
            5: "Friday",
            6: "Saturday"
        },
        month: {
            0: "January",
            1: "February",
            2: "March",
            3: "April",
            4: "May",
            5: "June",
            6: "July",
            7: "August",
            8: "September",
            9: "October",
            10: "November",
            11: "December"
        },
        type: 'date',
        createView: function ($dayLetter, $dayNumber, $month, $year, $container) {
            $container
                .append($dayLetter)
                .append($month)
                .append($dayNumber)
                .append($year);
        }
    });

    Datepicker.prototype = $.extend({}, $.fn.input.Constructor.prototype);

    Datepicker.prototype.constructor = Datepicker;

    Datepicker.prototype.event = function (options) {
        this.options            = this.getOptions(options);
        this.field              = new Array();
        this.row                = new Array();
        this.options.type       = this.$element.attr('type') && this.$element.attr('type')!== 'text' ? this.$element.attr('type') : this.options.type;
        this.lang               = navigator.language || navigator.userLanguage;
        this.date               = this.options.startdate.length !== 0 ? new Date(this.options.startdate) : this.$element.val() ? this.$element.val() : new Date();
        this.today              = new Date();
        this.currentDay         = this.date;
        this.seconds            = this.date.getSeconds();
        this.minutes            = this.date.getMinutes();
        this.hours              = this.date.getHours();
        this.month              = new Array();
        this.month.letter       = this.options.month[this.date.getMonth()];
        this.month.number       = this.date.getMonth();
        this.year               = this.date.getFullYear();
        this.day                = new Array();
        this.day.letter         = this.options.weekday[this.date.getDay()];
        this.day.number         = this.date.getDate();
        this.weekDay            = new Array();


        this.$overlay = $(this.options.templateOverlay);
        this.$element.data('origam-'+ this.options.type +'pickId', this.id);

        this.$datepick = $(this.options.templateWrapper)
            .attr('id', this.id)
            .addClass('origam-datepick--' + this.options.type);

        this.$submitField = $(this.options.templateSubmit).attr('data-target', '#' + this.id);

        this.$view = $(this.options.templateView);

        this.$viewDayL = $(this.options.templateDayL);
        this.$viewDayN = $(this.options.templateDayN);
        this.$viewMonth = $(this.options.templateMonth);
        this.$viewYear = $(this.options.templateYear);

        this.$form = $(this.options.templateForm);
        
        this.$next = $(this.options.templateNext);
        this.$prev = $(this.options.templatePrev);
        this.$month = $('<span/>', {class: this.classes.month});
        this.$year = $('<span/>', {class: this.classes.year});
        this.$title = $('<div/>', {class: this.classes.header});

        this.$title
            .append(this.$month)
            .append(this.$year);


        this.$header = $(this.options.templateCalendarHeader)
            .append(this.$prev)
            .append(this.$title)
            .append(this.$next);

        this.$content = $(this.options.templateCalendarContent);

        this.$form
            .append(this.$header)
            .append(this.$content)
            .append(this.$submitField);
        
        this.$element
            .parents(this.$parent)
            .on('click', $.proxy(this.show, this));
    };

    Datepicker.prototype.getDefaults = function () {
        return Datepicker.DEFAULTS
    };

    Datepicker.prototype.submit = function() {
        this.hide();
    };

    Datepicker.prototype.updateView = function(){
        this.$viewDayL.text(this.day.letter);
        this.$viewDayN.text(this.day.number);
        this.$viewMonth.text(this.month.letter.substring(0, 3));
        this.$viewYear.text(this.year);
    };

    Datepicker.prototype.updateHeader = function(month, year){
        this.updateYear(year);
        this.updateMonth(month);
    };

    Datepicker.prototype.updateYear = function(year){
        this.year = year;
        this.$year.text(year);
    };

    Datepicker.prototype.updateMonth = function(month){
        this.month.number = month;
        this.month.letter = this.options.month[month];
        this.$month.text(this.month.letter);
    };

    Datepicker.prototype.updateCalendar = function(){
        
    };

    Datepicker.prototype.updateTime = function(){

    };

    Datepicker.prototype.createForm = function(){
        this.$next.on('click', $.proxy(this.next, this));
        this.$prev.on('click', $.proxy(this.prev, this));

        this.$submitField
            .text(this.options.submittext)
            .on("click", $.proxy(this.submit, this));

        this.updateHeader(this.month.number, this.year);

    };

    Datepicker.prototype.next = function(){
        var month = this.month.number,
            year = this.year;

        if((month + 1) <= 11) {
            month = month + 1;
        } else {
            month = 0;
            year = year + 1;
        }

        this.updateHeader(month, year);
        this.updateView();
    };

    Datepicker.prototype.prev = function(){
        var month = this.month.number,
            year = this.year;

        if((month - 1) >= 0) {
            month = month - 1;
        } else {
            month = 11;
            year = year - 1;
        }

        this.updateHeader(month, year);
        this.updateView();
    };

    Datepicker.prototype.createWeekDays = function(){

    };

    Datepicker.prototype.createDays = function(month, year){
        var d = new Date( year, month + 1, 0),
            monthLength = d.getDate(),
            firstDay = new Date( year, month, 1),
            day = 1,
            that = this,
            today = month === this.today.getMonth() && year === this.today.getFullYear() && day === this.today.getDate(),
            selected = month === this.currentDay.getMonth() && year === this.currentDay.getFullYear() && day === this.currentDay.getDate();
    };

    Datepicker.prototype.getValue = function(e){

    };

    Datepicker.prototype.action = function(e){
        if (!this.mouseOnContainer && this.activate){
            this.hide();
        }
    };

    Datepicker.prototype.show = function (e) {
        var that            = this,
            viewportHeight  = $(window).height(),
            viewportWidtht  = $(window).width();

        this.activate = true;
        this.$element.off('click', $.proxy(this.show, this));

        this.updateView();
        this.options.createView(this.$viewDayL, this.$viewDayN, this.$viewMonth, this.$viewYear, this.$view);
        this.createForm();

        this.$datepick
            .append(this.$view)
            .append(this.$form);

        if(this.options.animate) {
            this.$datepick
                .attr('data-animate', 'true')
                .attr('data-animation', that.options.animationOut)
                .addClass(that.options.animationIn)
                .addClass('animated');
            var animateClass = this.options.animationIn + ' animated';
        }

        this.$overlay.appendTo(document.body);
        this.$datepick
            .appendTo(document.body)
            .css({
                'top':  (viewportHeight/2) - (this.$datepick.outerHeight()/2),
                'left': (viewportWidtht/2) - (this.$datepick.outerWidth()/2)
            });

        this.bindSelector(this.$datepick);

        var onShow = function () {
            if (that.$datepick.hasClass(animateClass))
                that.$datepick.removeClass(animateClass);
            that.$datepick.trigger('show.origam.' + that.type);
        };

        $.support.transition && this.$datepick.hasClass(animateClass) ?
            this.$datepick
                .one('origamTransitionEnd', onShow)
                .emulateTransitionEnd(Datepicker.TRANSITION_DURATION) :
            onShow();

        return false;

    };

    Datepicker.prototype.hide = function (e) {
        var that = this;

        this.activate = false;

        if (e) e.preventDefault();

        this.$datepick.trigger(e = $.Event('close.origam.' + this.type));

        var animate = this.$datepick.attr('data-animate');
        var animation = this.$datepick.attr('data-animation');

        if (animate) {
            if(animation){this.$datepick.addClass(animation);}
            else{this.$datepick.addClass('fadeOut');}
            this.$datepick.addClass('animated');
            var animateClass = animation + ' animated';
        }


        if (e.isDefaultPrevented()) return;

        function removeElement() {
            if (that.$datepick.hasClass(animateClass))
                that.$datepick.removeClass(animateClass);
            that.$overlay.remove();
            that.$datepick
                .detach()
                .trigger('closed.origam.' + that.type)
                .remove();
        }

        $.support.transition && this.$datepick.hasClass(animateClass)?
            this.$datepick
                .one('origamTransitionEnd', removeElement)
                .emulateTransitionEnd(Datepicker.TRANSITION_DURATION) :
            removeElement()

    };

    // DATEPICKER PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('origam.datepicker');
            var options = typeof option == 'object' && option;

            if (!data) $this.data('origam.datepicker', (data = new Datepicker(this, options)));
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.datepicker;

    $.fn.datepicker             = Plugin;
    $.fn.datepicker.Constructor = Datepicker;


    // DATEPICKER NO CONFLICT
    // ===================

    $.fn.input.noConflict = function () {
        $.fn.datepicker = old;
        return this
    };

    $(document).ready(function() {
        $('[data-form="date"]').datepicker();
        $('[type="date"]').datepicker();
        $('[type="month"]').datepicker();
        $('[type="week"]').datepicker();
        $('[type="time"]').datepicker();
        $('[type="datetime"]').datepicker();
    });

})(jQuery, window);
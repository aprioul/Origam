
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
        templateLeft: '<span class="calendar-header--left origamicon origamicon-angle-left"></span>',
        templateRight: '<span class="calendar-header--right origamicon origamicon-angle-right"></span>',
        classes: {
            focus: 'text-field--focused',
            active: 'text-field--active',
            addonsLeft: 'text-field--addons left',
            addonsRight: 'text-field--addons right',
            calendarTitle: 'calendar-header--title',
            weekdays: 'calendar-content--weekdays',
            days: 'calendar-content--days',
            today: 'calendar-content--days__today',
            selected: 'calendar-content--days__select',
            week: 'calendar-content--days__week'
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
            $container.html('');
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
        this.date               = this.options.startdate.length !== 0 ? new Date(this.options.startdate) : new Date();
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
        this.$form = $(this.options.templateForm);

        this.$element
            .parents(this.$parent)
            .on('click', $.proxy(this.show, this));
    };

    Datepicker.prototype.getDefaults = function () {
        return Datepicker.DEFAULTS
    };

    Datepicker.prototype.submit = function(e) {
        var day = ("0" + this.day.number).slice(-2),
            month = ("0" + (this.month.number + 1)).slice(-2),
            date = this.year + '-' + (month) + '-' + (day);

        this.$element
            .val(date)
            .parents(this.$parent)
            .addClass(this.classes.active);

        this.hide();
    };

    Datepicker.prototype.createOrUpdateView = function(){
        this.$viewDayL = $(this.options.templateDayL)
            .text(this.day.letter);
        this.$viewDayN = $(this.options.templateDayN)
            .text(this.day.number);
        this.$viewMonth = $(this.options.templateMonth)
            .text(this.month.letter.substring(0, 3));
        this.$viewYear = $(this.options.templateYear)
            .text(this.year);

        this.options.createView(this.$viewDayL, this.$viewDayN, this.$viewMonth, this.$viewYear, this.$view);
    };

    Datepicker.prototype.createForm = function(){
        this.$header = $(this.options.templateCalendarHeader);
        this.$right = $(this.options.templateRight)
            .on('click', $.proxy(this.next, this));
        this.$left = $(this.options.templateLeft)
            .on('click', $.proxy(this.prev, this));
        this.$title = $('<span/>', {
            class: this.classes.calendarTitle
        });

        this.$header
            .html('')
            .append(this.$left)
            .append(this.$title)
            .append(this.$right);

        this.updateTitle(this.month.letter + ' ' + this.year);

        this.$content = $(this.options.templateCalendarContent);

        this.createOrUpdateDays(this.month.number, this.year);

        this.$form
            .html('')
            .append(this.$header)
            .append(this.$content)
            .append(this.$submitField);

    };

    Datepicker.prototype.updateTitle = function(text){
        this.$title.text(text);
    };

    Datepicker.prototype.next = function(){

        if((this.month.number + 1) <= 11) {
            this.month.number = this.month.number + 1;
        } else {
            this.month.number = 0;
            this.year = this.year + 1;
        }
        this.month.letter = this.options.month[this.month.number];
        this.updateTitle(this.month.letter + ' ' + this.year);
        this.createOrUpdateDays(this.month.number, this.year);
    };

    Datepicker.prototype.prev = function(){
        if((this.month.number - 1) >= 0) {
            this.month.number = this.month.number - 1;
        } else {
            this.month.number = 11;
            this.year = this.year - 1;
        }
        this.month.letter = this.options.month[this.month.number];
        this.updateTitle(this.month.letter + ' ' + this.year);
        this.createOrUpdateDays(this.month.number, this.year);
    };

    Datepicker.prototype.createWeekDays = function(){
        var that = this;

        this.$weekdays = $('<div/>', {
            class: this.classes.weekdays
        });

        $.each( this.options.weekday , function (index, day) {
            that.weekDay[index] = $('<div/>', {
                class: that.classes.weekdays + '__day'
            }).text(day.substring(0, 1));

            that.$weekdays.append(that.weekDay[index]);
        });
    };

    Datepicker.prototype.createOrUpdateDays = function(month, year){
        var d = new Date( year, month + 1, 0),
            monthLength = d.getDate(),
            firstDay = new Date( year, month, 1),
            day = 1,
            that = this;

        this.createWeekDays();

        this.$days = $('<div/>', {
            class: this.classes.days
        }).html('');

        this.startingDay = firstDay.getDay();

        // this loop is for weeks (rows)
        for ( var i = 0; i < 7; i++ ) {

            // stop making rows if we've run out of days
            if (day > monthLength) {
                break;
            }

            this.row[i] = $('<div/>',{
                class: this.classes.week
            });

            // this loop is for weekdays (cells)
            for (var j = 0; j <= 6; j++) {

                var pos = this.startingDay - this.options.startIn,
                    p = pos < 0 ? 6 + pos + 1 : pos,
                    today = month === this.today.getMonth() && year === this.today.getFullYear() && day === this.today.getDate(),
                    selected = month === this.currentDay.getMonth() && year === this.currentDay.getFullYear() && day === this.currentDay.getDate(),
                    content = '';

                if ( day <= monthLength && ( i > 0 || j >= p ) ) {

                    var $thisDay = this.field[day] = $('<div/>', {
                       class: this.classes.days + '__day'
                    }).html('<span>' + day + '</span>');

                    this.field[day].on('click', $.proxy(this.getValue, this));

                    this.row[i].append(this.field[day]);

                    ++day;
                }
                else{
                    this.row[i].append($('<div/>'));
                }

                if(today){
                    $thisDay.addClass(this.classes.today);
                }

                if(selected) {
                    $thisDay.addClass(this.classes.selected);
                }

            }
            this.$days.append(this.row[i]);
        }

        this.$content
            .html('')
            .append(this.$weekdays)
            .append(this.$days);
    };

    Datepicker.prototype.getValue = function(e){

        console.log($(e.target).closest('.' + this.classes.days + '__day'));

        this.$days
            .find('.' + this.classes.selected)
            .removeClass(this.classes.selected);

        $(e.target)
            .closest('.' + this.classes.days + '__day')
            .addClass(this.classes.selected);

        this.day.number = parseInt(e.target.innerText);
        this.date = new Date(this.year, this.month.number, this.day.number);
        this.day.letter = this.options.weekday[this.date.getDay()-1];
        this.createOrUpdateView();
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

        this.createOrUpdateView();
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

        this.$submitField
            .text(this.options.submittext)
            .on("click", $.proxy(this.submit, this))
            .appendTo(this.$calendar);

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
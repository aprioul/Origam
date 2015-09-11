
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
        templateWeek: '<div class="origam-datepick--view__week"></div>',
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
            weekTitle: 'view-week--title',
            weekContent: 'view-week--content',
            header: 'calendar-header--title',
            month: 'calendar-header--title__month',
            year: 'calendar-header--title__year',
            week: 'calendar-content--week',
            weekDay: 'calendar-content--week__day',
            days: 'calendar-content--days',
            row: 'calendar-content--days__week',
            day: 'calendar-content--days__day',
            selected: 'calendar-content--days__selected',
            today: 'calendar-content--days__today',
            otherMonth: 'calendar-content--days__disable',
            hover: 'calendar-content--days__hover'
        },
        submittext: 'OK',
        startdate: '',
        enddate: '',
        startin : 0,
        weektext: 'Week',
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
        createView: function (content, $container) {
            if(content.time){
                $container.append(content.time);
            }
            if(content.dayL){
                $container.append(content.dayL);
            }
            if(content.month){
                $container.append(content.month);
            }
            if(content.dayN){
                $container.append(content.dayN);
            }
            if(content.week){
                $container.append(content.week);
            }
            if(content.year){
                $container.append(content.year);
            }
        }
    });

    Datepicker.prototype = $.extend({}, $.fn.input.Constructor.prototype);

    Datepicker.prototype.constructor = Datepicker;

    Datepicker.prototype.event = function (options) {
        this.options            = this.getOptions(options);
        this.type               = this.$element.attr('type') && this.$element.attr('type')!== 'text' ? this.$element.attr('type') : this.options.type;
        this.lang               = navigator.language || navigator.userLanguage;
        this.date               = this.options.startdate.length !== 0 ? new Date(this.options.startdate) : this.$element.val() ? this.$element.val() : new Date();
        this.today              = new Date();
        this.currentDay         = this.date;
        this.seconds            = this.date.getSeconds();
        this.minutes            = this.date.getMinutes();
        this.hours              = this.date.getHours();
        this.day                = new Array();
        this.day.letter         = this.options.weekday[this.date.getDay()];
        this.day.number         = this.date.getDate();
        this.week               = this.getWeekNumber(this.date);
        this.month              = new Array();
        this.month.letter       = this.options.month[this.date.getMonth()];
        this.month.number       = this.date.getMonth();
        this.year               = this.date.getFullYear();
        this.viewContent        = new Array();

        this.$overlay = $(this.options.templateOverlay);
        this.$element.data('origam-'+ this.type +'pickId', this.id);

        this.$datepick = $(this.options.templateWrapper)
            .attr('id', this.id)
            .addClass('origam-datepick--' + this.type);

        this.$submitField = $(this.options.templateSubmit).attr('data-target', '#' + this.id);

        this.$view = $(this.options.templateView);

        this.$viewDayL = $(this.options.templateDayL);
        this.$viewDayN = $(this.options.templateDayN);
        this.$viewWeek = $(this.options.templateWeek);
        this.$viewMonth = $(this.options.templateMonth);
        this.$viewYear = $(this.options.templateYear);

        this.$viewWeekContent = $('<span/>').addClass(this.classes.weekContent);
        var weekTitle = $('<span/>')
            .addClass(this.classes.weekTitle)
            .text(this.options.weektext);

        this.$viewWeek
            .append(this.$viewWeekContent)
            .append(weekTitle);

        this.$form = $(this.options.templateForm);

        if(this.type !== 'time') {

            this.$next = $(this.options.templateNext);
            this.$prev = $(this.options.templatePrev);
            this.$month = $('<span/>').addClass(this.classes.month);
            this.$year = $('<span/>').addClass(this.classes.year);
            this.$title = $('<div/>').addClass(this.classes.header);
            this.$header = $(this.options.templateCalendarHeader);

            if (this.type !== 'month') {

                this.$days = $('<div/>').addClass(this.classes.days);
                this.$week = $('<div/>').addClass(this.classes.week);

                this.createWeekDays();

            }

        }

        if(this.browser.chrome){
            this.$element
                .closest(this.$parent)
                .addClass(this.classes.active);
        }

        this.$element
            .parents(this.$parent)
            .on('click', $.proxy(this.show, this));
    };

    Datepicker.prototype.getDefaults = function () {
        return Datepicker.DEFAULTS
    };

    Datepicker.prototype.submit = function() {
        this.updateView();
        var value = this.result.join('-');
        this.$element
            .val(value)
            .change();
        this.hide();
    };

    Datepicker.prototype.updateView = function(){
        this.result = new Array();

        if(this.type !== 'time') {
            this.$viewYear.text(this.year);
            this.viewContent.year = this.$viewYear;
            this.result.push(this.year);

            if(this.type !== 'month' && this.type !== 'date' && this.type !== 'datetime') {
                this.$viewWeek.text(this.week);
                this.viewContent.week = this.$viewWeek;
                this.result.push('W' + this.week);
            }

            if(this.type !== 'week') {
                this.$viewMonth.text(this.month.letter.substring(0, 3) + '.');
                this.viewContent.month = this.$viewMonth;
                this.result.push(('0' + (this.month.number + 1)).slice(-2));
            }

            if(this.type !== 'month' && this.type !== 'week') {
                this.$viewDayL.text(this.day.letter);
                this.viewContent.dayL = this.$viewDayL;
                this.$viewDayN.text(this.day.number);
                this.viewContent.dayN = this.$viewDayN;
                this.result.push(('0' + this.day.number).slice(-2));
            }
        }else {
            console.log('View Time');
        }
    };

    Datepicker.prototype.update = function(day, month, year){
        this.updateYear(year);
        this.updateMonth(month);
        if(this.type !== 'month' && this.type !== 'date' && this.type !== 'datetime') {
            this.updateWeek(day, month, year);
        }
        if(this.type !== 'month') {
            this.updateDay(day, month, year);
        }
    };

    Datepicker.prototype.updateYear = function (year) {
        this.year = year;
        this.$year.text(year);
    };

    Datepicker.prototype.updateMonth = function (month) {
        this.month.number = month;
        this.month.letter = this.options.month[month];
        this.$month.text(this.options.month[month]);
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

        this.update(this.day.number, month, year);
        if(this.type === 'month'){
            this.updateView();
        }
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

        this.update(this.day.number, month, year);
        if(this.type === 'month'){
            this.updateView();
        }
    };

    Datepicker.prototype.updateWeek = function (day, month, year) {
        var d = new Date(year, month, day);

        this.week = this.getWeekNumber(d);
    };

    Datepicker.prototype.getWeekNumber = function(d) {
        // Copy date so don't modify original
        d = new Date(+d);
        d.setHours(0,0,0);
        // Set to nearest Thursday: current date + 4 - current day number
        // Make Sunday's day number 7
        d.setDate(d.getDate() + 4 - (d.getDay()||7));
        // Get first day of year
        var yearStart = new Date(d.getFullYear(),0,1);
        // Calculate full weeks to nearest Thursday
        var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
        // Return array of year and week number
        return weekNo;
    };

    Datepicker.prototype.updateDay = function (day, month, year) {
        var d = new Date(year, month, day);

        this.day.number = day;
        this.day.letter = this.options.weekday[d.getDay()];

        this.updateCalendar(month, year);
    };

    Datepicker.prototype.updateCalendar = function(month, year){
        var that = this,
            data = this.getCalendarData(month, year);

        this.$days.html('');

        $.each(data, function (indexRow, valueRow) {

            var $row = $('<div/>')
                .addClass(that.classes.row)
                .appendTo(that.$days);

            if(that.type === 'week') {
                $row.on('click', $.proxy(that.getValue, that));
            }

            $.each(data[indexRow], function (indexField, valueField) {

                var classes = that.classes.day;
                classes += valueField.today ? ' ' + that.classes.today : '';
                classes += valueField.selectedMonth ? '' : ' ' + that.classes.otherMonth;

                if(that.type !== 'week') {
                    classes += valueField.selected ? ' ' + that.classes.selected : '';
                } else {
                    if(valueField.selected) {
                        $row.addClass(that.classes.selected);
                    }
                }

                var $field = $('<div/>')
                    .addClass(classes)
                    .text(valueField.value)
                    .appendTo($row);

                if(that.type !== 'week') {
                    $field.on('click', $.proxy(that.getValue, that));
                }

            });

        });

    };

    Datepicker.prototype.getCalendarData = function (month, year){
        var thisMonth = new Date( year, month + 1, 0),
            monthLength = thisMonth.getDate(),
            firstDay = new Date( year, month, 1),
            prevMonth = new Date( year, month, 0),
            prevMonthLength = prevMonth.getDate(),
            nextMonthDay = 1,
            day = 1,
            index = 0,
            row = 0,
            optDataRow = [];

        this.startingDay = firstDay.getDay();

        // this loop is for weeks (rows)
        for ( var week = 0; week < 7; week++ ) {

            var optDataField = [],
                column = 0

            if (day > monthLength) {
                break;
            }

            // this loop is for weekdays (cells)
            for (var weekday = 0; weekday <= 6; weekday++) {
                var pos = this.startingDay - this.options.startin,
                    p = pos < 0 ? 6 + pos + 1 : pos,
                    today = month === this.today.getMonth() && year === this.today.getFullYear() && day === this.today.getDate(),
                    selected = month === this.currentDay.getMonth() && year === this.currentDay.getFullYear() && day === this.currentDay.getDate(),
                    weekDaySelected = this.date.getDay();

                var data = {
                    'index': index,
                    'value': 0,
                    'selected': false,
                    'today' : today ? true : false,
                    'selectedMonth': false
                };

                if (selected || (this.type === 'week' && ((day >= (this.currentDay.getDate() - weekDaySelected)) && (day <= (this.currentDay.getDate() + (6 - weekDaySelected)))))){
                    data.selected = true;
                }

                if ( day <= monthLength && ( week > 0 || weekday >= p ) ) {
                    data.value = day;
                    data.selectedMonth = true;
                    day++;
                } else if (day < monthLength) {
                    data.value = prevMonthLength - (p - (weekday + 1));
                } else {
                    data.value = nextMonthDay;
                    nextMonthDay++;
                }

                optDataField[column] = data;
                index++;
                column++;
            }

            optDataRow[row] = optDataField;
            row++;

        }
        return optDataRow;
    };

    Datepicker.prototype.updateTime = function(hours, minutes, seconds){
        console.log(hours);
        console.log(minutes);
        console.log(seconds);
    };

    Datepicker.prototype.createForm = function(){

        if(this.type !== 'time') {

            this.$next.on('click', $.proxy(this.next, this));
            this.$prev.on('click', $.proxy(this.prev, this));

            this.update(this.day.number, this.month.number, this.year);

        } else {
            this.updateTime(this.hours, this.minutes, this.seconds);
        }

        this.$submitField
            .text(this.options.submittext)
            .on("click", $.proxy(this.submit, this));

    };

    Datepicker.prototype.createWeekDays = function(){
        var that = this;

        $.each( this.options.weekday , function (index, day) {
            var weekDay = $('<div/>')
                .addClass(that.classes.weekday)
                .text(day.substring(0, 1));

            that.$week.append(weekDay);
        });
    };

    Datepicker.prototype.getValue = function(e){
        this.update(e.target.innerText, this.month.number, this.year);
        this.updateView();
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

        if(this.type !== 'time') {
            this.$title
                .append(this.$month)
                .append(this.$year);


            this.$header
                .append(this.$prev)
                .append(this.$title)
                .append(this.$next);

            if(this.type !== 'month') {

                this.$content = $(this.options.templateCalendarContent)
                    .append(this.$week)
                    .append(this.$days);
            }
        }

        this.$form
            .append(this.$header)
            .append(this.$content)
            .append(this.$submitField);

        this.updateView();
        this.options.createView(this.viewContent, this.$view);
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
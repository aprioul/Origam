
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
        templateTime: '<div class="origam-datepick--view__time"></div>',
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
        templatePrev: '<span class="origamicon origamicon-angle-left"></span>',
        templateNext: '<span class="origamicon origamicon-angle-right"></span>',
        classes: {
            focus: 'text-field--focused',
            active: 'text-field--active',
            addonsLeft: 'text-field--addons left',
            addonsRight: 'text-field--addons right',
            weekTitle: 'view-week--title',
            weekContent: 'view-week--content',
            header: 'calendar-header--title',
            col: 'calendar-header--title__col',
            selector: 'title-col--selector',
            week: 'calendar-content--week',
            weekDay: 'calendar-content--week__day',
            days: 'calendar-content--days',
            row: 'calendar-content--days__week',
            day: 'calendar-content--days__day',
            selected: 'calendar-content--days__selected',
            today: 'calendar-content--days__today',
            otherMonth: 'calendar-content--days__disable',
            hover: 'calendar-content--days__hover',
            canvas: 'view-canvas',
            prev : 'title-col--prev',
            next: 'title-col--next'
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
            if(content.clock){
                $container.append(content.clock);
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

    /**
     * @Implement event
     *
     * @define Add event to input. This input Event make datepicker
     *
     * @param options
     *
     * @returns {Datepicker}
     */
    Datepicker.prototype.event = function (options) {
        this.options            = this.getOptions(options);
        this.type               = this.$element.attr('type') && this.$element.attr('type')!== 'text' ? this.$element.attr('type') : this.options.type;
        this.lang               = navigator.language || navigator.userLanguage;
        this.viewContent        = new Array();

        this.date               = this.options.startdate.length !== 0 ? new Date(this.options.startdate) : this.$element.val() ? this.$element.val() : new Date();
        this.today              = new Date();
        this.currentDay         = this.date;
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

        this.$overlay = $(this.options.templateOverlay);
        this.$element.data('origam-'+ this.type +'pickId', this.id);

        this.$datepick = $(this.options.templateWrapper)
            .attr('id', this.id)
            .addClass('origam-datepick--' + this.type);

        this.$submitField = $(this.options.templateSubmit).attr('data-target', '#' + this.id);

        this.$view = $(this.options.templateView);

        this.$viewTime = $(this.options.templateTime);
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

        this.$header = $(this.options.templateCalendarHeader);
        this.$title = $('<div/>').addClass(this.classes.header);
        this.$content = $(this.options.templateCalendarContent);

        this.col = new Array();
        this.nextArraw = new Array();
        this.prevArraw = new Array();
        this.selector = new Array();

        for( var j = 0; j < 2; j++) {
            this.col[j] = $('<span/>').addClass(this.classes.col);
            this.selector[j] = $('<span/>').addClass(this.classes.selector);
            this.nextArraw[j] = $(this.options.templateNext).addClass(this.classes.next);
            this.prevArraw[j] = $(this.options.templatePrev).addClass(this.classes.prev);
        }

        if(this.type !== 'time') {
            if (this.type !== 'month') {
                this.$days = $('<div/>').addClass(this.classes.days);
                this.$week = $('<div/>').addClass(this.classes.week);
            }
        } else {
            this.$clock = $('<canvas/>')
                .attr('width','250')
                .attr('height','250')
                .addClass(this.classes.canvas);

            this.initDraw();
        }

        this.$element
            .parents(this.$parent)
            .on('click', $.proxy(this.show, this));

        $(w).on('resize', $.proxy(this.moveModal(this.$datepick), this));
    };

    Datepicker.prototype.getDefaults = function () {
        return Datepicker.DEFAULTS
    };

    /**
     * @Implement updateView
     *
     * @define Update view in datepicker and set result variables
     */
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
            var minutesText = this.minutes < 10 ? '0' + this.minutes : '' + this.minutes;
            this.$viewTime.text(this.hours + ':' + minutesText);
            this.viewContent.time = this.$viewTime;
            this.result.push(this.$viewTime.text());
            this.drawClock();
            this.viewContent.clock = this.$clock;
        }
    };

    /**
     * @Implement initDraw
     *
     * @define set clock variables
     */
    Datepicker.prototype.initDraw = function(){
        this.ctx = this.$clock[0].getContext("2d");
        this.radius = this.$clock[0].height /2;
    };

    /**
     * @Implement drawClock
     *
     * @define Init draw clock
     */
    Datepicker.prototype.drawClock = function(){
        this.ctx.translate(this.radius, this.radius);
        var radius = this.radius * 0.90;
        this.drawFace(radius);
        this.drawNumbers(radius);
        this.drawTime(radius);
    };

    /**
     * @Implement drawFace
     *
     * @define Create background of clock
     *
     * @param radius
     */
    Datepicker.prototype.drawFace = function(radius){
        this.ctx.beginPath();
        this.ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'white';
        this.ctx.fill();

        this.ctx.lineWidth = 5;
        this.ctx.strokeStyle = '#1976D2';
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#333';
        this.ctx.fill();
    };

    /**
     * @Implement drawNumbers
     *
     * @define Draw hours in clock
     *
     * @param radius
     */
    Datepicker.prototype.drawNumbers = function(radius){
        var ang;
        var num;
        this.ctx.font = radius * 0.15 + "px arial";
        this.ctx.textBaseline = "middle";
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = '#333';
        for(num = 1; num < 13; num++){
            ang = num * Math.PI / 6;
            this.ctx.rotate(ang);
            this.ctx.translate(0, - radius * 0.85);
            this.ctx.rotate(-ang);
            this.ctx.fillText(num.toString(), 0, 0);
            this.ctx.rotate(ang);
            this.ctx.translate(0, radius * 0.85);
            this.ctx.rotate(-ang);
        }
    };

    /**
     * @Implement drawTime
     *
     * @define Draw hours and minutes
     *
     * @param radius
     */
    Datepicker.prototype.drawTime = function(radius){
        var hour = this.hours,
            minute = this.minutes;

        //hour
        hour = hour % 12;
        hour = (hour * Math.PI / 6)+
        (minute * Math.PI / (6 * 60));
        this.drawHand(this.ctx, hour, radius * 0.5, radius * 0.07);
        //minute
        minute = (minute * Math.PI / 30);
        this.drawHand(this.ctx, minute, radius * 0.8, radius * 0.07);
    };

    /**
     * @Implement drawHand
     *
     * @define Draw clock hand
     *
     * @param ctx
     * @param pos
     * @param length
     * @param width
     */
    Datepicker.prototype.drawHand = function(ctx, pos, length, width) {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.strokeStyle = '#333';
        ctx.moveTo(0,0);
        ctx.rotate(pos);
        ctx.lineTo(0, -length);
        ctx.stroke();
        ctx.rotate(-pos);
    };

    /**
     * @Implement resetDraw
     *
     * @define Reset clock
     */
    Datepicker.prototype.resetDraw = function(){
        this.ctx.translate(- this.radius, - this.radius);
        this.ctx.clearRect(0, 0, this.$clock[0].width, this.$clock[0].height);
    };

    /**
     * @Implement update
     *
     * @define Update each variables
     * depend of input type / data-type / option type
     *
     * @param day
     * @param month
     * @param year
     * @param hours
     * @param minutes
     */
    Datepicker.prototype.update = function(day, month, year, hours, minutes){
        if(this.type !== 'time') {
            this.updateYear(year);
            this.updateMonth(month);
            if (this.type !== 'month' && this.type !== 'date' && this.type !== 'datetime') {
                this.updateWeek(day, month, year);
            }
            if (this.type !== 'month') {
                this.updateDay(day, month, year);
            }
        } else {
            this.updateHours(hours);
            this.updateMinutes(minutes);
        }
    };

    /**
     * @Implement updateYear
     *
     * @definition Update year variables and selector
     *
     * @param year
     */
    Datepicker.prototype.updateYear = function (year) {
        this.year = year;
        this.selector[1].text(year);
    };

    /**
     * @Implement updateMonth
     *
     * @definition Update month variables and selector
     *
     * @param month
     */
    Datepicker.prototype.updateMonth = function (month) {
        this.month.number = month;
        this.month.letter = this.options.month[month];
        this.selector[0].text(this.options.month[month]);
    };

    /**
     * @Implement updateHours
     *
     * @definition Update hours variables and selector
     *
     * @param hours
     */
    Datepicker.prototype.updateHours = function(hours){
        this.hours = hours;
        this.selector[0].text(hours);
    };

    /**
     * @Implement updateMinutes
     *
     * @definition Update minutes variables and selector
     *
     * @param minutes
     */
    Datepicker.prototype.updateMinutes = function(minutes){
        this.minutes = minutes;
        var minutesText = minutes < 10 ? '0' + this.minutes : '' + minutes;
        this.selector[1].text(minutesText);
    };

    /**
     * @Implement updateWeek
     *
     * @definition Update week variables
     *
     * @param day
     * @param month
     * @param year
     */
    Datepicker.prototype.updateWeek = function (day, month, year) {
        var d = new Date(year, month, day);

        this.week = this.getWeekNumber(d);
    };

    /**
     * @Implement getWeekNumber
     *
     * @definition Get week number in year selected
     *
     * @param d
     *
     * @return weekNo
     */
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

    /**
     * @Implement updateDay
     *
     * @definition Update day variables and selector
     *
     * @param day
     * @param month
     * @param year
     */
    Datepicker.prototype.updateDay = function (day, month, year) {
        var d = new Date(year, month, day);

        this.day.number = day;
        this.day.letter = this.options.weekday[d.getDay()];

        this.updateCalendar(month, year);
    };

    /**
     * @Implement updateCalendar
     *
     * @definition Create calendar, depend of month and year
     *
     * @param month
     * @param year
     */
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

    /**
     * @Implement getCalendarData
     *
     * @definition set Data to make calendar
     *
     * @param month
     * @param year
     *
     * @return optDataRow
     */
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

    /**
     * @Implement createHeader
     *
     * @definition Create Header of datepicker, the header content
     * depend of type.
     * Type Time : Header contain Hours and Minutes selector
     * Type Date
     *      DateTime
     *      Month
     *      Week : Header contain Month and Years selector
     */
    Datepicker.prototype.createHeader = function(){
        var length = this.col.length,
            that = this;

        for ( var i = 0; i < length; i++){

            this.col[i]
                .append(this.prevArraw[i])
                .append(this.selector[i])
                .append(this.nextArraw[i]);

            this.prevArraw[i].on('click', $.proxy(that.prev, that));
            this.nextArraw[i].on('click', $.proxy(that.next, that));

            this.$title.append(this.col[i]);
        }

        this.$header
            .append(this.$title);
    };

    /**
     * @Implement createWeekDays
     *
     * @definition Create week days first letter before calendar
     */
    Datepicker.prototype.createWeekDays = function(){
        var that = this;

        this.$week.html('');

        $.each(this.options.weekday, function (index, day) {
            var weekDay = $('<div/>')
                .addClass(that.classes.weekday)
                .text(day.substring(0, 1));

            that.$week.append(weekDay);
        });
    };

    /**
     * @Implement createForm
     *
     * @definition Create form, form contain header, weekdays and calendar,
     * depend of input type / data-type / option type.
     */
    Datepicker.prototype.createForm = function(){

        this.createHeader();

        if(this.type !== 'month' && this.type !== 'time') {
            this.createWeekDays();
            this.$content
                .append(this.$week)
                .append(this.$days);
        }

        this.$form
            .append(this.$header)
            .append(this.$content)
            .append(this.$submitField);

        this.update(this.day.number, this.month.number, this.year, this.hours, this.minutes);

        this.$submitField
            .text(this.options.submittext)
            .on("click", $.proxy(this.submit, this));

    };

    /**
     * @Implement submit
     *
     * @definition Add submit event to datepicker
     */
    Datepicker.prototype.submit = function() {
        var value = this.result;

        this.updateView();
        if(this.type !== 'time') {
            value = this.result.join('-');
        }

        this.$element
            .val(value)
            .change();
        this.hide();
    };

    /**
     * @Implement next
     *
     * @definition add event next
     * You can choose next month, hours, minutes or year when you click on.
     *
     * @param e
     */
    Datepicker.prototype.next = function(e){
        var index = $(e.currentTarget.parentNode).index();
        this.updateCol(index, 'next');
    };

    /**
     * @Implement prev
     *
     * @definition add event prev
     * You can choose prev month, hours, minutes or year when you click on.
     *
     * @param e
     */
    Datepicker.prototype.prev = function(e){
        var index  = $(e.currentTarget.parentNode).index();
        this.updateCol(index, 'prev');
    };

    /**
     * @Implement updateCol
     *
     * @definition Update header content, depend of next and prev event.
     *
     * @param index
     * @param type
     */
    Datepicker.prototype.updateCol = function(index, type){
        var month = this.month.number,
            year = this.year,
            hours = this.hours,
            minutes = this.minutes;

        if(this.type !== 'time') {
            if(type === 'next') {
                if(index === 0) {
                    if (month < 11) {
                        month = month + 1;
                    } else {
                        month = 0;
                    }
                } else if(index === 1) {
                    year = year + 1;
                }
            }else {
                if(index === 0) {
                    if (month > 0) {
                        month = month - 1;
                    } else {
                        month = 11;
                    }
                } else{
                    year = year -1;
                }
            }
        } else {
            if(type === 'next') {
                if(index === 0) {
                    if (hours < 23) {
                        hours = hours + 1;
                    } else {
                        hours = 0;
                    }
                } else {
                    if (minutes < 59) {
                        minutes = minutes + 1;
                    } else {
                        minutes = 0;
                    }
                }
            }else {
                if(index === 0) {
                    if (hours > 0) {
                        hours = hours - 1;
                    } else {
                        hours = 23;
                    }
                } else {
                    if (minutes > 0) {
                        minutes = minutes - 1;
                    } else {
                        minutes = 59;
                    }
                }
            }
        }

        this.update(this.day.number, month, year, hours, minutes);
        if(this.type === 'month' || this.type === 'time'){
            this.updateView();
        }
        if(this.type === 'time'){
            this.resetDraw();
        }
    };

    /**
     * @Implement getValue
     *
     * @definition Get value of target (day or week)
     *
     * @param e
     */
    Datepicker.prototype.getValue = function(e){
        this.update(e.target.innerText, this.month.number, this.year);
        this.updateView();
    };

    /**
     * @Implement action
     *
     * @definition hide datepicker if user click outside modal and
     * if modal is active
     *
     * @param e
     */
    Datepicker.prototype.action = function(e){
        if (!this.mouseOnContainer && this.activate){
            this.hide();
        }
    };

    /**
     * @Implement show
     *
     * @definition Show datepick in modal when user click on input
     *
     * @param e
     */
    Datepicker.prototype.show = function (e) {
        var that            = this,
            viewportHeight  = $(window).height(),
            viewportWidtht  = $(window).width();

        this.activate           = true;

        this.$element.off('click', $.proxy(this.show, this));

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

    /**
     * @Implement hide
     *
     * @definition hide datepick
     *
     * @param e
     */
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
            if(that.type === 'time'){
                that.resetDraw();
            }
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
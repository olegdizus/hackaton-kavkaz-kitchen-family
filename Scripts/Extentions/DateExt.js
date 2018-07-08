
Date.prototype.addDays = function (days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

Date.prototype.monthFormat = function () {
    var monthNum = this.getMonth();
    var month = '';

    switch (monthNum) {
    case 0:
        month = 'Январь';
        break;
    case 1:
        month = 'Февраль';
        break;
    case 2:
        month = 'Март';
        break;
    case 3:
        month = 'Апрель';
        break;
    case 4:
        month = 'Май';
        break;
    case 5:
        month = 'Июнь';
        break;
    case 6:
        month = 'Июль';
        break;
    case 7:
        month = 'Август';
        break;
    case 8:
        month = 'Сентябрь';
        break;
    case 9:
        month = 'Октябрь';
        break;
    case 10:
        month = 'Ноябрь';
        break;
    case 11:
        month = 'Декабрь';
        break;
    }

    var str = this.getFullYear();

    return month + ' ' + str;
}

Date.prototype.addMonths = function (months) {
    var dat = new Date(this.valueOf());
    //dat.setMonth(dat.getMonth() + months);
    //return dat;

    if (months) {
        var m, d = (dat = new Date(+dat)).getDate();

        dat.setMonth(dat.getMonth() + months, 1);
        m = dat.getMonth();
        dat.setDate(d);
        if (dat.getMonth() !== m) dat.setDate(0);
    }
    return dat;
}

Date.prototype.isLeapYear = function () {

    var y = this.getFullYear();

    return y % 4 == 0 && y % 100 != 0 || y % 400 == 0;

};

Date.prototype.getDaysInMonth = function () {

    var days = arguments.callee.DaysOfMonth[this.getMonth()];

    if (this.isLeapYear() && this.getMonth() == 1) {
        days += 1;
    }
    return days;

};

Date.prototype.getDaysInQuarter = function () {
    var quarter = this.getQuarter();
    var days = arguments.callee.DaysOfQuearter[quarter];

    if (this.isLeapYear() && quarter == 1) {
        days += 1;
    }

    return days;
};

Date.prototype.getQuarter = function() {
    var date = new Date(this.valueOf());
    return arguments.callee.Quearter[Math.floor(date.getMonth() / 3)];
}

Date.prototype.getDaysInYear = function() {
    return this.isLeapYear() ? 366 : 365;
}

Date.prototype.getDaysInMonth.DaysOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
Date.prototype.getQuarter.Quearter = [1, 2, 3, 4];
Date.prototype.getDaysInQuarter.DaysOfQuearter = {
    1: 90,
    2: 90,
    3: 92,
    4: 92
}

Date.prototype.getEndOfMonthDate = function() {
    var date = this;

    date = new Date(date.addMonths(1));
    date.setDate(1);
    date.setDate(date.getDate() - 1);

    return date;
};

Date.prototype.getStartOfMonth = function () {
    var date = this;

    date = new Date(date);
    date.setDate(1);

    return date;
};

Date.prototype.toShortDateString = function () {

    var date = this;

    var month = date.getMonth() + 1;
    var day = date.getDate();

    var dateAsString = (day < 10 ? '0' : '') + day + '.'
              + (month < 10 ? '0' : '') + month + '.'
              + date.getFullYear();

    return dateAsString;
};


Date.prototype.toServerFormat = function () {

    var date = this;

    var month = date.getMonth() + 1;
    var day = date.getDate();

    var dateAsString = date.getFullYear() + '-' +
                (month < 10 ? '0' : '') + month + '-' +
                (day < 10 ? '0' : '') + day;

    return dateAsString;
};

Date.StrDMYtoDate= function (dateDMY) {

    console.log(dateDMY);

    var dateOfStrings = dateDMY.split('.');

    var date = new Date(
        dateOfStrings[2], dateOfStrings[1] - 1, dateOfStrings[0]);

    return date;
};

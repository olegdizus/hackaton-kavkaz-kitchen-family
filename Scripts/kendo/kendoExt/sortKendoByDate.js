var DateRangeFilter = new function () {

    this.getJSDates = function() {
        return {
            beginDate: $('#beginDatepicker').datepicker('getDate'),
            endDate: $('#endDatepicker').datepicker('getDate')
        };
    }

    this.setDates = function(beginDate, endDate) {
        this.setBeginDate(beginDate);
        this.setEndDate(endDate);
    }

    this.setBeginDate = function(date) {
        this.setDate('#beginDatepicker', date);
    }

    this.setEndDate = function(date) {
        this.setDate('#endDatepicker', date);
    }

    this.setDate= function(datepicker, date) {
        $(datepicker).datepicker('update', date);
    }
}

function getJSDates() {
    return {
        beginDate: $('#beginDatepicker').datepicker('getDate'),
        endDate: $('#endDatepicker').datepicker('getDate')
    };
}

//bindRefreshGridOnClick('#refresh', '#Grid');

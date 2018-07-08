$(function () { // TODO: Вынести в отдельный файл, избавиться от дублирования
    $('#datepicker')
        .datepicker({
            todayHighlight: true,
            autoclose: true,
            language: 'ru'
        });

    $('#perviosDay').click(function () {
        dateManager.cnangeDateToPrev();
    });

    $('#nextDay').click(function () {
        dateManager.cnangeDateToNext();
    });

});


var DateManager = function (changeDateCallback) {
    this.changeDateCallback = changeDateCallback;
};

DateManagerInit(DateManager.prototype);

function DateManagerInit(proto) {
    proto.cnangeDateToPrev = function () {

        this.changePlanByDate("Plan/GetNearMonthDate", false);
    };

    proto.cnangeDateToNext = function () {

        this.changePlanByDate("Plan/GetNearMonthDate", true);
    };

    proto.changePlanByDate = function (url, isNext) {
        var self = this;

        var date = getDateFromDatepicker();

        function parseJsonDate(str) {

            return new Date(eval(str.match(/\d+/)[0]));
        }

        $.ajax({
            url: basePath + url,
            data: { date: date, isNext: isNext },
            type: 'POST',
            success: function (data) {
                setDatePickerDate(parseJsonDate(data.date), data.title);

                self.changeDateCallback();
            },
            error: function (data) {
                showError('При смене даты произошла ошибка');
            }
        });
    }
}

function setDatePickerDate(date, dateStr) {
    $('#currDate')
        .text(dateStr);

    $('#datepicker').datepicker("setDate", date);
}

function getDateFromDatepicker() {
    return $('#datepicker').val() || date;
}

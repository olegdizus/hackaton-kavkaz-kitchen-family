$(document).ready(function () {
    $(".dropdown-toggle").dropdown();
});

var selectItems = [
    {
        title: "Сумма продаж",
        value: "СуммаПродаж"
    },
    {
        title: "Вес продаж",
        value: "ВесПродаж"
    },
    {
        title: "Плановая сумма",
        value: "ПлановаяСумма"
    },
    {
        title: "Количество отгрузок",
        value: "КоличествоОтгрузок"
    },
    {
        title: "Количество сработавших ТТ",
        value: "КоличествоСработавшихТТ"
    }
];

var selectedItem = "СуммаПродаж";

var fillSelectList = function () {

    for (var i = 0; i < selectItems.length; i++) {

        $('#indicators').append('<label class="btn btn-default ' +
        ((selectItems[i].value === selectedItem) ? 'active' : '')
        + '" for="q' + i + '"><input type="radio" name="indicator"'
        + ' value="' + selectItems[i].value + '" id="q' + i + '" >' + selectItems[i].title + '</label>');
    }

    $('#indicators input:radio').click(function () {


    });
}

loadDataFromServer(date, createSectionViewModels, 'TestDataChart/GetData');

var mainDataReportGraphic = CreateGraphicViewModel(selectedItem);

function CreateGraphicViewModel(fieldName) {

    return graphicViewModel({
        mainHeader: "",
        dateOffset: {
            offset: -33,
            unit: 'day'
        },
        dataSet: [
            {
                label: "График отклонений",
                dataProvider: GetPlotDataProvider({
                    reportName: "СравнениеДанныхДЗ",
                    fieldName: fieldName,
                    measureCoof: 0.001
                }),
                redirect: getReportUrl("Показатели продаж"),
                color: "#2237D9"
            }
        ],
        rotateXaxesLabels: true,
        dateTickSize: [1, "day"],
        dateTimeFormat: "%d.%m.%y",
        showTrendline: true,
        showLegend: false,
        addHeight: 35
    });
}

function createSectionViewModels(date) {

    wigetsViewModels.add('mainDataReportGraphic', mainDataReportGraphic);

    date.setMonth(date.getMonth() + 1);

    wigetsViewModels.createWigets(date);
}

$(function () {
    $('#datepicker').datepicker({
        todayHighlight: true,
        autoclose: true,
        language: 'ru'
    }).datepicker("setDate", date);

    fillSelectList();

    $('label').click(function () {

        var input = $(this).find('input')[0];

        var val = $(input).val();

        mainDataReportGraphic = CreateGraphicViewModel(val);

        var date = getDateFromDatepicker();

        createSectionViewModels(date);
    });
});


function getDateFromDatepicker() {
    return $('#beginDatepicker').datepicker("getDate");
}

$(function () {
    $('#perviosDay').click(function () {
        dateManager.changeDateToPrev();
    });

    $('#nextDay').click(function () {
        dateManager.changeDateToNext();
    });

    setDatePickerDate(dateForDatePicker, dateForDatePickerStr);
});

var updateWidget = function () {
    var date = getDateFromDatepicker();

    loadDataFromServer(date, function () {

        date.setMonth(date.getMonth() + 1);

        wigetsViewModels.updateAllWidgets(date);
    }, 'TestDataChart/GetData');
}

var dateManager = {
    changeDateToPrev: function () {

        this.changePlanByDate(basePath + "Plan/GetNearMonthDate", false);
    },
    changeDateToNext: function () {

        this.changePlanByDate(basePath + "Plan/GetNearMonthDate", true);
    },
    changePlanByDate: function (url, isNext) {

        var date = getDateFromDatepicker();

        function parseJsonDate(str) {

            return new Date(eval(str.match(/\d+/)[0]));
        }

        $.ajax({
            url: url,
            data: { date: date.toServerFormat(), isNext: isNext },
            type: 'POST',
            success: function (data) {
                setDatePickerDate(parseJsonDate(data.date), data.title);
                updateWidget();
            },
            error: function (data) {
                console.log('При смене даты произошла ошибка');
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
    return $('#datepicker').datepicker("getDate");
}
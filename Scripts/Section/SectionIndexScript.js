var date = new Date();
date.setHours(0, 0, 0, 0);

var userSettingsManager = new UserSettingManager(userSettings);

var filterControl = new FilterControl({
    indicatorsUrl: basePath + 'Filters/GetSectionGroupValues',
    onFilterChanged: userSettingsManager.UpdateByFilters
});

filterControl.SetOnRefreshButtonClick(function() {
    filterControl.showLoadingData(true);
        wigetsViewModels.clearCache();
        updateWidgetsWithData(false);
});

createSectionViewModels();

loadFaceDataWithCustomData(date, userSettingsManager.getSetting('selectedFilters'), update);

function update(date) {
    wigetsViewModels.updateAllWidgets(date);
}

function createSectionViewModels(date) {

    //createSpeedometersViewModels();
    createGraphicsViewModels();
    createSalesCardsViewModels();
    //createReceivableCardsViewModels();
    //createWaffleChartViewModels(isCalendarMonthUse);
    //createPieCharts();
    //createBasicMaterialTableViewModels();

    wigetsViewModels.createWigets(date);
}

function getFiltersAsString() {
    try {
        return JSON.stringify(filterControl.getFilterValues());

    }
    catch (ex) {
        console.log('При вызове функции getFiltersAsString произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

    }
}

function updateWidgetsWithData(isUpdateLocalFilters) {


    try {
        console.log("Start " + new Date());
        var beforeDataLoad = function () {
            var date = getDateFromDatepicker();

            if (!/([0-2]\d|3[01])\.(0\d|1[012])\.(\d{4})/.test(date)) {
                console.log('не прошел валидацию');
                return;
            }
            console.log('прошел валидацию');

            filterControl.updateModalFilters({ beginDate: date.toServerFormat() });
        }

        var data = getFiltersAsString();

        var beforeLoadFunc = isUpdateLocalFilters ? beforeDataLoad : null;

        wigetsViewModels.updateWidgetsWithData(getDateFromDatepicker(), data, beforeLoadFunc, filterControl.onRefreshButtonClickCallback);
        console.log("End " + new Date());

    }
    catch (ex) {
        console.log('При вызове функции updateWidgetsWithData произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

    }

}

$(function () {
    try {
        $("#loadingFilterEnabled").hide();

        $('#datepicker').datepicker({
            todayHighlight: true,
            autoclose: true,
            language: 'ru'
        }).datepicker("setDate", date);

        $('#perviosDay').click(function () {
            addDaysToDate(-1);
        });

        $('#nextDay').click(function () {
            addDaysToDate(1);
        });

        $('#datepicker').change(function () {
            var date = $('#datepicker').val();

            if (!/([0-2]\d|3[01])\.(0\d|1[012])\.(\d{4})/.test(date)) {
                return;
            }

            updateWidgetsWithData(true);

        });

    } catch (ex) {
        console.log('При инициализации datepicker произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

    }

    function addDaysToDate(days) {
        try {
            var date = getDateFromDatepicker();

            $('#datepicker').datepicker("setDate", new Date(date.setDate(date.getDate() + days)));
        } catch (ex) {
            console.log('При попытке изменить дату на датапикере произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

        }


    }

    filterControl.loadGroups();

    var initDate = getDateFromDatepicker();

    filterControl.fillGroups(
        { beginDate: initDate.toServerFormat() },
        function() {
            filterControl.fillFromString(userSettingsManager.getSetting('selectedFilters'));
            filterControl.bindControlsWithRefreshButton();
        });
});

function getDateFromDatepicker() {
    try {
        return $('#datepicker').datepicker("getDate");

    }
    catch (ex) {
        console.log('При получении даты, установленной на датапикере, произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

    }
}

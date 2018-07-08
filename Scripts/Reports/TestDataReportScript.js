var date = new Date();
date.setHours(0, 0, 0, 0);

var settingManager = new UserSettingManager(userSetting);

var viewModel = {
    date: ko.observable(settingManager.getSetting('singleDate')),
}

ko.applyBindings(viewModel);

$(".datepicker").datepicker({
    autoclose: true,
    language: 'ru'
}).datepicker("setDate", date);;

$('#perviosDay').click(function() {
    addDaysToDate(-1);
});

$('#nextDay').click(function() {
    addDaysToDate(1);
});

$('#periodDatepicker').change(
    function() {
        settingManager.setSetting('date', viewModel.date());
        settingManager.updateSettings(function() {
            createGrid();
        });
    });

createGrid();

$('#refresh').click(createGrid);

function createGrid() {
    $('#grid').empty();

    CreateTestDataGrid(
        dataReportUrl,
        columnNamesUrl,
       detailUrl);
}

function addDaysToDate(days) {
    date = getDateFromDatepicker();

    $('#periodDatepicker').datepicker("setDate", new Date(date.setDate(date.getDate() + days)));
}

function getDateFromDatepicker() {
    return $('#periodDatepicker').datepicker("getDate");
};
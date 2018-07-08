var settingManager = new UserSettingManager(window.userSettings);

var filterControl = new FilterControl({
    button: "#refresh",
    activateRefreshButtonSelector: ".activateRefreshButton",
    onRefreshButtonClick: RefreshButtonClick,
    onFilterChanged: settingManager.UpdateByFilters
});


$(document).ready(function() {

        $("#periodTypeList").change(function() {
            updatePeriods();
        });

        $('#isLastPeriod').change(function() {
            TogglePeriodList(this.checked);
        });

        var dateRange = settingManager.getDateRange("dateRange");

        $('#beginDatepicker').datepicker('setDate', dateRange.beginDate);
        $('#endDatepicker').datepicker('setDate', dateRange.endDate);

        filterControl.loadGroups();

        filterControl.fillGroups(getDates(), function() {

            filterControl.fillFromString(settingManager.getSetting('selectedFilters'));
            updateAllComponents(false);
            ClearTotalFooter();
            filterControl.bindControlsWithRefreshButton();
        });

        updateAllComponents(true);

        $('#grid').width($('#bubbleParentDiv').width());
        $('#gridTotal').width($('#bubbleParentDiv').width());

        $('#beginDatepicker').change(function() {
            updateFilterControl();
        });

        $('#endDatepicker').change(function() {
            updateFilterControl();
        });

        $('#SaveUserSettingsLink').click(
        function () {
            settingManager.saveSettingsLink();
        }
    );


});

$('#refresh').on('click', function () {

    RefreshButtonClick();
});

function RefreshButtonClick() {
    console.log("- Start - "+new Date());

    filterControl.showLoadingData(true);

    filterControl.lockRefreshButton();

    updateAllComponents(false);

    ClearTotalFooter();

    filterControl.dislockRefreshButton();
    filterControl.updateButtonStatus(false);

    filterControl.onRefreshButtonClickCallback();
    console.log("- End - "+new Date());
}


$("#resizeBubbleChartButton").click(function () {

    InitBubbleChart(false);
    redrawChart();

    $('#resizeBubbleChartButton').blur();
});

$('#collapsedDimensions').on('show.bs.collapse', function (e) {

    var target = $('#' + e.target.id);

    if (target.is('#collapsedDimensions')) {
        $('#toggleButton').html('<span class="glyphicon glyphicon-chevron-up"></span> Свернуть');
        $('#toggleButton').blur();
    }
});

$('#collapsedDimensions').on('hide.bs.collapse', function (e) {

    var target = $('#' + e.target.id);

    if (target.is('#collapsedDimensions')) {
        $('#toggleButton').html('<span class="glyphicon glyphicon-chevron-down"></span> Развернуть');
        $('#toggleButton').blur();
    }
});

function updateFilterControl() {

    
    filterControl.updateModalFilters(getDates());

    settingManager.updateDateRangeSetting($('#beginDatepicker').val(), $('#endDatepicker').val());
    settingManager.updateSettings();
}
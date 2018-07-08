var gridName = '#Grid';

$(document).ready(function () {

    
    $('#beginDatepicker').datepicker({
        todayHighlight: true,
        autoclose: true,
        language: 'ru'
    }).datepicker("setDate", '@ViewBag.reportDate');

    $('#beginDatepicker').val(
        userSettingsManager.getSetting('singleDate'));
});


var grid = $(gridName);

var contraagentUrl = basePath + 'DebitoreReportOlap/GetAllAgreements';
var agreementAndDocumentUrl = basePath + 'DebitoreReportOlap/GetDocuments';


var options = {};

var createDebitoreReportGrid = function (gridDiv, e) {

    options = {
        contactGridUrl: contraagentUrl,
        agreementAndDocumentUrl: agreementAndDocumentUrl,
        getColumnsUrl: contraagentUrl,
        onBuilding: function (configuration) {
        },
        onBuilded: function (grid) {
            var kendoGrid = grid.data('kendoGrid');

            kendoGrid.dataSource.read();

            KendoPlugins.partialRender(grid);

            KendoPlugins.SecondaryHierarchy(grid.data('kendoGrid'));

        },
        filters: e ? e.filters : null,
        elementaryKeyField: 'Contact_Document'
    };


    return CreateDebitoreReportGridOlap(
        grid,
        options
    );;
};

$('#refresh').on('click', function ()
{
    var newReportDate = $("#beginDatepicker").val();

    userSettingsManager.setSetting('singleDate', newReportDate);

    console.log(userSettingsManager.getSetting('singleDate'));

    userSettingsManager.updateSettings(function () { }, function () { });

    refreshClickCallBack();
});

var refreshClickCallBack = function(settingManager, gridColumnsManager) {

    KendoDebitoreDataSource.localContragent = null;
    refreshGridColumn(getGridOption.getGridOption, options);
};

var userSettingsManager = new UserSettingManager(userSettings);

var settingManager = ReportUserSettingManager.createInstance(
    userSettings,
    grid,
    refreshClickCallBack,
    false,
    function(filters) {
        var kendoGrid = grid.data('kendoGrid');

        for (var inxGroup in filters) {
            var fields = filters[inxGroup].fields;
            if (fields) {
                for (var idx in fields) {
                    if (fields[idx].field) {
                        if (fields[idx].isActive) {
                            kendoGrid.showColumn(fields[idx].field);
                        } else {
                            kendoGrid.hideColumn(fields[idx].field);
                        }
                    }

                }
            }
        }
    },
    true,
    ["Contact_Agreement", "Contact_Document"]
);

var expiredFilterContainer = $("#FilterContainer");

var debitoreExpiredManager = DebitoreExpiredManager.createInstance(
    userSettings,
    expiredFilterContainer,
    function (expiredPeriods) {
        var kendoGrid = grid.data('kendoGrid');
        KendoDebitoreDataSource.expiredPeriods = expiredPeriods;
        kendoGrid.dataSource.read();
    }
);

KendoPlugins.attach(gridName, KendoPlugins.addTotalRowFromJson);

KendoPlugins.attach(gridName, KendoPlugins.DebitoreExpiredPeriod(debitoreExpiredManager));

KendoPlugins.attach(gridName, KendoPlugins.UserSettings(settingManager));

var getGridOption = createDebitoreReportGrid(grid, {
    filters: { filterVal: debitoreExpiredManager.getActiveFilters() }
});

settingManager.initReportDate();





var gridName = '#Grid';

var gridDiv = $(gridName);

var settingManager = ReportUserSettingManager.createInstance(
    userSettings,
    gridDiv,
    function (settingManager) {

        //сохраняем выбранный диапазон дат
        settingManager.updateDateRangeSetting($('#beginDatepicker').val(), $('#endDatepicker').val());
    });

var userSettingsManager = new UserSettingManager(userSettings);

var filterControl = new FilterControl({
    button: "#refresh",
    activateRefreshButtonSelector: ".activateRefreshButton",
    onRefreshButtonClick: refreshGrid,
    onFilterChanged: userSettingsManager.UpdateByFilters
});

settingManager.initDateRange();

var url = basePath + 'SalesIndicatorReportOLAP/GetSubGroups';

KendoPlugins.attach(gridName, KendoPlugins.UserSettings(settingManager));
KendoPlugins.attach(gridName, KendoPlugins.setRedColorToNegativeNumbers);
KendoPlugins.attach(gridName, KendoPlugins.HiglightIndicator(window.cardType));
KendoPlugins.attach(gridName, KendoPlugins.addTotalRowFromJson);

KendoPlugins.attach(gridName, KendoPlugins.additionalData(function() {
    return {
        jsonFilters: JSON.stringify(filterControl.getFilterValues())
    }
}));

var createNomenclatureGrid = function(gridDiv, e) {

    CreateSalesIndicatorsByNomenclatureGridOLAP(
        gridDiv,
        {
            url: url,
            deliveriesUrl: deliveriesUrl,
            onBuilded: function(gridDiv) {
                var kendoGrid = gridDiv.data('kendoGrid');

                if (e) {
                    kendoGrid.firstHierarchy = e.firstHierarchy;
                }

                kendoGrid.dataSource.read();

                KendoPlugins.partialRender(gridDiv);

                KendoPlugins.SecondaryHierarchy(gridDiv.data('kendoGrid'));
            },
            createAggregateGrid: createContactGrid,
            filters: e ? e.filters : null,
            elementaryKeyField: 'Delivery_name'
        });
};

var createContactGrid = function(gridDiv, e) {

    CreateSalesIndicatorsByContactGridOLAP(
        gridDiv,
        {
            contactGridUrl: url,
            deliveriesGridUrl: deliveriesGridUrl,
            onBuilded: function (grid) {

                var kendoGrid = gridDiv.data('kendoGrid');
                filterControl.showLoadingData(true);
                kendoGrid.dataSource.read();

                KendoPlugins.partialRender(grid);

                KendoPlugins.SecondaryHierarchy(grid.data('kendoGrid'));

            },
            createAggregateGrid: createNomenclatureGrid,
            filters: e ? e.filters : null,
            elementaryKeyField: 'Delivery_name'
        }
    );
};

createContactGrid(gridDiv);

$(function() {
    filterControl.bindAndInit('#beginDatepicker', '#endDatepicker', function() {
        filterControl.fillFromString(userSettingsManager.getSetting('selectedFilters'));
    });

    filterControl.bindControlsWithRefreshButton();

    $('#refresh').on('click', refreshGrid);
});


function refreshGrid() {
    filterControl.showLoadingData(true);
    gridDiv.empty();
    createContactGrid(gridDiv);
}
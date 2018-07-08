var aggregateTypes =
{
    simple: 'simple',
    growth: 'growth',
    average: 'average',
    percent: 'percent'
}


function CreateAnalizeByPeriodsGridOLAP(grid, options, parseResponseFunction) {
    var gridColumnsAndGroups = {
        get: function () {
            var valueCols = [];
            filterControl.showLoadingData(true);
            getColumnsByPeriod(valueCols);

            setAggregateToColumns(valueCols, ["sum"]);

            setColumnFormat(valueCols);

            var hierarchyCols = GetHierarchyFields('AnalizeByPeriodsOLAP');

            var columns = [{
                    field: 'Delivery_name',
                    title: 'Отгрузка',
                    isDetail: true
            }
                //,
                //{
                //    field: 'Contact_Group_Name',
                //    title: 'Папка контрагента',
                //    //isFolder: true,

                //    isHierarchy: true,
                //    HierarchyLevel: 1,

                //    isGroup: true,
                //    groupingField: true
                //}
            ];

            columns = columns
                .concat(
                    hierarchyCols
                    .concat(valueCols));


            var sumAggregates =
                getAggregatesByColumn(columns);

            var groupFields = getGroupFields(hierarchyCols, sumAggregates);

            return {
                groupFields: groupFields,
                columns: columns,
                sumAggregates: sumAggregates
            }
        }
    }

    $('#onlyColorShow')
        .change(
            function () {
                //TODO: изменение настроек
                refreshGrid();
            });

    $('#sortByColor')
        .change(
            function () {
                //TODO: изменение настроек
                refreshGrid();
            });

    $(".datepicker").datepicker({
        language: 'ru',
        autoclose: true,
        todayHighlight: true,
        change: function () {

            setParaments();

            filterControl.updateButtonStatus(true);
        }
    });

    var gridBuider = new KendoGridBuider(getGridOption());
    gridBuider.buid();

    function getGridOption() {

        var fields = {};

        return {
            afterDataBound: options.afterDataBound,
            gridDiv: grid,
            getDataSource: function (contacts) {
                var AddContactAttributesToElementaryItem = function (items) {
                }
                var userSettingsMngr = gridColumnsAndGroups.get();
                //TODO: заплатка. Разобраться, Переделать.
                var sortField = {};

                var aggregates = userSettingsMngr.sumAggregates;
                if (aggregates.length != 0) {
                    sortField = {
                        field: aggregates[aggregates.length - 1].field,
                        dir: "asc"
                    };
                }

                return KendoOlapDataSource.GetDataSource
                (
                    options.contactGridUrl,
                    fields,
                    userSettingsMngr.groupFields,
                    userSettingsMngr.sumAggregates,
                    AddContactAttributesToElementaryItem,
                    options.elementaryKeyField,
                    options.filters,
                    null,
                    sortField
                );
            },
            columns: gridColumnsAndGroups.get().columns,
            loadHierarchyAndBuid: LoadContactsHierarchy,
            onBuilding: options.onBuilding,
            onBuilded: options.onBuilded
        }

    }

    function getColumnsByPeriod(columnsParam) {
        var wcolumnsParam = window.wcolumnsParam;
        var data = getAnalizeData();

        var curDates = JSON.stringify(data);

        if (curDates != window.dates) {
        window.dates = curDates;

        window.wcolumnsParam = [];

        wcolumnsParam = window.wcolumnsParam;

        $.ajax({
            url: options.getColumnsUrl,
            type: 'post',
            async: false,
            dataType: 'json',
            contentType: 'application/json',
            data: curDates,
            success: function (responseData) {
               var response = [responseData[0]];

                parseResponseFunction(response);

                if (response.length != 0) {
                    var columns = response[0].aggregates;

                    // выбор столбцов для раскраски
                    var propertyArray = Object.keys(columns);

                    var dynamicColNames = [];

                    if (propertyArray.length >= 2) {
                        dynamicColNames.push(propertyArray[propertyArray.length - 2]);
                        dynamicColNames.push(propertyArray[propertyArray.length - 1]);
                    }

                    for (var key in columns) {
                        if (columns.hasOwnProperty(key)) {
                            var title = columns[key].title;

                            // Установка формата данных в таблице
                            var currentAggregateType = $(':selected', '#Indexes').data('aggregateType');

                            var customFormat = currentAggregateType;
                            if (dynamicColNames.length != 0 &&
                                dynamicColNames.indexOf(key) != -1) {
                                customFormat = "simple";
                            }

                            var column = {
                                field: key,
                                title: title,
                                customFormat: customFormat,
                                setRowColor: true
                            };


                            column.template = function (field) {
                                return function (row) {

                                    return $('#onlyColorShow').prop('checked') ? "" : FormatValueWithCustom(row[field], customFormat);

                                };
                            }(column.field, column.customFormat);

                            column.groupFieldTemplate =
                                function (column) {
                                    return function (row) {

                                        var dataValue = FormatValueWithCustom(
                                            row.aggregates[column.field].sum,
                                            column.customFormat);

                                        if (factPeriodDateValue == column.title.replace(/ /g, '')) {
                                            return "<div style='color:#D50000;'>" + dataValue + "</div>";
                                        }
                                        else {

                                            if (dynamicColNames.indexOf(column.field) != -1) {

                                                var color = "#FFC7CE";
                                                if (dataValue > 0) {
                                                    color = "#C6EFCE";
                                                }

                                                return "<div style='background:" + color + ";'>" + dataValue + "</div>";

                                            } else {
                                                return $('#onlyColorShow').prop('checked') ? "" :
                                                    dataValue;

                                            }
                                        }
                                    };
                                }(column);

                            column.footerTemplate =
                                function (column) {

                                    return function (row) {
                                        if ($('#onlyColorShow').prop('checked'))
                                            return "";
                                        else {

                                            var totalRow = $(gridName).data('kendoGrid').dataSource.All;

                                            var value = (totalRow == undefined ? row[column.field].sum : totalRow.aggregates[column.field].sum);

                                            var dataValue = FormatValueWithCustom(value, column.customFormat);

                                            if (factPeriodDateValue == column.title.replace(/ /g, '')) {
                                                return "<div style='color:#D50000;'>" + dataValue + "</div>";
                                            }
                                            else if (dynamicColNames.indexOf(column.field) != -1) {

                                                var color = "#FFC7CE";
                                                if (dataValue > 0) {
                                                    color = "#C6EFCE";
                                                }

                                                return "<div style='background:" + color + ";'>" + dataValue + "</div>";

                                            }

                                            return dataValue;
                                        }
                                    };
                                }(column);


                            //column.footerTemplate = function (row) { return onlyColorShow ? "" : row[column.field]; };

                            if (title == "All") {

                                if (currentAggregateType == aggregateTypes.average
                                    || currentAggregateType == aggregateTypes.percent
                                ) {
                                    column.title = "Среднее";
                                } else {
                                    column.title = "Сумма";
                                }

                                column.setRowColor = false;
                            }

                            wcolumnsParam.push(column);
                        }
                    }
                }
            },
            error: function (er) {
                console.log('Ошибка!');
            }
        });
        }

        if (wcolumnsParam.length > 0 && wcolumnsParam[wcolumnsParam.length - 1].field == 'pAll') {
            wcolumnsParam.unshift(wcolumnsParam[wcolumnsParam.length - 1]);
            wcolumnsParam.splice(-1, 1);
        }
        for (var i = 0; i < wcolumnsParam.length; i++)
            columnsParam.push(wcolumnsParam[i]);
    }

    function getAnalizeData() {
        setParaments();
        var data = {};
        data.dateValue = selectedDate;
        data.period = selectedPeriodType;
        data.indicator = selectedIndicator;

        var rfilters = UniqueUnionObject(data, options.filters);

        KendoOlapDataSource.AddGroupsFilters(
            rfilters,
            getGroupFields(GetHierarchyFields('AnalizeByPeriodsOLAP')),
            options.elementaryKeyField);

        return rfilters;
    }

    filterControl.SetOnRefreshButtonClick(refreshGrid);

    function refreshGrid() {
        refreshGridColumn(getGridOption, options);
    }


    
}


var gridName = '#Grid';

var grid = $(gridName);

var settingManager = ReportUserSettingManager.createInstance(
    userSettings,
    grid,
    function(settingManager, gridColumnsManager) {
        //сохраняем выбранный период
        var oldPeriod = settingManager.getSetting("selectedPeriod");
        var newPeriod = $('#periods').val();

        if (oldPeriod != newPeriod) {
            settingManager.setSetting("selectedPeriod", newPeriod);

            gridColumnsManager.clearValueFields();
        }
        //сохраняем выбранный индикатор
        settingManager.setSetting("selectedIndicator", $('#Indexes').val());

        //сохраняем выбранное значение даты выбранного периода
        settingManager.setSetting("selectedPeriodValue", selectedDate);

        //сохраняем выбранный диапазон дат
        var oldDateRange = settingManager.getSetting("dateRange");

        settingManager.updateDateRangeSetting($('#beginDatepicker').val(), $('#endDatepicker').val());

        var newDateRange = settingManager.getSetting("dateRange");

        if (oldDateRange != newDateRange) {
            gridColumnsManager.clearValueFields();
        }
    });

var userSettingsManager = new UserSettingManager(userSettings);

var filterControl = new FilterControl({
    button: "#refresh",
    activateRefreshButtonSelector: ".activateRefreshButton",
    onFilterChanged: userSettingsManager.UpdateByFilters
});

settingManager.initDateRange();

var url = basePath + 'AnalizeByPeriodsOLAP/GetSubGroups';

KendoPlugins.attach(gridName, KendoPlugins.UserSettings(settingManager));

//KendoPlugins.attach(gridName, KendoPlugins.setRowValueColorToNumbers);

KendoPlugins.attach(gridName, KendoPlugins.addTotalRowFromJson);

KendoPlugins.attach(gridName, KendoPlugins.parseResponse(parseResponseByPeriod));

KendoPlugins.attach(gridName,
    KendoPlugins.additionalData(function () {
    return {
        dateValue: selectedDate,
        period: selectedPeriodType,
        indicator: selectedIndicator,
        jsonFilters: JSON.stringify(filterControl.getFilterValues())
    }
}));

var createAnalizeByPeriodsGrid = function (gridDiv, e) {

    CreateAnalizeByPeriodsGridOLAP(
        grid,
        {
            contactGridUrl: url,
            getColumnsUrl: url,
            columnFormat: $(':selected', '#Indexes').data('aggregateType'),
            onBuilding: function (configuration) {
                },
            onBuilded: function (grid) {

                
                var kendoGrid = grid.data('kendoGrid');
                var dataSource = kendoGrid.dataSource;

                dataSource.sortByColor = $('#sortByColor').prop('checked');

                dataSource.read();

                KendoPlugins.partialRender(grid);

                KendoPlugins.SecondaryHierarchy(grid.data('kendoGrid'));

            },
            afterDataBound: function () {

                var tds = $("td").has("div");

                for (i = 0; i < tds.length; i++) {
                    tds[i].style.backgroundColor = tds[i].children[0].style.backgroundColor;
                }

                if (userSettings.userSettingValues.openHierarchy) {
                    var expandItems = JSON.parse(userSettings.userSettingValues.openHierarchy.settingValue);
                    ExpandItems(gridDiv, expandItems);
                }
                filterControl.onRefreshButtonClickCallback();
            },
            filters: e ? e.filters : null,
            elementaryKeyField: 'Delivery_name'
        },
        parseResponseByPeriod
    );
};

createAnalizeByPeriodsGrid(grid);

function parseResponseByPeriod(data) {

    //Удаляем dateRange из массива, если есть
    var dateRange = data[data.length - 1];
    if (dateRange) {
        if (dateRange.dateRange) {
            data.pop();
        }
    }

    for (var i = 0; i < data.length; i++) {

        if (data[i].aggregates) {
            var columns = data[i].aggregates;

            for (var key in columns) {
                if (columns.hasOwnProperty(key)) {
                    columns[key].title = key.replace('col', '');

                    var columnName = 'p' + key.split("-").join("_");

                    columnName = columnName.split("/").join("_");
                    columnName = columnName.split(" ").join("_");

                    var colValue = columns[key];

                    delete columns[key];

                    columns[columnName] = colValue;
                }
            }
        } else {
            var fields = data[i];

            for (var key in fields) {
                if (fields.hasOwnProperty(key)) {

                    if (key == 'Delivery_name') {
                        continue;
                    }

                    //fields[key].title = key.replace('col', '');

                    var columnName = 'p' + key.split("-").join("_");

                    columnName = columnName.split("/").join("_");
                    columnName = columnName.split(" ").join("_");

                    var colValue = fields[key];

                    delete fields[key];

                    fields[columnName] = colValue;
                }
            }
        }
    }

}

$(function() {
    filterControl.bindAndInit('#beginDatepicker', '#endDatepicker', function() {
        filterControl.fillFromString(userSettingsManager.getSetting('selectedFilters'));
        filterControl.bindControlsWithRefreshButton();
    });
});
var aggregateTypes =
{
    simple: 'simple',
    growth: 'growth',
    average: 'average',
    percent: 'percent'
}


function CreateReportByPeriodsGridOLAP(grid, options, parseResponseFunction, filterControl)
{
    var gridColumnsAndGroups = {
        get: function () {
            var valueCols = [];
            filterControl.showLoadingData(true);
            getColumnsByPeriod(valueCols);

            setAggregateToColumns(valueCols, ["sum"]);

            setColumnFormat(valueCols);
            
            var hierarchyCols = GetHierarchyFields('ReportByPeriodsOLAP');

            for (var index in hierarchyCols) {
                var h = hierarchyCols[index];

                if (!h.isGroup) {
                    h.isDetail = true;
                }
            }

            var columns = [];

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
        todayHighlight: true
    });

    

    var gridBuider = new KendoGridBuider(getGridOption());
    gridBuider.buid();

    function getGridOption() {

        var fields = {};

        return {
            afterDataBound: options.afterDataBound,
            gridDiv: grid,
            getDataSource: function () {
              
                var userSettingsMngr = gridColumnsAndGroups.get();
                //TODO: заплатка. Разобраться, Переделать.
                var sortField = {};

                var aggregates = userSettingsMngr.sumAggregates;
                if(aggregates.length!=0) {
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
                    null,
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
        var data = getData();
        
        var curDates = JSON.stringify(data);

        if (curDates != window.dates) {
            window.dates = curDates;

            window.wcolumnsParam = [];

            curDates.top = true;

            wcolumnsParam = window.wcolumnsParam;

            $.ajax({
                url: options.getColumnsUrl,
                type: 'post',
                async: false,
                dataType: 'json',
                contentType: 'application/json',
                data: curDates,
                success: function (responseData) {

                    curDates.top = false;

                    var dateRange = responseData[responseData.length - 1];

                    var beginDate = dateRange.dateRange.beginDate;
                    var endDate = dateRange.dateRange.endDate;

                    DateRangeFilter.setDates(beginDate, endDate);

                    var response = [responseData[0]];

                    parseResponseFunction(response);

                    if (response.length != 0) {
                        var columns = response[0].aggregates;

                        var pAllColumnWrapper = {
                            startTag: "<div class='all-column-cell'>",
                            endTag: "</div>"
                        };

                        for (var key in columns) {

                            if (columns.hasOwnProperty(key)) {
                                var title = columns[key].title;

                                var currentAggregateType = $(':selected', '#Indexes').data('aggregateType');

                                var customFormat = currentAggregateType == 'percent' ? 'percent' : 'currency';

                                var column = {
                                    field: key,
                                    title: title,
                                    customFormat: customFormat,
                                    setRowColor: true
                                };

                                column.setRowColor = true;

                                column.template = function(field) {
                                    return function(row) {

                                        return $('#onlyColorShow').prop('checked') ? "" : FormatValueWithCustom(row[field], customFormat);
                                    };
                                }(column.field, column.customFormat);


                                column.groupFieldTemplate =
                                    function(field) {
                                        return function(row) {
                                            return $('#onlyColorShow').prop('checked') ? "" :
                                            (field != "pAll"
                                                ? FormatValueWithCustom(row.aggregates[field].sum, customFormat)
                                                : pAllColumnWrapper.startTag + FormatValueWithCustom(row.aggregates[field].sum, customFormat) + pAllColumnWrapper.endTag);
                                        };
                                    }(column.field, column.customFormat);


                                column.footerTemplate =
                                    function(field) {
                                        return function(row) {
                                            if ($('#onlyColorShow').prop('checked'))
                                                return "";
                                            else {
                                                var totalRow = $(gridName).data('kendoGrid').dataSource.All;

                                                var value = (totalRow == undefined ? row[field].sum : totalRow.aggregates[field].sum);

                                                return field != "pAll"
                                                    ? FormatValueWithCustom(value, customFormat)
                                                    : pAllColumnWrapper.startTag + FormatValueWithCustom(value, customFormat) + pAllColumnWrapper.endTag;
                                            }
                                        };
                                    }(column.field, column.customFormat);

                                if (title == "All") {

                                    if (currentAggregateType == aggregateTypes.average
                                            || currentAggregateType == aggregateTypes.percent
                                            || currentAggregateType == aggregateTypes.growth
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

    function getData() {
        var data = getDates();
        data.period = $('#periods').val();
        data.indicator = $('#Indexes').val();

        var rfilters = UniqueUnionObject(data, options.filters);

        KendoOlapDataSource.AddGroupsFilters(
            rfilters,
            getGroupFields(GetHierarchyFields('ReportByPeriodsOLAP')),
            options.elementaryKeyField);
        
        return rfilters;
    }

    filterControl.SetOnRefreshButtonClick(refreshGrid);

    function refreshGrid() {
        refreshGridColumn(getGridOption, options);
    }

    $('#ExportExcelLink').click(
        function () {
            exportExcel();
        }
    );

    function getSelectedDimentions(us) {
        var param = JSON.parse(us.userSettingValues.activeColumns.settingValue);
        return param;

    };

    this.exportExcel = function () {
        var gridOptions = getGridOption();
        var dataSource = gridOptions.getDataSource();
        var filters = dataSource.GetFilters();
        var updateUserSettingsPath = basePath + 'ReportByPeriodsOLAP/ExportExcel';

        var usrSett = getSelectedDimentions(userSettings);

        var grFields = usrSett.GroupingField;

        var selGroups = [];

        for (key in grFields) {
            if(grFields[key].isActive)
                selGroups.push({ name: key, order: grFields[key].orderIndex});
        };

        selGroups.sort(
            function(a, b) {
                if (a.order < b.order)
                    return -1;
                if (a.order > b.order)
                    return 1;
                return 0;
            });

        var selGroupNames = [];

        selGroups.forEach(function(item, i, arr) {
            selGroupNames.push(item.name);
        });


        var staticFields = usrSett.StaticField;
        for (key in staticFields) {
            if (staticFields[key].isActive)
                selGroupNames.push(key);
        };
       

        var outData = {
            groups: selGroupNames,
            beginDate: filters.beginDate,
            endDate: filters.endDate,
            period: $('#periods').val(),
            indicator: $('#Indexes').val(),
            jsonFilters: JSON.stringify(filterControl.getFilterValues())
        };
        //var outData = jQuery.extend(outData1, filters);

        //notification.info("Задание на выгрузку в Excel принято. Дождитесь уведомление об окончании операции.");

        $.ajax({
            url: updateUserSettingsPath,
            method: 'POST',
            data: outData,
            success: function (response) {
                if (response.success) {

                    notification.info(response.sucsessMsg);
                } else {
                    if (response.errMsg == "") {
                        notification.warning(
                            "Не удалось произвести выгрузку в Excel. Попробуйте уменьшить количество данных.");
                    } else {
                        notification.error(response.errMsg);
                    }
                }
            },
            error: function () {

                notification.error("Не удалось произвести выгрузку в Excel. Попробуйте уменьшить количество данных.");
            }
        });

        
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

var url = basePath + 'ReportByPeriodsOLAP/GetSubGroups';

var excelReportUrl = basePath + 'ReportByPeriodsOLAP/ExportExcel';

function SmsControl(gridName, colunmName) {

    var State = {
        gridSelector: gridName,
        contact_idColumnName: colunmName,
        show: false,
    };

    $('#AddSmDistributionControl')
        .on('click',
            function () {

                $('#ToSmsDistribution').toggleClass(State.show);

                $('#AddSmDistributionControl').toggleClass('btn-primary', State.show);
                $('#AddSmDistributionControl').toggleClass('btn-warning', !State.show);

                $('#AddSmDistributionControl').val(State.show ? hideButtonSelected() : viewButtonSelected());

                State.show = !State.show;

                ShowColumn(State.gridSelector, "sms", State.show);


            });

    function viewButtonSelected() {
        $('#select').prepend("<input type='submit' value='Добавить в рассылку' class='btn btn-success' id='ToSmsDistribution'>");
        $('#ToSmsDistribution')
            .on('click',
                function () {
                    ShowSmsDistributionModal(GetSelectedIds);
                });

        return "Отмена";
    }

    function hideButtonSelected() {
        $('#ToSmsDistribution').remove();

        return "СМС рассылка";
    }

    function setEventSelectAll() {

        var selectAll = $('#SelectAll');
        selectAll.on('click', AllSelected);

        //var removeSelection = $('#RemoveSelection');
        //removeSelection.on('click', RemoveAllSelected);
    }



    function ShowColumn(gridSelector, column, value) {

        var grid = $(gridSelector).data("kendoGrid");

        var smsHeader = '<th class="k-header k-filterablen smsHeader" scope="col" ><center><input type="checkbox" id="SelectAll" /></center></tr>';


        if (value) {
            grid.showColumn(column);
            $('.k-grid-header').children().append(smsHeader);
        } else {
            $('.smsHeader').remove();
            grid.hideColumn(column);

            SelectAll(false);

        }
        setEventSelectAll();
    }

    function GetSelectedIds() {

        return GetSelectRowsValue(State.gridSelector, State.contact_idColumnName);

    }

    function GetSelectRowsValue(gridSelector, columnId) {

        var values = [];

        var grid = $(gridSelector).data('kendoGrid');

        var selectedRows = $('.k-state-selected');

        for (var i = 0; i < selectedRows.length; i++) {
            var item = grid.dataItem(selectedRows[i]);

            if (item != null) {
                values.push(item[columnId]);
            }
        }

        return values;
    }

    function AllSelected(event) {

        var isChecked = event.target.checked;

        SelectAll(isChecked);
    }

    function SelectAll(isSelect) {

        $(".smscheckbox").each(
            function () {
                this.checked = isSelect;

                var row = $(this).closest("tr");

                row.toggleClass('k-state-selected', isSelect);
            });
    }

}


KendoPlugins.attach(gridName, KendoPlugins.UserSettings(settingManager));

KendoPlugins.attach(gridName, KendoPlugins.SmsSendingPlugin('id'));

KendoPlugins.attach(gridName, KendoPlugins.setRowValueColorToNumbers);
KendoPlugins.attach(gridName, KendoPlugins.addTotalRowFromJson);
KendoPlugins.attach(gridName, KendoPlugins.parseResponse(parseResponseByPeriod));

KendoPlugins.attach(gridName,
    KendoPlugins.additionalData(function () {
    return {
        period: $('#periods').val(),
        indicator: $('#Indexes').val(),
        jsonFilters: JSON.stringify(filterControl.getFilterValues())
    }
}));

var createReportByPeriodsGrid = function(gridDiv, e) {

    CreateReportByPeriodsGridOLAP(
        gridDiv,
        {
            contactGridUrl: url,
            getColumnsUrl: url,
            columnFormat: $(':selected', '#Indexes').data('aggregateType'),
            onBuilding: function (configuration) {
                },
            onBuilded: function (gridDiv) {

                
                var kendoGrid = gridDiv.data('kendoGrid');
                var dataSource = kendoGrid.dataSource;

                dataSource.sortByColor = $('#sortByColor').prop('checked');

                //dataSource.read();

                KendoPlugins.partialRender(gridDiv);

                KendoPlugins.SecondaryHierarchy(gridDiv.data('kendoGrid'));

            },
            afterDataBound: function (e) {

                if (userSettings.userSettingValues.openHierarchy) {
                    var expandItems = JSON.parse(userSettings.userSettingValues.openHierarchy.settingValue);
                    ExpandItems(gridDiv, expandItems);
                }
                filterControl.onRefreshButtonClickCallback();   
            },
            filters: e ? e.filters : null,
            elementaryKeyField: 'Delivery_name'
        },
        parseResponseByPeriod,
        filterControl
    );
};

createReportByPeriodsGrid(grid);

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
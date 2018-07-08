function initBarTemplatePlanFakt(data) {
    return {
        FaktByPlan: data.fact.sum,
        Plan: data.plan.sum
    }
}


function initBarTemplatePlanFaktByPeriods(data, index) {
    return {
        FaktByPlan: data['fact' + index].sum,
        Plan: data['plan' + index].sum
    }
}

function CreatePlanFactReport(grid, options, parseResponseFunction) {
    $(".datepicker").datepicker({
        language: 'ru',
        autoclose: true,
        todayHighlight: true
    });

    updateSelectedPeriods();

    var gridColumnsAndGroups = {
        get: function () {

            var indicator = $('#Indexes').val();
            var customFormat = GetCustomFormatByIndicatorId(parseInt(indicator));

            var factCol = {
                field: 'fact',
                title: 'Факт',
                customFormat: customFormat,
                groupingField: false
            };
            var planCol = {
                field: 'plan',
                title: 'План',
                customFormat: customFormat,
                groupingField: false
            };
            var difCol = {
                field: 'fact',
                title: 'Отклонение факта от плана',
                customFormat: customFormat,
                groupFieldTemplate: '#=round(data.aggregates.fact.sum-data.aggregates.plan.sum, 2)#',
                groupingField: false
            };
            var procCol = {
                field: 'fact',
                title: 'Процент выполнения плана',
                customFormat: 'percent',
                groupFieldTemplate: '#=getPercent100(data.aggregates.fact.sum,data.aggregates.plan.sum)#',
                groupingField: false
            };
            var procBarCol = {
                field: 'fact',
                title: 'Процент выполнения плана',
                customFormat: 'percent',
                groupFieldTemplate: '#= barTemplate(initBarTemplatePlanFakt(data.aggregates))#',
                groupingField: false
            };

            var displayVariant = $('#DisplayVariants').val();

            var valueCols = [];

            var byPeriods = $('#ByPeriods').prop('checked');

            if (byPeriods) {
                GetColsFromJsonData(valueCols, displayVariant);
            } else {

                var variantColumns =
                {
                    1: [factCol],
                    2: [planCol],
                    3: [difCol],
                    4: [procCol],
                    5: [factCol, planCol],
                    6: [procBarCol]
                };

                valueCols = variantColumns[displayVariant];
            }

            setColumnFormat(valueCols);

            setAggregateToColumns(valueCols, ["sum"]);
            setValueColorToColumns(valueCols);


            var hierarchyCols = GetPlanFactReportHierarchyFields();

            var columns = 
                    hierarchyCols
                    .concat(valueCols);

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

    var gridBuider = new KendoGridBuider(getGridOption());
    gridBuider.buid();

    function GetColsFromJsonData(cols, displayVariant) {

        var url = basePath + 'PlanFactReport/GetValueColumns';
        var dates = getDates();

        var periodType = $("#periods option:selected").val();

        var data = {
            periodType: periodType,
            beginDate: dates.beginDate,
            endDate: dates.endDate
        }

        var indicator = parseInt($('#Indexes').val());
        var customFormat = GetCustomFormatByIndicatorId(indicator);
        var format = GetFormatByIndicatorId(indicator);

        var groupFieldTemplateFieldArray =
        {
            1: [
                {
                    template: '#=kendo.toString(data.aggregates.factINDEX.sum, "' + format + '")#',
                    additinalTitle: '',
                    column: 'fact'
                }
            ],
            2: [
                {
                    template: '#=kendo.toString(data.aggregates.planINDEX.sum,"' + format + '")#',
                    additinalTitle: '',
                    column: 'plan'
                }
            ],
            3: [
                {
                    template: '#=round(data.aggregates.factINDEX.sum-data.aggregates.planINDEX.sum, 2)#',
                    additinalTitle: '',
                    column: 'fact'
                }
            ],
            4: [
                {
                    template: '#=getPercent100(data.aggregates.factINDEX.sum,data.aggregates.planINDEX.sum)#',
                    additinalTitle: '',
                    column: 'fact'
                }
            ],
            5: [
                {
                    template: '#=kendo.toString(data.aggregates.factINDEX.sum,"' + format + '")#',
                    additinalTitle: ' - Факт',
                    column: 'fact'
                },
                {
                    template: '#=kendo.toString(data.aggregates.planINDEX.sum,"' + format + '")#',
                    additinalTitle: ' - План',
                    column: 'plan'
                }
            ],
            6: [
                {
                    template: '#=barTemplate(initBarTemplatePlanFaktByPeriods(data.aggregates, INDEX))#',
                    additinalTitle: '',
                    column: 'fact'
                }
            ]
        };
        
        $.ajax({
            url: url,
            type: 'POST',
            async: false,
            data: data,
            success: function (columns) {

                columns.forEach(function(column) {

                    groupFieldTemplateFieldArray[displayVariant].forEach(function(groupFieldTemplateField) {

                        var groupFieldTemplate = groupFieldTemplateField.template.replace(/INDEX/g, column.id);

                        var newColumn = {
                            field: groupFieldTemplateField.column + column.id, 
                            title: column.columnTitle + groupFieldTemplateField.additinalTitle,
                            customFormat: customFormat,
                            groupFieldTemplate: groupFieldTemplate,
                            groupingField: false,
                            setRowColor: true
                        };

                        cols.push(newColumn);
                    });

                });
            },
            error: function(er) {
                console.log('Ошибка!');
            }
        });
    }

    function updateSelectedPeriods() {
        var periodType = $("#periods option:selected").val();
        var dates = getDates();

        var data = {
            periodType: periodType,
            beginDate: dates.beginDate,
            endDate: dates.endDate
        }

        var period = sendPost(basePath + 'SharedReport/GetPeriods', data);

        $('#beginDatepicker').datepicker('setDate', period.beginDate);
        $('#endDatepicker').datepicker('setDate', period.endDate);
    }

    function getGridOption() {

        var fields = {};

        return {
            afterDataBound: options.afterDataBound,
            gridDiv: grid,
            getDataSource: function(contacts) {
                var AddContactAttributesToElementaryItem = function(items) {
                    //console.log(items);
                    //items.forEach(function (item) {

                    //    console.log(item);

                    //    //if (item.good_id == "Unknown")
                    //    //    item.Good = {};
                    //    //else
                    //    //    item.Good = contacts[item.good_id];

                    //});
                }

                return KendoOlapDataSource.GetDataSource
                (
                    options.contactGridUrl,
                    fields,
                    gridColumnsAndGroups.get().groupFields,
                    gridColumnsAndGroups.get().sumAggregates,
                    AddContactAttributesToElementaryItem,
                    options.elementaryKeyField,
                    options.filters
                );
            },
            columns: gridColumnsAndGroups.get().columns,
            loadHierarchyAndBuid: LoadContactsHierarchy,
            onBuilding: options.onBuilding,
            onBuilded: options.onBuilded
        }

    }

    $('#refresh').on('click', function () {
        showLoadingData(true);
        refreshGridColumn(getGridOption, options, updateSelectedPeriods);
    });

}

var showLoadingData = function (isVisible) {
    console.log("loading - " + isVisible);
    if (isVisible) {
        $('#refresh')
            .prop('disabled', 'disabled')
            .css('background', '#666');
        $("#loadingFilterEnabled").css('display', 'inline-block');
    }
    else {
        $('#refresh').prop('disabled', '')
            .css('background', '');
        $("#loadingFilterEnabled").hide();
    }
};

var gridName = '#Grid';

var grid = $(gridName);


var settingManager = ReportUserSettingManager.createInstance(
    userSettings,
    grid,
    function (settingManager, gridColumnsManager) {
        //сохраняем выбранный период
        var oldPeriod = settingManager.getSetting("selectedPeriod");

        var newPeriod = $('#periods').val();

        if (oldPeriod != newPeriod) {
            settingManager.setSetting("selectedPeriod", newPeriod);

            gridColumnsManager.clearValueFields();
        }
        //сохраняем выбранный индикатор
        settingManager.setSetting("selectedIndicator", $('#Indexes').val());

        //сохраняем выбранный тип отображения
        settingManager.setSetting("selectedDisplayVariant", $('#DisplayVariants').val());

        //сохраняем по периодам или нет
        settingManager.setSetting("byPeriods", $('#ByPeriods').prop('checked'));

        //сохраняем выбранный диапазон дат
        var oldDateRange = settingManager.getSetting("dateRange");

        settingManager.updateDateRangeSetting($('#beginDatepicker').val(), $('#endDatepicker').val());

        var newDateRange = settingManager.getSetting("dateRange");

        if (oldDateRange != newDateRange) {
            gridColumnsManager.clearValueFields();
        }

        var setting = settingManager.getSetting('activeColumns');

        var settingJson = JSON.parse(setting);

        settingJson.ValueField = {};

        settingManager.setSetting('activeColumns', JSON.stringify(settingJson));
    });




settingManager.initDateRange();

var url = basePath + 'PlanFactReport/GetSubGroups';

KendoPlugins.attach(gridName, KendoPlugins.UserSettings(settingManager));
//KendoPlugins.attach(gridName, KendoPlugins.HiglightIndicator(cardType));

KendoPlugins.attach(gridName, KendoPlugins.setRowValueColorToNumbers);
KendoPlugins.attach(gridName, KendoPlugins.addTotalRowFromJson);
KendoPlugins.attach(gridName, KendoPlugins.parseResponse(parseResponseByPeriod));

KendoPlugins.attach(gridName, KendoPlugins.additionalData(function () {

    var sendParameters = {
        byPeriods: $('#ByPeriods').prop('checked'),
        periodType: $('#periods').val(),
        indicator: $('#Indexes').val(),
        displayVariantId: $('#DisplayVariants').val()
    };

    if (employeeId > 0) {
        sendParameters.employeeId = employeeId;
    }

    return sendParameters;
}));

var createPlanFactReportGrid = function (gridDiv, e) {

    var options = {
        contactGridUrl: url,
        getColumnsUrl: url,
        columnFormat: $(':selected', '#Indexes').data('aggregateType'),
        onBuilding: function (configuration) {
        },
        onBuilded: function (grid) {
            var kendoGrid = grid.data('kendoGrid');

            kendoGrid.dataSource.read();

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
            showLoadingData(false);
           
        },
        filters: e ? e.filters : null,
        displayVariantId: $('#DisplayVariants').val()
    };

    CreatePlanFactReport(
        gridDiv,
        options,
        parseResponseByPeriod
    );

};

createPlanFactReportGrid(grid);

function parseResponseByPeriod(data) {

    //Удаляем dateRange из массива, если есть
    var dateRange = data[data.length - 1];
    if (dateRange) {
        if (dateRange.dateRange) {
            data.pop();
        }
    }

    for (var i = 0; i < data.length; i++) {

        var columns = data[i].aggregates;

        for (var key in columns) {
            if (columns.hasOwnProperty(key)) {
                columns[key].title = key.replace('col', '');

                var columnName = key.split("-").join("_");

                columnName = columnName.split("/").join("_");

                columnName = columnName.split(" ").join("_");

                var colValue = columns[key];

                delete columns[key];

                columns[columnName] = colValue;
            }
        }
    }

}
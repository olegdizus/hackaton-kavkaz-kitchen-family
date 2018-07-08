function initBarTemplatePlanFakt(data) {
    return {
        FaktByPlan: data.FaktByPlan.sum,
        Plan: data.Plan.sum
    }
}

function CreateSalesIndicatorsByContactGridOLAP(
    grid, options) {

    var hierarchyCols = GetHierarchyFields('SalesIndicatorReportOLAP');

    var valueCols = [];

        Indicators
        .forEach(function (value, index) {

            var column = {
                field: value.measureName,
                title: value.name,
                customFormat: value.aggregateType == 'percent' ? 'percent' : 'currency',
                groupingField: false,
            };

            if (value.measureName == 'Weight') {

                column.width = 200;
                column.format = '{0:n0}';
                column.aggregates = ['sum'];
                column.groupFieldTemplate = weightTemplate;
                column.footerAttributes = rightAlign();
                column.attributes = rightAlign();
            }

            valueCols.push(column);

            return true;
        });


    setAggregateToColumns(valueCols, ["sum"]);
    setColumnFormat(valueCols);

    var columns = [];

    columns = columns
        .concat(
            hierarchyCols
            .concat(valueCols));

    var sumAggregates =
        getAggregatesByColumn(columns);


    var groupFields = getGroupFields(hierarchyCols, sumAggregates);


    var gridBuider = new KendoGridBuider(getGridOption());

    //gridBuider.onBuilding = options.onBuilding;
    //gridBuider.onBuilded = options.onBuilded;

    gridBuider.buid();

    function getGridOption() {
        if (options.filters) {
            columns = GroupsNotInFilters(columns, options.filters.groupIds);

            groupFields = GroupsNotInFilters(groupFields, options.filters.groupIds);
        }

        var fields = {};

        for (var i = 0; i < columns.length; i++) {
            fields[columns[i].field] = { editable: true, nullable: true };
        }

        return {
            gridDiv: grid,
            dataUrl: options.contactGridUrl,
            getDataSource: function () {

                return KendoOlapDataSource.GetDataSource
                (
                    options.contactGridUrl,
                    fields,
                    groupFields,
                    sumAggregates,
                    null,
                    options.elementaryKeyField,
                    options.filters,
                    GetMeasures()
                );
            },

            columns: columns,
            createDetailsGrid: createDetailsGrid,
            loadHierarchyAndBuid: LoadContactsHierarchy,
            onBuilding: options.onBuilding,
            onBuilded: options.onBuilded,
            afterDataBound: function () {

                if (userSettings.userSettingValues.openHierarchy) {
                    var expandItems = JSON.parse(userSettings.userSettingValues.openHierarchy.settingValue);
                    ExpandItems(grid, expandItems);
                }

                filterControl.showLoadingData(false);
                
            },
        };
    }

    function createDetailsGrid(grid, e) {

        var data = getDates();

        if (e.secondHierarchy) {
            data[e.data.field] = e.data.value;

            var item = e.data;

            var parentKendo = grid
                .parents('table')
                .first()
                .parent()
                .data('kendoGrid');

            e.filters = parentKendo.dataSource.GetFilters(item);

            options.createAggregateGrid(grid, e);

        } else {
            data.contact_id = e.data.contact_id;

            var detailColumns = [
                {
                    field: "isDelivery",
                    title: "Реализация/Возврат"
                },
                {
                    field: "key",
                    title: "Ключ"
                },
                {
                    field: "Date",
                    title: "Дата",
                    template: "#= kendo.toString(kendo.parseDate(Date),'yyyy-MM-dd')#"
                },
                {
                    field: "Weight",
                    title: "Вес"
                },
                {
                    field: "SumPrice",
                    format: '{0:n0}',
                    title: "Сумма"
                },
                {
                    field: "IsPlan",
                    title: "Плановая",
                    template: "#=IsPlan ? 'Да' : 'Нет'#"
                }
            ];

            KendoPlugins.CreateSimpleGrid(grid, {
                data: data,
                detailColumns: detailColumns,
                detailsUrl: options.deliveriesGridUrl
            });
        }
    }

    function GetMeasures() {
        var measures = [];

        var columns = JSON.parse(userSettingsManager.getSetting('activeColumns')).ValueField;

        console.log(columns);

        if (columns != undefined) {
            Indicators
                .forEach(function(value) {

                    if (value.measureName in columns) {

                        if (columns[value.measureName].isActive) {

                            measures.push(value.measureName);
                        }
                    }

                    return true;
                });

        }

        return measures;
    }
}
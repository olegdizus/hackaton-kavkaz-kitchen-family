function CreateSalesIndicatorsByNomenclatureGridOLAP(gridDiv, options) {

    var hierarchyCols = [
        
        {
            field: 'Good_GroupNMK',
            title: 'Группа НМК',
            isGroup: true
        },
        {
            field: 'Good_subGroupNMK',
            title: 'Подгруппа НМК',
            isGroup: true
        },
        {
            field: 'Good_kindPacking',
            title: 'Вид упаковки',
            isGroup: true
        },
        {
            field: 'Good_brend',
            title: 'Бренд',
            isGroup: true
        },
         {
             field: 'Good_BKG',
             title: 'БКГ',
             isGroup: true
         },
         {
             field: 'Good_name',
             title: 'Товар',
             isGroup: true
         }
    ];

    var valueCols = [
        {
            field: 'Weight',
            title: 'Вес, кг',
            width: 200,
            groupFieldTemplate: weightTemplate,
            footerAttributes: rightAlign(),
            attributes: rightAlign(),
            footerTemplate: "#=round(sum)#",
            customFormat: 'currency'
        },
        {
            field: 'avgWeight',
            title: 'Средний вес, кг',
            customFormat: 'currency'
        },
        {
            field: 'ShareInTotalWeight',
            title: 'Доля в общем весе %',
            customFormat: 'percent',
            footerTemplate: "#=percentRound(sum)#"
        },
        {
            field: 'SumPrice',
            title: 'Сумма, руб',
            customFormat: 'currency'
        },
        {
            field: 'avgPrice',
            title: 'Средняя сумма, руб',
            customFormat: 'currency'
        },
        {
            field: 'ShareInTotalSum',
            title: 'Доля в общей сумме %',
            customFormat: 'percent',
            footerTemplate: "#=percentRound(sum)#"
        },
        {
            field: 'mmlPrice',
            title: 'Доля ММЛ, руб',
            customFormat: 'currency'
        },
        {
            field: 'Cost',
            title: 'Плановая сумма, руб',
            customFormat: 'currency'
        },
        {
            field: 'grossProfit',
            title: 'Валовая прибыль, руб',
            customFormat: 'currency'
        },
        {
            field: 'grossProfitCoef',
            title: 'Наценка, %',
            customFormat: 'percent',
            customAggregate: function (data) {
                return getProfitSum(data.SumPrice.sum, data.Cost.sum);
            },
            groupFieldTemplate: function (data) {
                return kendo.toString(data.aggregates.grossProfitCoef.custom, 'n');
            },
            footerTemplate: "#=getProfitSumStr(data.SumPrice.sum, data.Cost.sum)#"
        }
    ];

    setAggregateToColumns(valueCols, ["sum"]);
    setColumnFormat(valueCols);

    var columns = [{
        field: 'Delivery_name',
        title: 'Отгрузка'
    }];

    columns = columns
        .concat(
            hierarchyCols
            .concat(valueCols));


    var sumAggregates =
       getAggregatesByColumn(valueCols);

    var groupFields = getGroupFields(hierarchyCols, sumAggregates);

    var gridBuider = new KendoGridBuider(getGridOption());

    gridBuider.buid();

    function GetFilters() {

        var data = getDates();

        data.filters=options.filters;

        return data;
    }

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
            gridDiv: gridDiv,
            getDataSource: function(goods) {

                var AddGoodAttributesToElementaryItem = function(items) {
                    items.forEach(function(item) {

                        if (item.good_id == "Unknown")
                            item.Good = {};
                        else
                            item.Good = goods[item.good_id];

                    });
                };

                return KendoOlapDataSource.GetDataSource
                (
                    options.url,
                    fields,
                    groupFields,
                    sumAggregates,
                    AddGoodAttributesToElementaryItem,
                    options.elementaryKeyField,
                    options.filters
                );


            },
            columns: columns,
            createDetailsGrid: createDetailsGrid,
            loadHierarchyAndBuid: LoadNomenclatureHierarchy,
            onBuilding: options.onBuilding,
            onBuilded: options.onBuilded
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
            var data = GetFilters();

            data.good_id = e.data.good_id;

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
                { field: "Weight", title: "Вес" },
                {
                    field: "Sum",
                    format: '{0:n0}',
                    title: "Сумма"
                }
            ];

            KendoPlugins.CreateSimpleGrid(grid, {
                data: data,
                detailColumns: detailColumns,
                detailsUrl: options.deliveriesUrl
            });
        }
    }
}
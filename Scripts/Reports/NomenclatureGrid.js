function CreateSalesIndicatorsByNomenclatureGrid(grid, options) {

    var hierarchyCols = [
        {
            field: 'Good.name',
            title: 'Товар',
            SelectAble: false
        },
        {
            field: 'Good.GroupNMK',
            title: 'Группа НМК',
            isGroup: true
        },
        {
            field: 'Good.subGroupNMK',
            title: 'Подгруппа НМК',
            isGroup: true
        },
        {
            field: 'Good.kindPacking',
            title: 'Вид упаковки',
            isGroup: true
        },
        {
            field: 'Good.brend',
            title: 'Бренд',
            isGroup: true
        },
         {
             field: 'Good.BKG',
             title: 'БКГ',
             isGroup: true
         }
    ];

    var valueCols = [
        {
            field: 'Weight',
            title: 'Вес кг',
            width: 200,
            format: '{0:n0}',
            groupFieldTemplate: weightTemplate,
            footerAttributes: rightAlign(),
            attributes: rightAlign(),
            footerTemplate: "#=round(sum)#",
            customFormat: 'currency'
    },
        {
            field: 'AvgWeight',
            title: 'Средний вес кг',
            customFormat: 'currency'
        },
        {
            field: 'ShareInTotalWeight',
            title: 'Доля в общем весе %',
            customFormat: 'percent',
            footerTemplate: "#=percentRound(sum)#"
        },
        {
            field: 'Sum',
            title: 'Сумма руб.',
            customFormat: 'currency'
        },
        {
            field: 'AvgSum',
            title: 'Средняя сумма руб.',
            customFormat: 'currency'
        },
        {
            field: 'ShareInTotalSum',
            title: 'Доля в общей сумме %',
            customFormat: 'percent',
            footerTemplate: "#=percentRound(sum)#"
        },
        {
            field: 'MMLSum',
            title: 'Доля ММЛ руб.',
            customFormat: 'currency'
        },
        {
            field: 'PlanSum',
            title: 'Плановая сумма руб.',
            customFormat: 'currency'
        },
        {
            field: 'ProfitSum',
            title: 'Валовая прибыль руб.',
            customFormat: 'currency'
        },
        {
            field: 'Profit',
            title: 'Наценка %',
            customFormat: 'percent',
            customAggregate: function (data) {
                return getProfitSum(data.Sum.sum, data.PlanSum.sum);
            },
            groupFieldTemplate: function (data) {
                return kendo.toString(data.aggregates.Profit.custom, 'n');
            },
            footerTemplate: "#=getProfitSumStr(data.Sum.sum, data.PlanSum.sum)#"
        }
    ];

    setAggregateToColumns(valueCols, ["sum"]);
    setColumnFormat(valueCols);

    var columns = hierarchyCols
        .concat(valueCols);

    var sumAggregates =
       getAggregatesByColumn(valueCols);

    var groupFields = getGroupFields(hierarchyCols, sumAggregates);

    var gridBuider = new KendoGridBuider(gridOption());

    gridBuider.onBuilding = options.onBuilding;
    gridBuider.onBuilded = options.onBuilded;

    gridBuider.buid();
    function GetFilters() {

        var data = getDates();

        data.filters=options.filters;

        return data;
    }

    function gridOption() {

        return {
            grid: grid,
            getDataSource: function (goods) {

                return new kendo.data.DataSource({
                    type: "aspnetmvc-ajax",
                    schema: {
                        parse: function(d) {
                            d.forEach(function(item) {

                                item.Good = goods[item.good_id];
                            });

                            return d;
                        }
                    },
                    transport: {
                        read: {
                            url: options.url,
                            dataType: "json",
                            type: "POST",
                            data: GetFilters
                        },
                    },
                    group: groupFields,
                    aggregate: sumAggregates,
                    sort: {
                        field: "FaktByPlanProcent",
                        dir: "asc"
                    },
                });
            },
            columns: columns,
            createDetailsGrid: createDetailsGrid,
            loadHierarchyAndBuid: LoadNomenclatureHierarchy
        };
    }

    function createDetailsGrid(grid, e) {

        if (e.data.aggregates) {

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
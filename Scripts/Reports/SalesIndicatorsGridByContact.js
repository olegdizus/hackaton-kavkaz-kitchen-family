function initBarTemplatePlanFakt(data) {
    return {
        FaktByPlan: data.FaktByPlan.sum,
        Plan: data.Plan.sum
    }
}


function CreateSalesIndicatorsByContactGrid(
    grid, options) {

    var hierarchyCols = GetContactHierarchyFields();
    
    var valueCols = [
        {
            field: 'Weight',
            title: 'Вес кг',
            width: 200,
            format: '{0:n0}',
            //aggregates: ['sum'],
            groupFieldTemplate: weightTemplate,
            footerAttributes: rightAlign(),
            attributes: rightAlign({ 'class': 'numeric' }),
            footerTemplate: "#=round(sum)#",
            customFormat: 'currency'
        },
        {
            field: 'AvgWeight',
            title: 'Средний вес кг',
            customFormat: 'currency'
        },
        {
            field: 'Sum',
            attributes: { 'class': 'numeric' },
            title: 'Сумма руб.',
            customFormat: 'currency',
            footerTemplate: "#=round(sum)#"

        },
        {
            field: 'AvgSum',
            title: 'Средняя сумма руб.',
            customFormat: 'currency'
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
            template: '#=data.ProfitSum#',
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
            //groupFieldTemplate: "#=getProfitSumStr(data.aggregates.Sum, data.aggregates.PlanSum)#",
            footerTemplate: "#=getProfitSumStr(data.Sum.sum, data.PlanSum.sum)#",
            attributes: rightAlign()
        },
        {
            field: 'Fakt',
            customFormat: 'currency',
            title: 'Кол-во дней отгрузок'
        },
        {
            field: 'CountTT',
            customFormat: 'currency',
            title: 'Кол-во сработавших ТТ'
        },
        {
            field: 'Plan',
            customFormat: 'currency',
            title: 'План на количество сработавших ТТ'
        },
        {
            field: 'FaktByPlan',
            customFormat: 'currency',
            title: 'Отгружено по плану'
        },
        {
            field: 'FaktByPlanProcent',
            title: 'Отгружено по плану %',
            width: 200,
            template: '#=barTemplate(data)#',
            customAggregate: function (data) {
                return getPercent(data.Plan.sum, data.FaktByPlan.sum);
            },
            footerAttributes: rightAlign(),
            groupFieldTemplate: '#= barTemplate(initBarTemplatePlanFakt(data.aggregates))#',
            footerTemplate: '#=barTemplate(initBarTemplatePlanFakt(data))#'
        },
        {
            field: 'DeliveryCount',
            customFormat: 'currency',
            title: 'Кол-во отгрузок'
        }
    ];

    console.log(valueCols);

    setAggregateToColumns(valueCols, ["sum"]);
    setColumnFormat(valueCols);

    var columns = hierarchyCols
         .concat(valueCols);

    var sumAggregates =
        getAggregatesByColumn(columns);

    var groupFields = getGroupFields(hierarchyCols, sumAggregates);

    columns.push(
    {
        title: 'Т',
        field: 'contact_id',
        template: '<a class="k-icon k-plus" href="\\#" tabindex="-1"></a>',
        attributes: { 'class': 'k-hierarchy-cell second' },
        SelectAble: false
    });

    var gridBuider = new KendoGridBuider(getGridOption());

    gridBuider.onBuilding = options.onBuilding;
    gridBuider.onBuilded = options.onBuilded;

    gridBuider.buid();


    function getGridOption() {

        return {
            grid: grid,
            dataUrl: options.contactGridUrl,
            getDataSource: function (contacts) {
                return new kendo.data.DataSource({
                    type: "aspnetmvc-ajax",
                    schema: {
                        parse: function (d) {
                            d.forEach(function (item) {
                                item.Contact = contacts[item.contact_id];

                                item.FaktByPlanProcent = getPercent(item.Plan, item.FaktByPlan);
                            });

                            return d;
                        },
                        //data: {
                        //    //Weight: {
                        //    //    type: "number"
                        //    //}
                        //}
                    },
                    transport: {
                        read: {
                            url: options.contactGridUrl,
                            dataType: "json",
                            type: "POST",
                            data: getDates
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
            loadHierarchyAndBuid: LoadContactsHierarchy
        };
    }

    function createDetailsGrid(grid, e) {

        var data = getDates();

        if (e.secondHierarchy) {
            data[e.data.field] = e.data.value;

            var filters = [];


            var item = e.data;

            if (item.aggregates) {
                var childItem = item;

                while (childItem.items && childItem.items.length > 0
                    || childItem.items2 && childItem.items2.length > 0) {
                    childItem = childItem.items.length > 0 ? childItem.items[0] : childItem.items2[0];
                }


                var groups = $('#Grid').data('kendoGrid').dataSource._group;

                var level = Math.min(item.level + 1, groups.length);

                var groupNameToIdMap =
                {
                    "Contact.FirstLevel": "firstLevel_id",
                    "Contact.MainManager": "mainMng_id",
                    "Contact.Manager": "mng_id",
                    "Contact.Region": "region_id"
                };

                for (var i = 0; i < level; i++) {

                    var groupValueId = groupNameToIdMap[groups[i].field];
                    var itemFieldId = "Contact." + groupValueId;
                    filters.push(
                    {
                        field: groupValueId,
                        value: eval('childItem.' + itemFieldId)
                    });
                }
            } else {
                filters.push(
                {
                    field: 'contact_id',
                    value: item.contact_id
                });
            }

            e.filters = filters;
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
                    field: "Sum",
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
}


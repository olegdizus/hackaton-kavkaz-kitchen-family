function CreateDebitoreGrid(grid, debitoreTableUrl, deliveryUrl, grenceColor, user) {

    var hierarchyCols = GetContactHierarchyFields();

    var valueCols = [
        {
            field: "dayLimit",
            title: "Лимит<br/>дни",
            customFormat: 'currency',
            width: "100px"
        },
        {
            field: "AllSum",
            title: "Общий долг<br/>контрагента",
            customFormat: 'currency',
            width: "125px",
        },
        {
            field: "LimitSum",
            title: "Лимит<br/>сумма",
            customFormat: 'currency',
            width: "110px",
        },
        {
            field: "debtSum",
            title: "Просроченный<br/>долг",
            customFormat: 'currency',
            width: "110px",
        },
        {
            field: "Less8Days",
            title: "Не более<br/>7 дней",
            customFormat: 'currency',
            width: "110px",
            filterable: false,
            sortable: false
        },
        {
            field: "for8to14Days",
            title: "От 8 <br/>до 14 дней",
            customFormat: 'currency',
            width: "120px",
            filterable: false,
            sortable: false
        },
        {
            field: "for15to21Days",
            title: "От 15 <br/>до 21 дней",
            customFormat: 'currency',
            width: "120px",
            filterable: false,
            sortable: false
        },
        {
            field: "for22to28Days",
            title: "От 22 <br/>до 28 дней",
            customFormat: 'currency',
            width: "120px",
            filterable: false,
            sortable: false
        },
        {
            field: "other",
            title: "Прочий<br/>долг",
            customFormat: 'currency',
            width: "120px",
            filterable: false,
            sortable: false
        },
        {
            field: "grather100Days",
            title: "Остальные <br/>(не менее 101 дня)",
            customFormat: 'currency',
            width: "150px",
            filterable: false,
            sortable: false
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

    gridBuider.buid();


    function gridOption() {
        console.log(JSON.stringify({
            delayTypes: GetSelectedDelayTypes(),
            byDate: $('#byDateDatepicker').val(),
            User: user
        }));

        return {
            gridDiv: grid,
            dataUrl: debitoreTableUrl,
            getDataSource: function (contacts) {
                return new kendo.data.DataSource({
                    type: "json",
                    schema: {
                        parse: function (d) {
                            d.forEach(function (item) {
                                item.Contact = contacts[item.contact_id];

                            });

                            return d;
                        }
                    },
                    transport: {
                        read: function (options) {
                            $.ajax({
                                url: debitoreTableUrl,
                                dataType: "json",
                                type: "POST",
                                contentType: "application/json",
                                data: JSON.stringify({
                                    delayTypes: GetSelectedDelayTypes(),
                                    byDate: $('#beginDatepicker').val(),
                                    User: user
                                }),
                                success: options.success
                            });
                        }
                    },
                    group: groupFields,
                    aggregate: sumAggregates
                });

            },
            getParseFunc: function (contacts) {
                return function (d) {

                    d.forEach(function (item) {
                        item.Contact = contacts[item.contact_id];
                    });

                    return d;
                }
            },
            sort: {
                field: "FaktByPlanProcent",
                dir: "asc"
            },
            columns: columns,
            //getDetailOption: getDetailOption,
            createDetailsGrid: createDetailsGrid,
            loadHierarchyAndBuid: LoadContactsHierarchy
        };
    }


    function getDetailOption(e) {
        var contactId = e.data.contact_id;

        var data =
            kendo.stringify(
                {
                    contactID: contactId,
                    delayTypes: GetSelectedDelayTypes(),
                    byDate: $('#byDateDatepicker').val(),
                    User: user
                }
            );

        var detailColumns = [
                    {
                        field: "name",
                        title: "Наименование",
                        attributes:
                            {
                                "color": '#=getDeliveryColor(data.debtDays - data.dayLimit)#',
                            }
                    },
                    {
                        field: "debtDays",
                        format: '{0:n0}',
                        title: "Дни долга"
                    },
                    {
                        field: "dayLimit",
                        format: '{0:n0}',
                        title: "Лимит дни"
                    },
                    {
                        field: "LimitSum",
                        format: '{0:n0}',
                        template: function (arg) {
                            return kendo.valueToFooterString(arg.LimitSum);
                        },
                        title: "Долг"
                    }
        ];

        return {
            detailColumns: detailColumns,
            dataSource: {
                type: "json",
                transport: {
                    read: function (options) {
                        $.ajax({
                            url: deliveryUrl,
                            type: "POST",
                            dataType: 'json',
                            contentType: "application/json; charset=utf-8",
                            data: data,
                            success: function (response) {

                                options.success(response);
                            }
                        });
                    }
                }
            },
            dataBound: detailDataBound
        }
    }

    function createDetailsGrid(grid, e) {
        KendoPlugins.CreateSimpleGrid(grid, getDetailOption(e));
    }

    function detailDataBound(e) {
        setColorToRows(e.sender.element);
    }

    function setColorToRows(grid) {
        var rows = $('tbody tr', grid);

        rows.each(function (i, row) {
            var color = $('td[color]', row).attr('color');

            $(row)
                .css('color', color)
                .addClass('delivery');
        });
    }

    function delDeliveriesRow(row) {
        if (row.children().first().text() == '-1') {
            var nextRow = row.next();

            row.remove();

            delDeliveriesRow(nextRow);
        }
    }

    function GetSelectedDelayTypes() {
        var delayTypes = [];

        $('.delayFilter.active')
            .each(
                function (i, el) {
                    delayTypes[i] = $(el).attr('category');
                });

        return delayTypes;
    }
}

function getDeliveryColor(debtDays) {

    //grenceColor глобальная переменная, обьявляется на вью
    for (var i = 0; i < grenceColor.length; i++)
        if (debtDays <= grenceColor[i].value) {
            return grenceColor[i].color;
        }

    return 'red';
}
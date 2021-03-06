﻿function CreateDebitoreGrid(debitoreTableUrl, deliveryUrl, grenceColor, user) {

    LoadContactsHierarchy(initGrid);

    var sumAggregates =
        getAggregatesByColumn(
        [
            'AllSum',
            'LimitSum',
            'debtSum',
            'Less8Days',
            'for8to14Days',
            'for15to21Days',
            'for22to28Days',
            'other',
            'grather100Days'
        ]);

    var columns = [
        {
            field: 'Contact.name',
            title: 'Контакт'
        },
        {
            field: 'Contact.FirstLevel',
            title: '1-й уровень иерархии'
        },
        {
            field: 'Contact.MainManager',
            title: 'Основной менеджер'
        },
        {
            field: 'Contact.Manager',
            title: 'Менеджер'
        },
        //{
        //	command: {
        //		name: "Details",
        //		click: showDetails,
        //		className: "k-icon k-i-expand"
        //	},
        //	title: " ",
        //	width: "50px",
        //},
        {
            field: "dayLimit",
            title: "Лимит<br/>дни",
            width: "100px"
        },
        {
            field: "AllSum",
            title: "Общий долг<br/>контрагента",
            format: "{0:n2}",
            aggregates: ["sum"],
            width: "125px",
            footerTemplate: function (arg) { return kendo.valueToFooterString(arg.AllSum.sum); }
        },
        {
            field: "LimitSum",
            title: "Лимит<br/>сумма",
            format: "{0:n2}",
            width: "110px",
            aggregates: ["sum"],
            footerTemplate: function (arg) { return kendo.valueToFooterString(arg.LimitSum.sum); }
        },
        {
            field: "debtSum",
            title: "Просроченный<br/>долг",
            format: "{0:n2}",
            width: "110px",
            aggregates: ["sum"],
            footerTemplate: function (arg) { return kendo.valueToFooterString(arg.debtSum.sum); }
        },
        {
            field: "Less8Days",
            title: "Не более<br/>7 дней",
            format: "{0:n2}",
            width: "110px",
            aggregates: ["sum"],
            footerTemplate: function (arg) { return kendo.valueToFooterString(arg["Less8Days"].sum); },
            filterable: false,
            sortable: false
        },
        {
            field: "for8to14Days",
            title: "От 8 <br/>до 14 дней",
            format: "{0:n2}",
            width: "120px",
            aggregates: ["sum"],
            footerTemplate: function (arg) { return kendo.valueToFooterString(arg["Less8Days"].sum); },
            filterable: false,
            sortable: false
        },
        {
            field: "for15to21Days",
            title: "От 15 <br/>до 21 дней",
            format: "{0:n2}",
            width: "120px",
            aggregates: ["sum"],
            footerTemplate: function (arg) { return kendo.valueToFooterString(arg["for15to21Days"].sum); },
            filterable: false,
            sortable: false
        },
        {
            field: "for22to28Days",
            title: "От 22 <br/>до 28 дней",
            format: "{0:n2}",
            width: "120px",
            aggregates: ["sum"],
            footerTemplate: function (arg) { return kendo.valueToFooterString(arg["for22to28Days"].sum); },
            filterable: false,
            sortable: false
        },
        {
            field: "other",
            title: "Прочий<br/>долг",
            format: "{0:n2}",
            width: "120px",
            aggregates: ["sum"],
            footerTemplate: function (arg) { return kendo.valueToFooterString(arg["other"].sum); },
            filterable: false,
            sortable: false
        },
        {
            field: "grather100Days",
            title: "Остальные <br/>(не менее 101 дня)",
            format: "{0:n2}",
            width: "150px",
            aggregates: ["sum"],
            footerTemplate: function (arg) { return kendo.valueToFooterString(arg["grather100Days"].sum); },
            filterable: false,
            sortable: false
        }
    ];

    var groupFields = [
        {
            field: 'Contact.FirstLevel',
            aggregates: sumAggregates,
        },
        {
            field: 'Contact.MainManager',
            aggregates: sumAggregates
        },
        {
            field: 'Contact.Manager',
            aggregates: sumAggregates,
        }
    ];

    function getDataSource(contacts) {

        return new kendo.data.DataSource({
            type: "json",
            schema: {
                parse: function (d) {
                    d.forEach(function (item) {
                        item.Contact = contacts[item.contact_id];

                        //item.FaktByPlanProcent = getPercent(item.Plan, item.FaktByPlan);
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
                            byDate: $('#byDateDatepicker').val(),
                            User: user
                        }),
                        success: options.success
                    });
                }
            },
            group: groupFields,
            aggregate: sumAggregates,
            //sort: {
            //	field: "FaktByPlanProcent",
            //	dir: "asc"
            //}
        });
    }

    function initGrid(contacts) {

        var gridCofiguration = {
            columns: getColumns(),
            dataSource: getDataSource(contacts),

            dataBound: onDataBound,
            dataBinding: onDataBinding,
            detailInit: detailInit,

            sortable: true,
            filterable: true,
            scrollable: false,
            groupable: true,
        };

        $('#Grid').kendoGrid(gridCofiguration);

        //$('#saveSettingsButton').on('click', function () {
        //	var grid = $('#Grid').data("kendoGrid");

        //	settingManager.updateActiveColumnSetting();

        //	grid.dataSource._group = settingManager.getGroupField(grid.dataSource._group);
        //	grid.setOptions({
        //		columns: getColumns()
        //	});
        //});

        $('#refresh').on('click', function () {

            settingManager.updateDateRangeSetting();
        });
    }

    function onDataBound(e) {
        var grid = e.sender.element;

        collapseAllGroups(grid);
        setGroupHead(grid);

        $('div.highlight').each(function (index, element) {
            $(element).parent().addClass("highlight");
        });

    }

    function getColumns() {

        initGroupHeaderNames(columns);

        return columns;
    }

    function onDataBinding(e) {

        var grid = e.sender.element;

        showMasterItems(grid);
        sortGroupByAggregatesValue(grid);
    }

    function detailInit(e) {

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
        //var aggregate = getSumAggregates(['Weight', 'Sum']);
        //aggregate.push({ field: 'IsPlan', aggregate: 'count' });

        $("<div/>")
            .appendTo(e.detailCell)
            .kendoGrid({
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
                scrollable: false,
                sortable: true,
                dataBound: detailDataBound,
                columns: [
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
                        title: "Дни долга"
                    },
                    {
                        field: "dayLimit",
                        title: "Лимит дни"
                    },
                    {
                        field: "LimitSum",
                        template: function (arg) {
                            return kendo.valueToFooterString(arg.LimitSum);
                        },
                        title: "Долг"
                    }
                ]
            });
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


    function callCustomAggregates(items) {
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.aggregates.FaktByPlanProcent = item.aggregates.FaktByPlanProcent || {};
            item.aggregates.FaktByPlanProcent.custom = getPercent(item.aggregates.Plan.sum, item.aggregates.FaktByPlan.sum);

            if (item.hasSubgroups) {
                callCustomAggregates(item.items);
            }
        }
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

    for (var i = 0; i < grenceColor.length; i++)
        if (debtDays <= grenceColor[i].value) {
            return grenceColor[i].color;
        }

    return 'red';
}
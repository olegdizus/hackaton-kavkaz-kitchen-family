var KSPlansKPIGrid = function (gridId) {

    $(gridId).empty();

    var dataSource = new kendo.data.DataSource({
        transport: {
            read: function(options) {

                $.ajax({
                    url: basePath + "KSPlans/GetPlans",
                    data: {
                        region_id: getRegionId(),
                        indicator_id: getIndicatorId(),
                        date: getDateFromDatepicker(),
                    },
                    type: 'post',
                    success: function(response) {
                        if (response.success === false) {
                            alert(response.message ? response.message : 'При получении данных произошла ошибка');
                        } else {

                            options.success(response.result);
                        }

                    },
                    error: function() {
                        alert('При загрузке данных произошла ошибка');
                    }
                });
            },

            update: function(options) {

                if (options.data.plan == null
                    || options.data.plan == "") {
                    options.data.plan = "0";
                }

                var data = {
                    region_id: getRegionId(),
                    good_id: options.data.id,
                    indicator_id: getIndicatorId(),
                    plan: options.data.plan.toString().replace('.', ','),
                    date: getDateFromDatepicker()
                }

                $.ajax({
                    url: basePath + "KSPlans/UpdateSalesPlans",
                    type: 'post',
                    data: data,
                    success: function(response) {
                        
                        if (response.success === false) {
                            alert('При записи данных произошла ошибка');
                        }

                    },
                    error: function() {
                        alert('При записи данных произошла ошибка');
                    }
                });

                options.success(options.data);
            }
        },
        group: {
            field: "groupName",
            aggregates: [
                {
                    field: "plan",
                    aggregate: "sum"
                }
            ]
        },
        
        schema: {
            model: {
                id: "id",
                fields: {
                    name: {
                        type: "string",
                        editable: false
                    },
                    plan: {
                        type: "number",
                        editable: true
                    }
                }

            }
        },
        aggregate: [
            {
                field: "plan",
                aggregate: "sum"
            }
        ]
    });

    var nameColumn = [
        {
            field: "groupName",
            title: "Продуктовая группа",

            template: "<div> #=groupName#</div>"
        },
        {
            field: "name",
            title: "Номенклатура",
            footerTemplate: "Итого:"
        },
        {
            field: "userName",
            title: "Последнее редактирование",
            width: 250
        },
        {
            field: "plan",
            title: "План",
            width: "200px",
            template: "<div> #=plan>0 ? kendo.toString(plan, 'n2') : ''#</div>",
            footerTemplate: "#=FormatValueWithSpaceFormat(sum, 'n2')#",
            renderTemplate:"#=data.aggregates.plan.sum#",
            aggregates: ["sum"]
        }
    ];


    var endColumns = [
        {
            field: "command",
            command: [
                {
                    name: "edit",
                    text: {
                        edit: "",
                        update: "",
                        cancel: ""
                    }
                }
            ],
            title: "&nbsp;",
            width: "110px"
        }
    ];


    var columns = nameColumn
        .concat(endColumns);


    $(gridId)
        .kendoGrid({
            dataSource: dataSource,
            columns: columns,
            filterable: true,
            sortable: true,
            editable: 'inline',
            height: 600,
            groupable: true,
            //autoBind: false,
            dataBound: onDataBound
        });


}

function setGroupItemCount() {
    if ($("#grid").data("kendoGrid").dataSource._group.length >= 1) {
        var grid = $("#grid").data('kendoGrid');
        grid.hideColumn("userName");

        grid.hideColumn("command");
    } else {
        var grid = $("#grid").data('kendoGrid');
        grid.showColumn("userName");

        grid.showColumn("command");
    }
}


function showOnlyNotEmplyColumn(countClassName) {

    var countDivs = $(countClassName);
    $.each(countDivs, setDisplayRows);
}

function setDisplayRows(i, div) {
    var count = $(div).html();
    if (count == 0) {
        $(div).closest('tr').css('display', 'none');
    }
}



function getRegionId() {
    return $("#Regions").val();
}

function getIndicatorId() {
    return $("#Indicators").val();
}
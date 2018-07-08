$(function() {
    window.dateManager = new DateManager(UpdateKendoGrid);
});


function UpdateKendoGrid(init) {
    clearMessage();

    var grid = $('#grid');
    grid.empty();

    if (!init) {
        date = getDateFromDatepicker();
    }

    CreatePlanGrid(
                grid,
                date,
                "Plan/GetGridColumns",
                "Plan/GetRegionRows"
        );
}

function showError(text) {
    clearMessage();

    $('#errorSpan').text(text);
}

function showinfo(text) {
    clearMessage();

    $('#infoSpan').text(text);
}

function clearMessage() {
    $('#errorSpan, #infoSpan').text('');
}

// Создание грида

function UpdatePlanByRegion(data, date) {

    var postObject = {};

    for (key in data) {

        if (key == 'name' || key == 'id') {
            continue;
        }

        postObject[key] = data[key] == 0 ? null : data[key];
    }

    postObject['region_id'] = data.id;
    postObject['month'] = date;


    console.log("postObject");
    console.log(postObject);

    $.ajax({
        url: basePath + "Plan/SavePlan",
        type: 'post',
        data: JSON.stringify(postObject),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.success === false) {

                alert(response.message ? response.message : 'При записи данных произошла ошибка');
            }
        },
        error: function () {
            alert('При записи данных произошла ошибка.');
        }
    });
}

function CreatePlanGrid(grid, date, urlGridColumns, urlRegionRows) {
    var variants = [];

    var aggregates = [];

    var fields = {
        name: {
            type: "string",
            editable: false
        },
        margin: {
            type: "string",
            editable: false
        }
    }

    $.ajax({
        url: basePath + urlGridColumns,
        type: 'post',
        async: false,
        success: function (response) {
            for (var i = 0; i < response.length; i++) {
                var field = response[i].field;

                var variant = {
                    field: field,
                    title: response[i].name,
                    headerTemplate: response[i].name + (response[i].description ? '</br>' + response[i].description : ''),
                    footerTemplate: "#=FormatValueWithSpaceFormat(sum, 'n2')#",
                    aggregates: ['sum'],
                    template: "#=FormatValueWithSpaceFormat(" + field + ", 'n2')#"
                }

                variants.push(variant);

                var aggregate = { field: field, aggregate: "sum" };

                aggregates.push(aggregate);

                fields[field] = {
                    type: "number",
                    editable: true
                }
            }

        },
        error: function () {
            alert('При загрузке данных произошла ошибка');
        }
    });

    var dataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                $.ajax({
                    url: basePath + urlRegionRows,
                    data: {
                        date: date
                    },
                    type: 'post',
                    success: function (response) {
                        options.success(response);
                    },
                    error: function () {
                        alert('При загрузке данных произошла ошибка');
                    }
                });
            },
            update: function (options) {
                UpdatePlanByRegion(options.data, date);

                options.success(options.data);
            }
        },
        schema: {
            model: {
                id: "id",
                fields: fields
            }
        },
        aggregate: aggregates
    });

    var nameColumn = [
        {
            field: "name",
            title: "Регион",
            footerTemplate: "Итого:",
        }
    ];

    var calculatedColumn = [
        {
            field: "margin",
            title: "Наценка, %",
            footerTemplate: "#=FormatValueWithSpaceFormat((data.profit.sum/(data.sum.sum-data.profit.sum)*100), 'n2')#",
            template: "#=FormatValueWithSpaceFormat((profit/(sum-profit)*100), 'n2')#",
        }
    ];

    var commandColumn = [
        {
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
            width: "60px"
        }
    ];

    var columns = nameColumn
        .concat(variants)
        .concat(calculatedColumn)
        .concat(commandColumn);

    $(grid).empty();

    var kendoGrid = $(grid)
        .kendoGrid({
            dataSource: dataSource,
            columns: columns,
            filterable: true,
            editable: 'inline',
            sortable: true,
            height: 600
        })
        .data('kendoGrid');

    return kendoGrid;
}
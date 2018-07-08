var MatrixKPIGrid = function (grid, position_id, date, cbViewAllIndicator) {
    var variants = [];

    var aggregates = [];

    var fields = {
        name: {
            type: "string",
            editable: false
        }
    }

    $.ajax({
        url: basePath + "MatrixOfKeyPerformanceIndicators/GetVariantsForGridColumns",
        type: 'post',
        data: {
            position_id: position_id
        },
        async: false,
        success: function (response) {
            for (var i = 0; i < response.length; i++) {
                var field = 'variant' + response[i].id;

                var variant = {
                    field: field,
                    title: response[i].name,
                    template: "#=" + field + ">0 ? " + field + " + ' %' : ''#",
                    headerTemplate: response[i].name + (response[i].description? '</br>' + response[i].description:''),
                    footerTemplate: "<div style='color: #=sum == 100? 'black':'red'#'>#=sum==null||sum==0?'0':sum# %</div>",
                    aggregates: ['sum']
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
            read: function(options) {
                $.ajax({
                    url: basePath + "MatrixOfKeyPerformanceIndicators/GetKPI",
                    data: {
                        position_id: position_id,
                        date: date,
                        cbViewAllIndicator: cbViewAllIndicator
                    },
                    type: 'post',
                    success: function(response) {
                        options.success(response);
                    },
                    error: function() {
                        alert('При загрузке данных произошла ошибка');
                    }
                });
            },
            update: function(options) {
                updateKpiMatrix(options.data);

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

    var updateKpiMatrix = function (data) {

        var matrixValues = [];

        var curIndicatorId = data.id;

        for (key in data) {

            if (key.indexOf("variant") == 0){

                if (data[key] == null) {
                    data[key] = 0;
                }

                var variantId = Number(key.substr(7, key.length - 7));

                var matrixValue = {
                    indicatorId: curIndicatorId,
                    variantId: variantId,
                    value: data[key]
                }

                matrixValues.push(matrixValue);
            }
        }

        $.ajax({
            url: basePath + "MatrixOfKeyPerformanceIndicators/UpdateKPI",
            type: 'post',
            data: {
                position_id: position_id,
                values: JSON.stringify(matrixValues),
                date: date
            },
            success: function (response) {
                if (response.success === false) {
                    alert('При записи данных произошла ошибка');
                }
            },
            error: function () {
                alert('При записи данных произошла ошибка');
            }
        });
    }

    var nameColumn = [
        {
            field: "name",
            title: "Показатель",
            footerTemplate: "Итого:",
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
            title: "&nbsp;"
        }
    ];

    var columns = nameColumn
        .concat(variants
            .concat(commandColumn));

    $(grid).empty();

    var kendoGrid = $(grid).kendoGrid({
        dataSource: dataSource,
        columns: columns,
        filterable: true,
        sortable: true,
        editable: 'inline'
    }).data('kendoGrid');

    return kendoGrid;
}
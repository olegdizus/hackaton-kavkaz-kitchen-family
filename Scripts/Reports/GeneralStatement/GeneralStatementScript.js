function UpdateKendoGrid() {
    var grid = $('#Grid');
    grid.empty();

    CreateKendoGrid(
        grid, "GeneralStatement/GetGridColumns", "GeneralStatement/GetGridRows"
    );

}
$(document).ready(function () {
    $("#export").click(function (e) {
        var grid = $("#Grid").data("kendoGrid");

        grid.saveAsExcel();
    });

    UpdateKendoGrid();
});

function MonthChanged(date) {
    UpdateKendoGrid();
}

function CreateKendoGrid(grid, urlGridColumns, urlRegionRows) {
    var columns = [];
    var aggregates = [];

    var fields = {
        name: {
            type: "string",
            editable: false
        }
    };

    $.ajax({
        url: basePath + urlGridColumns,
        type: 'post',
        async: false,
        success: function (response) {
            for (var i = 0; i < response.length; i++) {
                var field = response[i].field;
                var ind = response[i].ind;

                var column = {
                    field: field,
                    title: response[i].name,
                }; // Для первой колонки поставить в шаблоне подошвы "Всего"

                if (i == 0) {
                    column.template = kendo.template("<a href=' "
                        + basePath
                        + "SalesSalary/Index?employee_id="
                        + "#=" + ind + "#"
                        + "'id='box'>#=" + field + "#</a>");
                    column.footerTemplate = "Всего:";

                }
                    // Для колонок со второй - проводить суммирование данных
                else if (i > 2) {
                    column.template = "#=FormatValueWithSpaceFormat(" + field + ", 'n2')#";
                    column.footerTemplate = "#=FormatValueWithSpaceFormat(sum, 'n2')#";

                    var aggregate = { field: field, aggregate: "sum" };
                    aggregates.push(aggregate);
                }

                columns.push(column);
            }

        },
        error: function () {
            alert('При загрузке данных произошла ошибка');
        }
    });

    var dataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                var beginDate = $('#currDate').data('date');

                $.ajax({
                    url: basePath + urlRegionRows,

                    data: {
                        beginDate: beginDate
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

        aggregate: aggregates,

        schema: {
            model: {
                id: "id",
                fields: fields
            }
        },
        sort: {
            field: "name",
            dir: "asc"
        }
    });

    $(grid).empty();

    var kendoGrid = $(grid)
        .kendoGrid({
            //toolbar: ["excel"],
            excel: {
                allPages: true,
                fileName: "Общая ведомость за " + $('#currDate').text().replace(/\s+/g, "") + ".xlsx",
            },
            excelExport: function (e) {

                var sheet = e.workbook.sheets[0];

                for (var rowIndex = 1; rowIndex < sheet.rows.length; rowIndex++) {

                    var row = sheet.rows[rowIndex];

                    if (rowIndex % 2 == 0) {
                        for (var cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
                            row.cells[cellIndex].background = "#aabbcc";
                        }
                    }

                }

            },
            dataSource: dataSource,
            sortable: true,
            columns: columns,          
            filterable: true,
            editable: 'inline'
        })
        .data('kendoGrid');

    return kendoGrid;
}
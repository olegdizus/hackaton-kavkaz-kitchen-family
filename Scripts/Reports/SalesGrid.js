function CreateSalesGrid(grid,getSaleContactReportUrl, getSaleEmployeeReportUrl, getColumnNamesUrl, user) {

    var employesColor = [];

    var fields = {
        id: { type: "number" },
        ContactName: { type: "string" },
        Employe: { type: "string" },
        Supervizer: { type: "string" },
        Sum: { type: "number" }

    };

    var columns = [
        {
            field: "id",
            hidden: true
        },
        { field: "ContactName", title: "Наименование", footerTemplate: "Итого:", width: "200px" },
        {
            field: "Employe",
            title: "ТП",
            hidden: true,
            groupHeaderTemplate: groupHeaderName,
            footerTemplate: function () {

                var grid = $("#Grid").data("kendoGrid");

                grid.tbody.find('>tr td[aria-expanded]').removeAttr('colspan');
                grid.tbody.find('>p').remove();

                $('.k-i-expand').removeClass('k-button k-button-icontext');
            }
        },
        { field: "Supervizer", title: "Супервайзер", width: "200px" },
        {
            //Тестовое поле, которое суммирует id.
            field: "Sum",
            title: "Сумма",
            customFormat: 'currency',
            width: "100px",
            template: function (arg) { return kendo.valueToString(arg.Sum); },
            footerTemplate: function (arg) { return kendo.valueToFooterString(arg.Sum.sum); },
            filterable: false,
            sortable: false
        }
    ];


    var aggregates = [
    { field: "Sum", aggregate: "sum" }
    ];


    var makerResultFunctions = function (fieldName) {
        return function (arg) {
            return kendo.valueToFooterString(arg[fieldName].sum);
        };
    };

    var templateMaker =
        function (fieldName) {
            return function (arg) {
                if (arg.values && arg.values[fieldName])
                    return "<div class=\"right-align sale-div\" style='background-color:" + arg.colors[fieldName] + "'>" + kendo.valueToString(arg.values[fieldName]) + "</div>";
                return "";
            };
        };

    $.ajax({
        url: getColumnNamesUrl,
        type: 'post',
        async: false,
        dataType: 'json',
        contentType: 'application/json',
        data: FilterParameters({}),
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                
                var fieldName = "values.f" + data[i];

                fields[fieldName] = {
                    type: "number"
                };

                var column = {
                    field: fieldName,
                    title: data[i].replace(/_/g, '.'),
                    footerTemplate: //"#=arg."+fieldName+".sum#",
                        makerResultFunctions(fieldName),
                    template: templateMaker("f" + data[i]),
                    customFormat: 'currency',
                    filterable: false,
                    sortable: false,
                    width: "100px"
                };

                columns.push(column);

                aggregates.push({ field: fieldName, aggregate: "sum" });

            }
        }
    });

    setColumnFormat(columns);


    $.ajax({
        url: getSaleEmployeeReportUrl,
        type: 'post',
        async: false,
        dataType: 'json',
        contentType: 'application/json',
        data: FilterParameters(),
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                employesColor[data[i].Employe] = data[i];
            }
        }
    });

    function FilterParameters() {

        var options = getDates();

        options.period = $('input[name=period]:checked').val();
        options.type = $('input[name=sumOrWeidth]:checked').val();
        options.User = user;

        return JSON.stringify(options);
    }

    var dataSource = new kendo.data.DataSource({
        type: "json",
        transport: {
            read: {
                url: getSaleContactReportUrl,
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8",
            },
            //Передача параметров GetSaleContactReport, где передаются хранимым процедурам.
            parameterMap: FilterParameters
        },
        schema: {
            model: { fields: fields }
        },
        serverFiltering: true,
        //serverSorting: true,
        sort: { field: "ContactName", dir: "asc" },
        group: {
            field: "Employe",
            aggregates: aggregates
        },
        aggregate: aggregates
    });

    setColumnFormat(columns);

    grid.kendoGrid({
        height: $(document).height() - 20,

        sortable: true,
        pageable: false,
        columns: columns,

        dataSource: dataSource,
        filterable: true
    });

    function groupHeaderName(e) {
        // Do whatever you need to here.
        // var agr = e.aggregates;

        var result = '<td role="gridcell" colspan=2>'
            + e.value + '</td>';

        var curValues = employesColor[e.value];

        if (curValues) {
            for (var i = 0; i < aggregates.length; i++) {
                var fieldName = "curValues." + aggregates[i].field;
                var colorName = fieldName.replace("values", "colors");
                result += '<td role="gridcell" > <div class="right-align sale-div" style="background-color:' + eval(colorName) + '" >'
                    + kendo.valueToString(eval(fieldName)) + '</div></td>';

            }
        }

        return result;

    }
}
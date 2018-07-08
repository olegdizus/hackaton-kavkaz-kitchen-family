function CreateTestDataGrid(getDataReportUrl, getColumnNamesUrl, getDetailUrl) {

    var fields = {
        id: { type: "number" },
        Kategory: { type: "string" },
        Indikator: { type: "string" }

    };

    var columns = [
        {
            field: "id",
            hidden: true
        },
        {
            field: "Kategory",
            title: "Категория",
            width: "200px", hidden: true
        },
        {
            field: "Indikator",
            title: "Показатель", width: "200px"
        }
    ];

    var columnsDetail = [
        {
            field: "contact",
            title: "Контрагент", width: "200px"
        }
    ];

    var templateMaker =
        function (fieldName) {
            return function (arg) {
                if (arg.values && arg.values[fieldName])
                    return "<div>" +  kendo.valueToString(arg.values[fieldName]) + "</div>";
                if (arg.values && arg.values[fieldName] == 0)
                    return "0";
                return "";
            };
        };

    function FilterParameters(options) {

        options.period = $('#periodDatepicker').val();

        return JSON.stringify(options);
    }

    function detailInit(e) {

        var data = {
            period: $('#periodDatepicker').val(),
            indicator: e.data.Indikator,
            onlyDifference: $('#onlyDifference').is(':checked')
    }

        $("<div/>").appendTo(e.detailCell).kendoGrid({
            dataSource: {
                type: "json",
                transport: {
                    read: {
                        url: getDetailUrl,
                        type: "POST",
                        data: data
                    }
                }
            },
            scrollable: false,
            sortable: true,
            columns: columnsDetail
        });
    }

    var dataSource = new kendo.data.DataSource({
        type: "json",
        transport: {
            read: {
                url: getDataReportUrl,
                dataType: "json",
                type: "post",
                contentType: "application/json; charset=utf-8",
            },
            parameterMap: FilterParameters
        },
        schema: {
            model: { fields: fields }
        },
        group: {
            field: "Kategory",
            dir: "asc"
        },
        serverFiltering: true,
        //serverSorting: true,
        sort: [{ field: "Kategory", dir: "asc" }, { field: "Indikator", dir: "asc" }]
    });

    $.ajax({
        url: getColumnNamesUrl,
        type: 'post',
        async: false,
        dataType: 'json',
        contentType: 'application/json',
        data: FilterParameters({}),
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                var field = {};
                var fieldName = data[i].replace(/ /g, '');

                fields[fieldName] = {
                    type: "number"
                };

                var column = {
                    field: fieldName,
                    title: data[i],
                    format: 'currency',
                    template: templateMaker(data[i].replace(/ /g, '')),
                    filterable: false,
                    sortable: false,
                    width: "100px"
                };

                columns.push(column);

            }
        }
    });

    $.ajax({
        url: getColumnNamesUrl,
        type: 'post',
        async: false,
        dataType: 'json',
        contentType: 'application/json',
        data: FilterParameters({}),
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                var field = {};
                var fieldName = data[i].replace(/ /g, '');

                fields[fieldName] = {
                    type: "number"
                };

                var columnDetail = {
                    field: fieldName,
                    title: data[i],
                    template: templateMaker(data[i].replace(/ /g, '')),
                    format: 'currency',
                    filterable: false,
                    sortable: false,
                    width: "100px"
                };

                columnsDetail.push(columnDetail);

            }
        }
    });

    setColumnFormat(columns);

    $("#grid").kendoGrid({
        height: $(document).height() - 20,

        sortable: true,
        pageable: false,
        columns: columns,
        detailInit: detailInit,

        dataSource: dataSource,
        filterable: kendo.LocalizeFilters()
    });

}
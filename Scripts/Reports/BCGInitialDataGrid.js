var BCGInitialDataGrid = function (grid, readOnly, additionalDataCalculator) {
    var dataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                $.ajax({
                    url: basePath + "BCG/GetBrandsWithIndicatorValue",
                    type: 'post',
                    data: {
                        beginDate: getDates().beginDate,
                        endDate: getDates().endDate,
                        difPeriodType: $('#previousPeriodsList').val(),
                        periodType: $('#periodTypeList').val(),
                        indicatorId: $('#indicatorsList').val(),
                        reportId: $('#reportId').val(),
                        fromReportId: $('#fromReportId').val(),
                        classification: $('#classificationList').val()
                    },
                    success: function (response) {
                        if (kendoGrid.copyEditableAttributes) {
                            kendoGrid.copyEditableAttributes(response);
                        }
                        
                        options.success(response);
                    },
                    error: function () {
                        alert('При загрузке данных произошла ошибка');
                    }
                });
            },
            update: function (options) {
                options.success(options.data);
            }
        },
        schema: {
            model: {
                id: "classificationType",
                fields: {
                    Checked: {
                        type: "bool"
                    },
                    Brand: {
                        type: "string",
                        editable: false
                    },
                    IndicatorValue: {
                        type: "number",
                        editable: false
                    },
                    GrowthTempo: {
                        type: "number",
                        editable: false
                    },
                    MarketVolume: {
                        type: "number"
                    },
                    AverageTempo: {
                        type: "number",
                        editable: false
                    },
                    GrowthForMatrix: {
                        type: "string",
                        editable: false
                    },
                    PartInSegment: {
                        type: "number"
                    },
                    MainConcurentMarketPart: {
                        type: "number"
                    },
                    RelativeMarketPart: {
                        type: "number",
                        editable: false
                    },
                    PartForMatrix: {
                        type: "string",
                        editable: false
                    }
                }
            }
        },
        aggregate: [
            { field: "IndicatorValue", aggregate: "sum" },
            { field: "MarketVolume", aggregate: "sum" }
        ]
    });

    function editNumber(container, options) {
        $('<input data-bind="value:' + options.field + '"/>')
            .appendTo(container)
            .kendoNumericTextBox({
                format: options.format,
                spinners: false
            });
    }

    var checkboxTemplate = '<input type="checkbox" #= Checked ? \'checked="checked"\' : "" # class="chkbx"/>';
    var disabledCheckboxTemplate = '<input type="checkbox" #= Checked ? \'checked="checked"\' : "" # disabled class="chkbx"/>';

    var columns = [
        {
            field: "Checked",
            title: "&nbsp",
            width: "50px",
            template: readOnly ? disabledCheckboxTemplate : checkboxTemplate,
            editor: '<input type="checkbox" data-bind="checked: Checked" #= Checked ? checked="checked" : """ # class="chkbx"/>'
        },
        {
            field: "Brand",
            title: "Название группы",
            width: "250px"
        },
        {
            field: "IndicatorValue",
            title: "Значение показателя, руб",
            format: "{0:n0}",
            aggregates: "sum",
            footerTemplate: "#= sum != null ? kendo.toString(sum, 'n0') : '' #"
        },
        {
            field: "GrowthTempo",
            headerTemplate: 'Темп роста, %',
            format: "{0:p0}",
            editor: editNumber
        },
        {
            field: "MarketVolume",
            headerTemplate: 'Емкость рынка, руб',
            format: "{0:n0}",
            aggregates: "sum",
            editor: editNumber,
            footerTemplate: "#= sum != null ? kendo.toString(sum, 'n0') : '' #"
        },
        {
            field: "AverageTempo",
            title: "Взвешенный темп роста, %",
            format: "{0:p0}"
        },
        {
            field: "GrowthForMatrix",
            title: "Рост для матрицы"
        },
        {
            field: "PartInSegment",
            headerTemplate: 'Доля рынка бренда в сегменте, %',
            format: "{0:p0}",
            editor: editNumber
        },
        {
            field: "MainConcurentMarketPart",
            headerTemplate: 'Доля рынка ключевого конкурента, %',
            format: "{0:p0}",
            editor: editNumber
        },
        {
            field: "RelativeMarketPart",
            title: "Относительная доля рынка",
            format: "{0:n2}"
        },
        {
            field: "PartForMatrix",
            title: "Доля для матрицы"
        }
    ];

    if (!readOnly) {
        columns.push({
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
            width: "120px"
        });
    }
    var gridDiv = $(grid);

    gridDiv.kendoGrid({
        dataBinding: function (e) {
            additionalDataCalculator(e.items);
        },
        dataSource: dataSource,
        columns: columns,
        autoBind: false,
        editable: readOnly ? false : 'inline',
        scrollable: false,
        resizable: true,
    });

   var kendoGrid = gridDiv.data('kendoGrid');

   gridDiv.unbind('change');

   gridDiv.on("change", "input.chkbx", function (e) {
        var dataItem = kendoGrid.dataItem($(e.target).closest("tr"));

        dataItem.set("Checked", this.checked);
    });

    return kendoGrid;
}
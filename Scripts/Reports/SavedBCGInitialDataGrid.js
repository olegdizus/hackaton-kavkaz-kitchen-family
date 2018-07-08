var SavedBCGInitialDataGrid = function(grid) {
    var dataSource = new kendo.data.DataSource({
        transport: {
            read: function(options) {
                $.ajax({
                    url: basePath + "BCG/GetAllBCGReports",
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
                options.success(options.data);
            }
        },
        schema: {
            model: {
                id: "id",
                fields: {
                    name: { type: "string" },
                    beginDate: { type: "date" },
                    endDate: { type: "date" },
                    hst_datetime: { type: "date" },
                    userName: { type: "string" },
                }
            }
        },
    });

    var columns = [
        {
            field: "hst_datetime",
            title: "Дата создания отчета",
            format: "{0:dd.MM.yyyy}"
        },
        {
            field: "name",
            title: "Показатель",
            width: "200px"
        },
        {
            field: "beginDate",
            title: "Начало периода",
            format: "{0:dd.MM.yyyy}"
        },
        {
            field: "endDate",
            title: "Конец периода",
            format: "{0:dd.MM.yyyy}"
        },
        {
            field: "userName",
            title: "Кто создал"
        },
        {
            command: [
                {
                    "name": "view",
                    "buttonType": "ImageAndText",
                    "iconClass": "fa",
                    "imageClass": "fa-file-text-o fa-lg",
                    "text": "",
                    "click": detailClick
                },
                {
                    "name": "edit",
                    "buttonType": "ImageAndText",
                    "iconClass": "fa",
                    "imageClass": "fa-edit fa-lg",
                    "text": {
                        "cancel": "",
                        "update": "",
                        "edit": ""
                    },
                    "click": editClick
                },
                {
                    "name": "mydelete",
                    "buttonType": "ImageAndText",
                    "text": "",
                    "imageClass": "fa-trash-o fa-lg",
                    "className": "my-delete-button",
                    "iconClass": "fa",
                    "click": deleteElement

                }
            ],
            width: "200px",
        }
    ];

    var kendoGrid = $(grid).kendoGrid({
        dataSource: dataSource,
        columns: columns,
        filterable :true,
        pagable: true,
        sortable: true,
        pageSize: 10,
    }).data('kendoGrid');
    
    function deleteElement(e) {
        var selectedItem = getSelectedItem(this, e);

        if (confirm("Удалить отчет?")) {
            $.ajax({
                url: basePath + "BCG/Delete",
                type: 'post',
                data: {
                    id: selectedItem.id
                },
                success: function(response) {
                    if (!response.success) {
                        showErrorAlert();
                        return;
                    }

                    kendoGrid.dataSource.read();
                },
                error: function(response) {
                    showErrorAlert();
                }
            });
        }
    }

    function showErrorAlert() {
        alert("При удалении отчета произошла ошибка");
    }

    function detailClick(e) {
        var selectedItem = getSelectedItem(this, e);

        window.open(basePath + 'BCG/BCGInitialDataView?reportId=' + selectedItem.id, '_blank');

        removeSelectionFromKendoGrid();
    }

    function editClick(e) {
        var selectedItem = getSelectedItem(this, e);

        window.open(basePath + 'BCG/BCGInitialDataView?editOnOpen=1&reportId=' + selectedItem.id, '_blank');

        removeSelectionFromKendoGrid();
    }

    function getSelectedItem(that, e) {
        return that.dataItem($(e.currentTarget).closest("tr"));
    }
    
    function removeSelectionFromKendoGrid() {
        $('tr.k-state-selected').removeClass('k-state-selected');
    }

    return kendoGrid;
}

$(function () {
    SavedBCGInitialDataGrid("#grid");
});
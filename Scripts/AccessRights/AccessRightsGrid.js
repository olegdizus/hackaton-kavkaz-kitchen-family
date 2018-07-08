function addAccessRightElement(options) {
   $.ajax({
        url: basePath + "AccessRights/AddAccessRight",
        type: 'post',
        data: {
            userName: options.userName,
            hierarchyValueId: options.hierarchyValueId,
            hierarchyId: options.hierarchyId
        },
        success: function (response) {
            if (!response.success) {
                showErrorAlert(response.message);
                return;
            }

            $(options.grid).data('kendoGrid').dataSource.read();
        },
        error: function () {
            showErrorAlert("Ошибка при добавлении настройки");
        }
    });
}

var AccessRightsGrid = function (grid, userName, isReport) {

    var dataSource = new kendo.data.DataSource({
        transport: {
            read: function(options) {
                $.ajax({
                    url: basePath + "AccessRights/GetAllAccessRights",
                    type: 'post',
                    data: { userName: userName },
                    success: function(response) {
                        options.success(response);
                    },
                    error: function() {
                        alert('При загрузке данных произошла ошибка');
                    }
                });
            }
        },
        schema: {
            model: {
                id: "id",
                fields: {
                    userName: {
                        type: "string",
                        editable: false
                    },
                    mdxHierarchy: {
                        type: "string",
                        editable: false
                    },
                    mdxHierarchyValues: {
                        type: "string",
                        editable: false
                    }
                }
            }
        },
        group: {
            field: "mdxHierarchy"
        }
    });

    var columns = [
        {
            field: "userName",
            title: "Пользователь"
        },
        {
            field: "mdxHierarchy",
            title: "Иерархия"
        },
        {
            field: "mdxHierarchyValue",
            title: "Значение"
        },
        {
            command: [
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
            width: "50px",
            hidden:isReport
        }
    ];
    
    function deleteElement(e) {
        var selectedItem = getSelectedItem(this, e);

        if (confirm("Удалить настройку?")) {
            $.ajax({
                url: basePath + "AccessRights/DeleteAccessRights",
                type: 'post',
                data: {
                    id: selectedItem.id
                },
                success: function (response) {
                    if (!response.success) {
                        showErrorAlert();
                        return;
                    }

                    kendoGrid.dataSource.read();
                },
                error: function () {
                    showErrorAlert("Ошибка при удалении настройки");
                }
            });
        }
    }

    function getSelectedItem(that, e) {
        return that.dataItem($(e.currentTarget).closest("tr"));
    }

    var gridDiv = $(grid);

    gridDiv.kendoGrid({
        dataBinding: function (e) {},
        dataSource: dataSource,
        columns: columns,
        groupable: true,
        scrollable: false,
        sortable: true,
        resizable: true,
        filterable: true
    });

   var kendoGrid = gridDiv.data('kendoGrid');

    return kendoGrid;
}

function showErrorAlert(message) {
    var displayMessage = message ? message : "При удалении/добавлении настройки произошла ошибка";

    alert(displayMessage);
}


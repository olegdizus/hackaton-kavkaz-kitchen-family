function InitAccessRigthsTree(treeDiv, role) {

    var dataSource = new kendo.data.TreeListDataSource({
        transport: {
            read: function(options) {

                $.ajax({
                    url: basePath + "AccessRights/GetModulesRigths",
                    type: 'post',
                    data: { role: role },
                    success: function(response) {
                        if (response.success) {
                            options.success(response.modules);
                        } else {
                            alert('При загрузке данных произошла ошибка');
                        }
                    },
                    error: function() {
                        alert('При загрузке данных произошла ошибка');
                    }
                });

                //var data= [
                //    { id: 1, Name: "Daryl Sweeney", Read: true, Create: true, Edit: true, Delete: true, parentId: null },
                //    { id: 2, Name: "Guy Wooten", Read: true, Create: true, Edit: true, Delete: true, parentId: 1 },
                //    { id: 32, Name: "Buffy Weber", Read: true, Create: true, Edit: true, Delete: true, parentId: 2 },
                //    { id: 11, Name: "Hyacinth Hood", Read: true, Create: true, Edit: true, Delete: true, parentId: 32 },
                //    { id: 60, Name: "Akeem Carr", Read: true, Create: true, Edit: true, Delete: true, parentId: 11 },
                //    { id: 78, Name: "Rinah Simon", Read: true, Create: true, Edit: true, Delete: true, parentId: 11 },
                //    { id: 42, Name: "Gage Daniels", Read: true, Create: true, Edit: true, Delete: true, parentId: 32 },
                //    { id: 43, Name: "Constance Vazquez", Read: true, Create: true, Edit: true, Delete: true, parentId: 32 },
                //    { id: 46, Name: "Darrel Solis", Read: true, Create: true, Edit: true, Delete: true, parentId: 43 },
                //    { id: 47, Name: "Brian Yang", Read: true, Create: true, Edit: true, Delete: true, parentId: 46 },
                //    { id: 50, Name: "Lillian Bradshaw", Read: true, Create: true, Edit: true, Delete: true, parentId: 46 },
                //    { id: 51, Name: "Christian Palmer", Read: true, Create: true, Edit: true, Delete: true, parentId: 46 },
                //    { id: 55, Name: "Summer Mosley", Read: true, Create: true, Edit: true, Delete: true, parentId: 46 },
                //    { id: 56, Name: "Barry Ayers", Read: true, Create: true, Edit: true, Delete: true, parentId: 46 },
                //    { id: 59, Name: "Keiko Espinoza", Read: true, Create: true, Edit: true, Delete: true, parentId: 46 },
                //    { id: 61, Name: "Candace Pickett", Read: true, Create: true, Edit: true, Delete: true, parentId: 46 },
                //    { id: 63, Name: "Mia Caldwell", Read: true, Create: true, Edit: true, Delete: true, parentId: 43 },
                //    { id: 65, Name: "Thomas Terry", Read: true, Create: true, Edit: true, Delete: true, parentId: 63 }
                //];

                //options.success(data);
            },
            update: function(options) {

                options.data.role = role;
                $.ajax({
                    url: basePath + "AccessRights/UpdateRigths",
                    type: 'post',
                    data: options.data,
                    success: function(response) {
                        if (response.success) {
                            options.success();
                        } else {
                            alert('При загрузке данных произошла ошибка');
                        }
                    },
                    error: function() {
                        alert('При загрузке данных произошла ошибка');
                    }
                });
            },
        },
        schema: {
            model: {
                id: "id",
                parentId:
                    "parentId",
                expanded:
                    true,
                fields:
                {
                    id: {
                        type: "number"
                    },
                    //parentId: {
                    //    type: "number"
                    //},
                    Name: {
                        type: "string",
                        editable:
                            false
                    },
                    Read: {
                        type: "bool"
                    },
                    Create: {
                        type: "bool"
                    },
                    Edit: {
                        type: "bool"
                    },
                    Delete: {
                        type: "bool"
                    }
                }
            }
        }
    });


    var columns = [
        { field: "Name", title: "Имя" },
        { field: "Read", title: "Чтение" },
        { field: "Create", title: "Создание" },
        { field: "Edit", title: "Редактирование" },
        { field: "Delete", title: "Удаление" }
    ];

    for (var i = 1; i < columns.length; i++) {
        var column = columns[i];

        var checkboxTemplate = '<input type="checkbox" #= ' + column.field + ' ? \'checked="checked"\' : "" # class="chkbx" disabled />';
        var editCheckBox = '<input type="checkbox" data-bind="checked: ' + column.field + '" #= ' + column.field + ' ? \'checked="checked"\' : "" # class="chkbx"/>';


        column.template = checkboxTemplate;
        column.editor = editCheckBox;
    }

    columns.push({
        command: [
            {
                name: "edit"
            }
        ],
        title: "",
        width: "120px"
    });

    $(treeDiv)
        .kendoTreeList({
            dataSource: dataSource,
            columns: columns
        });
}
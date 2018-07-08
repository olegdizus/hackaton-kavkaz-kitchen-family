function error_handler(e) {
    if (e.errors) {
        var message = "Errors:\n";
        $.each(e.errors, function (key, value) {
            if ('errors' in value) {
                $.each(value.errors, function () {
                    message += this + "\n";
                });
            }
        });
        alert(message);
    }
}

function DeleteConfirmed(itemId, itemName, deleteUrlAction, gridName) {
    showDeleteModal(
        itemId,
        deleteUrlAction,
        "Удалить \"" + itemName + "\" ?",
        function () {
            refreshGrid("#" + gridName);
        },
        'Удалить'
    );
}

function LayOffConfirmed(itemId, itemName, layOffUrlAction, gridName) {
    showLayOffModal(
        itemId,
        layOffUrlAction,
        "Уволить \"" + itemName + "\" ?",
        function () {
            refreshGrid("#" + gridName);
        }
    );
}


function RestoreConfirmed(itemId, itemName, restoreUrlAction, gridName) {
    showDeleteModal(
        itemId,
        restoreUrlAction,
        "Восстановить \"" + itemName + "\" ?",
        function () {
            refreshGrid("#" + gridName);
        },
        'Восстановить'
    );
}

function refreshGrid(gridSelector) {

    var grid = $(gridSelector).data("kendoGrid");

    grid.dataSource.read();
}

/*
function bindRefreshGridOnClick(clickSelector, gridSelector) {

    $(clickSelector).click(function () { refreshGrid(gridSelector); });
}*/

function refreshGridColumn(getGridOption, options, aboveRefreshFunction) {

    window.isSortWaySaved = true;

    if (aboveRefreshFunction) {
        aboveRefreshFunction();
    }

    grid.empty();
    var builder = new KendoGridBuider(getGridOption(options));

    //builder.onBuilding = options.onBuilding;
    //builder.onBuilded = options.onBuilded;

    builder.buid();
}

function getClientTemplateForSeveralItem(itemId, item1, item2,item3, controllerName) {
    var date = new Date();
    date.setTime(Date.parse(item3));

    var newItemName = item1 + " " + item2 + " " + formatDate(date);

    return getClientTemplate(itemId, newItemName, controllerName);
}

function formatDate(date) {

    var dd = date.getDate();
    if (dd < 10) dd = '0' + dd;

    var mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;

    var yy = date.getFullYear() % 100;
    if (yy < 10) yy = '0' + yy;

    return dd + '.' + mm + '.' + yy;
}

function getClientTemplate(itemId, itemName, controllerName) {
    return "<a id=\"editImgButton\" class=\"k-button k-button-icontext k-grid-view\" href=\""
        + basePath + controllerName + "/Info/" + itemId  + "\">"
        + "<span class=\"fa fa-file-text-o fa-lg\"></span>"
        + "</a>"
        + "<a id=\"detailImgButton\"  class=\"k-button k-button-icontext k-grid-edit\" href=\"" 
        + basePath + controllerName + "/Edit/" + itemId + "\">"
        + "<span class=\"fa fa-edit fa-lg\"></span>"
        + "</a>"
        + "<a id=\"deleteImgButton\" onclick=\"DeleteConfirmed("+itemId+","
        + "'"  + itemName + "',"
        + "'" + basePath + controllerName + "/Delete/" + itemId + "',"
        + "'Grid');\""
        + " class=\"k-button k-button-icontext my-delete-button k-grid-mydelete\"" + "\">"
        + "<span class=\"fa fa-trash fa-lg\"></span>"
        + "</a>";
}

function getClientRestoreDeleteTemplate(itemId,itemName,endDate, controllerName) {

    if (endDate != null)
    {
        var restore =
                "<a id=\"restoreImgButton\" onclick=\"RestoreConfirmed(" + itemId + ","
                + "'" + itemName + "',"
                + "'" + basePath + controllerName + "/Restore/" + itemId + "',"
                + "'Grid');\""
                + " class=\"k-button k-button-icontext k-grid-view\">"
               + "<span class=\"fa fa-arrow-up fa-lg\"></span>"
               + "</a>";
    };

     if (endDate == null)
     {
        var restore=
                "<a id=\"deleteImgButton\" onclick=\"LayOffConfirmed(" + itemId + ","
                + "'" + itemName + "',"
                + "'" + basePath + controllerName + "/Delete/" + itemId + "',"
                + "'Grid');\""
                + " class=\"k-button k-button-icontext my-delete-button k-grid-mydelete\"" + "\">"
                + "<span class=\"fa fa-trash fa-lg\"></span>"
                + "</a>";
    };

   

    var result = "<a id=\"editImgButton\" class=\"k-button k-button-icontext k-grid-view\" href=\""
            + basePath + controllerName + "/Info/" + itemId + "\">"
            + "<span class=\"fa fa-file-text-o fa-lg\"></span>"
            + "</a>"
            + "<a id=\"detailImgButton\"  class=\"k-button k-button-icontext k-grid-edit\" href=\""
            + basePath + controllerName + "/Edit/" + itemId + "\">"
            + "<span class=\"fa fa-edit fa-lg\"></span>"
            + "</a>"
            + restore;

    return result;
}

function getClientTemplateEditDelete(itemId, itemName, controllerName, canEdit) {
  
    var editButtons = "<a id=\"editImgButton\" class=\"k-button k-button-icontext my-edit-button k-grid-myedit\" href=\""
        + basePath + controllerName + "/Edit/" + itemId + "\">"
        + "<span class=\"fa fa-edit fa-lg\"></span>"
        + "</a>"
        + "<a id=\"deleteImgButton\" class=\"k-button k-button-icontext my-delete-button k-grid-mydelete\" href=\""
        + basePath + controllerName + "/Delete/" + itemId + "\">"
        + "<span class=\"fa fa-trash fa-lg\"></span>"
        + "</a>";

    var result = "<a id=\"editImgButton\" class=\"k-button k-button-icontext k-grid-view\" href=\""
        + basePath + controllerName + "/Info/" + itemId + "\">"
        + "<span class=\"fa fa-file-text-o fa-lg\"></span>"
        + "</a>";

    if (canEdit==true) {
        result += editButtons;
    }

    return result;
}


function getLink(item) {

    var link = basePath + "/Temp/Excel/Reports/" + item;


    return "<a id='fileNameLink' href=" + link + ">"
        + item
        + "</a>";
}
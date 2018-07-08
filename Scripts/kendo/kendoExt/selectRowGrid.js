//написано для страницы Tasks, можно обобщить, чтобы использовать на разных гридах 
//включено в bundle kendoTasks

var taskIdFromRequest = "";

var firstcall = true;

GetIdFromRequest();

function GetIdFromRequest() {
    var request_param = location.search;

    taskIdFromRequest = request_param.match(/[^=]*$/);
}

function SelectTaskFromRequest() {
    if (taskIdFromRequest != "") {
        var intTaskId = parseInt(taskIdFromRequest[0]);

        SelectTask(intTaskId, GoToTaskPage);
    }
};

function SelectTask(intTaskId, callback) {
        $.ajax({
        url: basePath + 'Tasks/GetIndexOfArray',
        type: 'GET',
        data: {
            id: intTaskId,
            filters: $('#taskFilters').val()
        },
        success: function(data) {

            callback(data);

            ShowTaskPosts(intTaskId);

            setTimeout(function() {
                kendoGridSetSelectedRow(intTaskId);
            }, 500);
        }
    });
}

function GoToTaskPage(data) {
    var index = data;

    var dataSource = $("#Grid").data("kendoGrid").dataSource;

    var page_size = dataSource.pageSize();

    var page_number = Math.floor(index / page_size + 1);

    dataSource.page(page_number);
}

function ShowTaskPosts(intTaskId) {
    $.ajax({
        url: basePath + 'Tasks/GetTaskPosts',
        type: 'POST',
        data: {
            task_id: intTaskId
        },
        success: function (data) {
            initTaskTapeFromData(data);
        }
    });
}
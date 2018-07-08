function kendoGridRowClick() {
    var taskId = kendoGrid.getSeletedTaskId();

    getTaskPostsFromServer(taskId);
}

var pageChange = true;

var kendoGrid = {
    getSeletedTaskId: function () {
        var grid = $('#Grid');
        var selectedRow = $('tr.k-state-selected', grid);

        var taskId = $('span[data-task-id]', selectedRow).data('taskId');

        return taskId;
    },

    resetTask: function () {
        var grid = $('#Grid');
        var selectedRow = $('tr.k-state-selected', grid);

        selectedRow.removeClass('k-state-selected');
    },

    onDataBound: function (handler) {
        var grid = getGrid();
        grid.unbind("dataBound");
        grid.bind("dataBound", handler);
    },

    onDataBinding: function (handler) {
        var grid = getGrid();
        grid.unbind("dataBinding");
        grid.bind("dataBinding", handler);
    },

    unBindDataBoundEvent: function () {
        var grid = getGrid();
        grid.unbind("dataBound");
    },

    goToLastPage: function () {
        var dataSource = getGrid().dataSource;

        var totalPages = dataSource.totalPages();

        dataSource.page(totalPages);
    },

};

function getGrid() {
    return $('#Grid').data('kendoGrid');
}

function kendoGridSetSelectedRow(task_id) {
    var kendoGridRow = $('span[data-task-id=' + task_id + ']').parents('#Grid tr');

    kendoGridRow.addClass('k-state-selected');
}

function getFiltersConfiguration() {
    return getConfiguration();
}

function kendoGridPagind() {
    clearTaskPostsTape();
}

function initPageChangeHandler() {
    var grid = getGrid();
    var pager = grid.pager;

    if (firstcall) {
        SelectTaskFromRequest();
        firstcall = false;
    }

    pager.unbind('change');
    pager.bind('change', kendoGridPagind);
}
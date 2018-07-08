function InitKendoGrid() {
    //TODO: добавить футер в кендо

    $("#grid").kendoGrid({
        sortable: {
            mode: "single",
            allowUnsort: false
        },
        columns: [
        {
            field: "isChecked",
            title: "Учитывать",
            template: '<input type="checkbox" #= isChecked ? \'checked="checked"\' : "" # class="chkbx" />', width: 110
        },
        {
            field: "label",
            title: $("#labelsList option:selected").text()
        },
        {
            field: "y",
            title: ($('#isLastPeriod').prop('checked') ? "Рост (" : "") + $("#yDimensionsList option:selected").text() + ($('#isLastPeriod').prop('checked') ? ") %" : ""),
            format: "{0:n0}"
        },
        {
            field: "x",
            title: $("#xDimensionsList option:selected").text(),
            format: "{0:n0}"
        }],
        dataSource: {
            data: data
        }
    });

    $("#grid .k-grid-content").on("change", "input.chkbx", function (e) {
        var grid = $("#grid").data("kendoGrid"),
            dataItem = grid.dataItem($(e.target).closest("tr"));

        dataItem.set("isChecked", this.checked);

        if (this.checked) {
            ndx.add([dataItem]);
        } else {
            idDim.filter(function (d) { return d == dataItem.id; });
            ndx.remove();
        }

        updateTotalFooter(dataItem, this.checked);

        redrawChart();
    });
}

function updateKendoGrid() {
    $("#grid th[data-field=label]").html($("#labelsList option:selected").text());
    $("#grid th[data-field=y]").html(($('#isLastPeriod').prop('checked') ? "Рост (" : "")
        + $("#yDimensionsList option:selected").text() + ($('#isLastPeriod').prop('checked') ? ") %" : ""));
    $("#grid th[data-field=x]").html($("#xDimensionsList option:selected").text());

    var dataSource = new kendo.data.DataSource({
        data: data
    });

    var grid = $("#grid").data("kendoGrid");
    grid.setDataSource(dataSource);

    $('#totalItems').html(data.length);
}

function updateTotalFooter(item, isChecked) {

    var totalHidden = parseInt($('#totalHidden').html()) + (isChecked ? -1 : 1);
    var totalSum = parseInt($('#totalSum').html().replace(/&nbsp;/g, '')) + (isChecked ? -1 * item.x : item.x);
    //    var totalPercent = parseInt($('#totalPercent').html().replace(/&nbsp;/g, '')) + (isChecked ? -1 * item.y : item.y);

    $('#totalHidden').html(totalHidden.toLocaleString());
    $('#totalSum').html(totalSum.toLocaleString());
    //    $('#totalPercent').html(totalPercent.toLocaleString());
}

function ClearTotalFooter() {
    $('#totalHidden').html(0);
    $('#totalSum').html(0);
    //    $('#totalPercent').html(0);
}

function KendoGridBuider(option) {
    this.gridOption = option;
}



KendoGridBuider.prototype = {
    buid: function () {

        var self = this;

        if (this.gridOption.loadHierarchyAndBuid) {
            this.gridOption
                .loadHierarchyAndBuid(getKendogridConfig);
        } else {
            getKendogridConfig(null);
        }

        function getKendogridConfig(contacts) {

            var gridCofiguration = {
                columns: self.getColumns(self.gridOption),
                dataSource: self.gridOption.getDataSource(contacts),

                toolbar: ["excel"],
                excel: {
                    allPages: true,
                    fileName: "Отчет.xlsx",
                    filterable: false
                },

                excelExport: function (e) {
                    var columns = e.workbook.sheets[0].columns;
                    for (var i = 0; i < columns.length; i++) {
                        columns[i].width = Number.NaN;
                    }

                    var rows = e.workbook.sheets[0].rows;

                    for (var ri = 0; ri < rows.length; ri++) {
                        var row = rows[ri];

                        for (var ci = 0; ci < row.cells.length; ci++) {
                            var cell = row.cells[ci];
                            if (jQuery.isNumeric(cell.value)) {
                                // Use jQuery.fn.text to remove the HTML and get only the text
                                // cell.value = $(cell.value).text();
                                // Set the alignment
                                cell.hAlign = "right";
                            } else {
                                if (typeof (cell.value) == 'string') {

                                } else {
                                    cell.value = $(cell.value).text();
                                }
                            }
                        }
                    }
                },

                dataBound:
                    function (e) {
                        var oldData = e.sender.dataSource.oldData;

                        if (oldData == undefined
                            || oldData === false) {
                            self.onDataBound(e);
                        }
                        
                    },
                dataBinding: function (e) {
                    var oldData = e.sender.dataSource.oldData;

                    if (oldData == undefined
                        || oldData === true) {
                        self.onDataBinding(e);
                    }

                    

                },
                detailInit: self.gridOption.createDetailsGrid
                    ? self.getDetailInitFunc(
                        self.gridOption.createDetailsGrid)
                    : null,

                autoBind: false,
                sortable: true,
                scrollable: false,
                groupable: false,
                afterDataBound: self.gridOption.afterDataBound
            };

            self.buidGrid(gridCofiguration);
        }
    },


    getColumns: function () {

        KendoPlugins.initGroupHeaderNames(this.gridOption.columns);

        return this.gridOption.columns;
    },

    buidGrid: function (gridConfiguration) {

        if (this.gridOption.onBuilding) {
            this.gridOption.onBuilding(gridConfiguration);
        }

        var grid = this.gridOption.gridDiv
            .kendoGrid(gridConfiguration);

        var parentKendo =
               this.gridOption.gridDiv
               .parents('table')
               .first()
               .parent()
               .data('kendoGrid');

        grid.data('kendoGrid').firstHierarchy = parentKendo ? !parentKendo.firstHierarchy : true;


        if (this.gridOption.onBuilded) {
            this.gridOption.onBuilded(this.gridOption.gridDiv);

        } else {
            this.gridOption.gridDiv.data('kendoGrid')
                .dataSource
                .read();
        }
    },
    getDetailInitFunc: function (createDetailsGrid) {

        var self = this;

        return function (e) {

            var childGrid = $("<div/>")
                .appendTo(e.detailCell);
            var detailCell = $(e.detailCell);

            var groupCells = detailCell.parent().children('td.k-group-cell');//,td.k-hierarchy-cell

            detailCell.attr('colspan', parseInt(detailCell.attr('colspan')) + groupCells.length);

            groupCells.remove();

            createDetailsGrid(childGrid, e);
        }
    },
    
    onDataBound: function (e) {
        var grid = e.sender.element;

        KendoPlugins.setGroupHead(grid);
        KendoPlugins.collapseAllGroups(grid);

        if (e.sender.options.afterDataBound) {
            e.sender.options.afterDataBound(e);

            if (window.isSortWaySaved
                && window.ReportGridSortField) {
                window.isSortWaySaved = false;
                for (var column in e.sender.columns) {
                    if (e.sender.columns[column].field == window.ReportGridSortField.field) {
                        e.sender.dataSource.sort(
                        {
                            field: window.ReportGridSortField.field,
                            dir: window.ReportGridSortField.dir
                        });
                        break;
                    }
                }

            }
        }
    },

    onDataBinding: function (e) {
        var grid = e.sender.element;
        var kendo = $(grid).data("kendoGrid");
        var dataSource = kendo.dataSource;

        if (dataSource._group
            && dataSource._group.length > 0) {

            //dataSource._filter = dataSource._filter || [];

            //  dataSource._filter.push(dataSource.GetFilters());
            var view = dataSource._view;

            KendoPlugins.callCustomAggregates(view, kendo.columns);
        }

        KendoPlugins.showMasterItems(grid);
        KendoPlugins.sortGroupByAggregatesValue(grid);
    }
}




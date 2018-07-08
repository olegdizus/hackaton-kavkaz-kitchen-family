
function UniqueUnionObject(a, b) {

    if (!a)
        return b;
    if (!b)
        return a;

    var c = a;
    for (var propertyName in b) {

        if (!(propertyName in a))
            c[propertyName] = b[propertyName];
    }

    return c;
}



function FindByField(arWithField, field) {
    for (var i = 0; i < arWithField.length; i++) {
        if (arWithField[i].field == field) {
            return i;
        }
    }

    return -1;
}

var KendoPlugins = new function () {

    var self = this;

    function attachBefore(grindName, callback) {
        attachPlugin(grindName, callback, function () { });
    }

    function attachAfter(grindName, callback) {
        attachPlugin(grindName, function () { }, callback);
    }

    function attachPlugin(gridName, beforeCallback, afterCallback) {
        var jqProto = $(gridName).__proto__;

        var oldKendoGrid = jqProto.kendoGrid;

        jqProto.kendoGrid = function (options) {

            beforeCallback(options);

            var kendoGrid = oldKendoGrid.call(this, options);

            afterCallback(options);

            return kendoGrid;
        };
    }

    this.attach = function (gridName, plugin) {
        plugin(gridName);
    };

    this.DebitoreExpiredPeriod = function (debitoreExpiredManager) {

        return function (gridName) {


            attachAfter(gridName, function () {

                if (debitoreExpiredManager) {
                    debitoreExpiredManager.initExpires();
                }
            });
        }

        
    }

    this.UserSettings = function(settingManager) {
        //todo: не работает с дочерними гридами. Вызывает перерисовку всех гридов на странице
        //todo: подумать как применить UserSettings до создания грида
        return function(gridName) {

            
            attachAfter(gridName, function () {

                if (settingManager) {
                    settingManager.initColumns();
                }
            });
        }
    }

    

    this.addTotalRowFromJson = function (gridName) {
        attachBefore(gridName, function (options) {
            var columns = options.columns;

            //var colorColumns = [];

            //for (var j = 0; j < columns.length; j++) {

            //    var column = columns[j];

            //    if (column.setRowColor == true) {
            //        var newColumn = {
            //            field: column.field,
            //            footerValue: getFooterTemplate(column)
            //        };
            //        colorColumns.push(newColumn);
            //    }
            //}

            for (var i = 0; i < columns.length; i++) {
                var column = columns[i];
                if (!column.isGroup &&! column.footerTemplate) {
                    column.footerTemplate = getFooterTemplate(column);
                }
            }
        });

        function getFooterTemplate(column) {
            return function () {
                var dataSource = $(gridName).data('kendoGrid').dataSource;
                var totalRow = dataSource.All;

                if (totalRow) {
                    var total = totalRow.aggregates[column.field];
                    if (total && dataSource._aggregateResult[column.field]) {
                        dataSource._aggregateResult[column.field].sum = total.sum;

                        return round(total.sum);
                    }
                }
                return '';
            };
        }

    }

    var colors = [
        "#f8696b",
        "#f8766d",
        "#f98370",
        "#fa9072",
        "#fa9d75",
        "#fbaa77",
        "#fcb77a",
        "#fcc47c",
        "#fdd17f",
        "#fede81",
        "#f0e784",
        "#A9A2A2",
        "#e7d971",
        "#e0e383",
        "#d1de82",
        "#c1da7e",
        "#b1d580",
        "#a2d07f",
        "#83c77d",
        "#92cc7e",
        "#73c37c",
        "#63be7b"
    ];

    var setColorValueTemplate = function (column, template) {

        if (template) {
            return function (data) {
                var templateFunc = getTemplateFunction(template);

                var value = templateFunc(data);

                return wrapToColor(value, data.parentItem, column.field);
            };
        } else {
            return function (data) {
                var format = column.customFormat == 'currency' ? 'n0' : 'n';

                var value = kendo.toString(data[column.field], format);

                return wrapToColor(value, data.parentItem, column.field);
            }
        }
    };

    function wrapToColor(value, parentItem, field) {
        var intValue = typeof (value) == "string" ? Number(value.replace(/\s+/g, '').replace(',', '.')) : value;

        intValue = Math.round(intValue);

        var minValue = Math.round(parentItem.aggregates[field].minGroup);
        var maxValue = Math.round(parentItem.aggregates[field].maxGroup);

        var percente = getColorIndex(intValue, maxValue, minValue, colors.length - 1);

        var color = colors[percente];
        return "<div class='collored-grid-column' style='background:" + color + "'>" + value + "</div>";
    }

    function getPercentIndex(value, maxValue, minValue, scale) {

        if (maxValue == minValue) {
            return -1;
        }
        var tmp = Math.floor(((value - minValue) / (maxValue - minValue)) * scale);
       // if (tmp >= 50) tmp = tmp + 1;
        return tmp;
    }

    function getColorIndex(value, maxValue, minValue, scale) {

        scale -= 1;
        if (maxValue == minValue) {
            return 11;
        }
        var tmp= Math.floor(((value - minValue) / (maxValue - minValue)) * scale);
        if (tmp >= 11) tmp +=1;
        return tmp;
    }

    this.GroupsManage = function (gridSelector, kspiPlans) {

        var kendo = $(gridSelector).data('kendoGrid');

        var addDataBound = function(e) {
            var grid = e.sender.element;

            KendoPlugins.setGroupHead(grid);

            KendoPlugins.collapseAllGroups(grid);
        };

        kendo.bind("dataBound", addDataBound);

        var addDataBinding = function(e) {
            var grid = e.sender.element;

            KendoPlugins.sortGroupByAggregatesValue(grid);
        }

        var addDataBindingKspi = function (e) {
            if (e.action === "sync") {
                e.preventDefault();

                var grid = $('#grid').data('kendoGrid');

                var dataItem = grid.dataItem(grid.tbody.find("tr[data-role='editable']"));

                var sum = sumPlan(grid, dataItem.groupName);

                $(".k-footer-template > td:nth-child(5)").html(sum);

                var span = grid.tbody.find("span[groupid='" + dataItem.groupName + "']");

                var agregateTd = span.parents("tr").find(":nth-child(4)");

                agregateTd.text(getLocaleString(sum));

                sum = sumPlan(grid);

                $(".k-footer-template > td:nth-child(5)").html(getLocaleString(sum));

                var cancelBtn = grid.tbody.find(".k-grid-cancel");

                cancelBtn.click();
            }
        };

        if (kspiPlans) {
            kendo.bind("dataBinding", addDataBindingKspi);
        } else {
            kendo.bind("dataBinding", addDataBinding);
        }
        
    }

    function getLocaleString(value) {
        var localeString;

        try {
            localeString = value.toLocaleString();
        } catch (e) {
            localeString = value;
        }

        return localeString;
    }


    function sumPlan(grid, groupField) {
        var data = grid.dataSource.data();
        var total = 0;

        for (var i = 0; i < data.length; i++) {
            if (groupField && data[i].groupName != groupField) {
                continue;
            }
            var plan = parseFloat(data[i].plan);

            if (plan == NaN) {
                plan = 0;
            }

            total = total + plan;
        }

        return total;
    }

    var setValueColorToNumbers = function (columns) {
        for (var i = 0; i < columns.length; i++) {

            var column = columns[i];

            if (!column.customFormat) {
                continue;
            }

            column.template = setColorValueTemplate(column, column.template);

            var groupFieldTemplate = column.groupFieldTemplate;

            if (groupFieldTemplate) {
                column.groupFieldTemplate = setColorValueTemplate(column, groupFieldTemplate);
            }
        }
    }

    this.setValueColorToNumbers = function (gridName) {
        attachBefore(gridName, function (options) {
            setValueColorToNumbers(options.columns);
        });
    }

    this.setColumnToLink = function(gridName) {
        attachBefore(gridName,
            function(options) {

                var columns = options.columns;


                for (var i = 0; i < columns.length; i++) {

                    var column = columns[i];

                    //TODO: костыль. Переработать. Избавлялись от повторного применения шаблона к одному и томуже стобцу (рекурсия)
                    if (column.setColumnToLink)
                        continue;

                    column.setColumnToLink = true;

                    if (column.field == "Contact_name") {


                        column.template = function() {

                        };

                        column.groupFieldTemplate = function() {

                        };
                    }
                }
            });
    }


    //TODO: выделить плагин раскраски в отдельный файл
    this.setRowValueColorToNumbers = function (gridName) {
        attachBefore(gridName, function(options) {

            var columns = options.columns;

            var coloredColumns = [];

            for (var i = 0; i < columns.length; i++) {

                var column = columns[i];

                if (column.setRowColor == true) {
                    coloredColumns.push(column);
                }
            }

            var dataSource = options.dataSource;

            dataSource.coloredColumns = coloredColumns;

            //var detailRowValuesFromData = getDetailRowValuesFromData(coloredColumns);
            var groupRowValuesFromData = getGroupRowValuesFromData(coloredColumns);
            var footerRowValuesFromData = getFooterRowValuesFromData(coloredColumns);

            var prevParseResponse = dataSource.parseReponse;

            dataSource.parseReponse = function(data) {

                if (prevParseResponse)
                    prevParseResponse(data);

                for (var i = 0; i < data.length; i++) {
                    var row = data[i];

                    if (row.hasSubgroups == "true") {

                        var rowValues = groupRowValuesFromData(row);

                        var rowMinMaxValues = getMinMaxValueInRow(row, rowValues);

                        for (var j = 0; j < rowValues.length; j++) {
                            var rowValue = rowValues[j];
                            var colorIndex = getColorIndex(rowValue.value, rowMinMaxValues.rowMaxValue, rowMinMaxValues.rowMinValue, colors.length - 1);

                            var columnName = 'pr' + rowValue.field;
                            row.aggregates[columnName] = { sum: colorIndex, title: columnName };
                            dataSource._aggregate.push({ aggregate: "sum", field: columnName });
                        }

                    } else {

                    }
                }
            };

            //TODO: поменять шаблон отображения.
            for (i = 0; i < coloredColumns.length; i++) {
                var coloredColumn = coloredColumns[i];

                //TODO: костыль. Переработать. Избавлялись от повторного применения шаблона к одному и томуже стобцу (рекурсия)
                if (coloredColumn.setColorTemplate)
                    continue;

                coloredColumn.setColorTemplate = true;

                coloredColumn.orderColumn = 'pr' + coloredColumn.field;

                coloredColumn.template = getSimpleCellTemplate(
                    coloredColumn.template,
                    coloredColumn.field,
                    function(data, field) {
                        return data[field];
                    });

                coloredColumn.groupFieldTemplate = getSimpleCellTemplate(
                    coloredColumn.groupFieldTemplate,
                    coloredColumn.field,
                    function (data, field) {

                        return data.aggregates[field].sum;
                    });

                coloredColumn.footerTemplate = getCellTemplate(
                    coloredColumn.footerTemplate,
                    coloredColumn.field,
                    footerRowValuesFromData);
            }
        });
    }

    function getDetailRowValuesFromData(columns) {
        return function(data) {
            var newData = [];

            for (var i = 0; i < columns.length; i++) {
                var rowValue = {
                    field: columns[i].field,
                    value: data[columns[i].field]
                };

                newData.push(rowValue);
            }

            return newData;
        }
    }

    function getGroupRowValuesFromData(columns) {
        return function (data) {
            var newData = [];

            for (var i = 0; i < columns.length; i++) {
        
                var rowValue = {
                    field: columns[i].field,
                    value: data.aggregates[columns[i].field].sum
                };

                newData.push(rowValue);
            }

            return newData;
        }
    }


    function SetGridOnSmsClickEvent(gridSelector) {

        console.log("SetGridOnSmsClickEvent");

        console.log($(gridSelector));


        $(gridSelector)
            .on(
                'click',
                '.smscheckbox',
                function () {

                    var checked = this.checked;
                    var row = $(this).closest("tr");

                    if (checked) {
                        row.addClass("k-state-selected");

                    } else {
                        row.removeClass("k-state-selected");
                    }
                });
    }

    this.SmsSendingPlugin = function (contactIdField) {
        return function (gridName) {


            //var grid = $(gridName).data('kendoGrid');
            //grid.thead.push("SMS");

            function SmsSending(options) {
                {
                    options.groupable = false;

                    var oldDataBound = options.dataBound;
                    options.dataBound = function (arg) {
                        if (oldDataBound) {
                            oldDataBound(arg);
                        }

                        SetGridOnSmsClickEvent(gridName);
                    };

                    var columns = options.columns;

                    var selectColumn = {
                        field: "sms",
                        title: "СМС",
                        template: "<center><input type='checkbox' class='smscheckbox'/></center>",
                        hidden: true,
                        name: "sms"
                    };

                    options.mutltyselectable = true;

                    columns.push(selectColumn);
                    options.groupable = true;
                }
            }

            attachBefore(gridName,
                SmsSending,
                function (options) {

                    //var grid = $(gridName).data('kendoGrid');



                    //var smsControl =
                    new SmsControl(gridName, contactIdField);
                });
        }
    }

    function getFooterRowValuesFromData(columns) {
        return function (data) {
            var newData = [];

            var totalRow = $(gridName).data('kendoGrid').dataSource.All;

            for (var i = 0; i < columns.length; i++) {
                var value = (totalRow == undefined ? data[columns[i].field].sum : totalRow.aggregates[columns[i].field].sum);

                var rowValue = {
                    field: columns[i].field,
                    value: value
                };

                newData.push(rowValue);
            }
            return newData;
        }
    }

    function getTemplateFunction(template) {
        return typeof (template) == 'function'
            ? template
            : kendo.template(template);
    }

    function getCellValue(rowValues, field) {
        for (var i = 0; i < rowValues.length; i++) {
            if (rowValues[i].field == field) {
                return rowValues[i].value;
            }
        }

        return undefined;
    }

    var getCellTemplate = function (template, field, getCellValues) {

        return function (data) {

            var templateValue = template ? getTemplateFunction(template)(data) : undefined;

            var rowValues = data.rowValues;
            if (!rowValues) {
                data.rowValues = rowValues = getCellValues(data);
                data.minMaxValues = getMinMaxValueInRow(data, rowValues);

                ///TODO: вычислять проценты
            }



            var cellValue = getCellValue(rowValues, field);

            return colorCellTemplate(
            {
                value: cellValue,
                minValue: data.minMaxValues.rowMinValue,
                maxValue: data.minMaxValues.rowMaxValue,
                colorsArray: colors
            }, templateValue);
        }
    }

    var getSimpleCellTemplate = function (template, field, getCellData) {

        return function (data) {

            var templateValue = template ? getTemplateFunction(template)(data) : undefined;

            var cellValue = getCellData(data, field);
            var colorIndex = getCellData(data, 'pr' + field);

            return simpleColorCellTemplate(
            {
                value: cellValue,
                colorIndex: colorIndex,
                colorsArray: colors
            }, templateValue);
        }
    }

    var minMaxValues = {};
    var rowData = {};

    function getMinMaxValueInRow(data, columns) {

        if (columns.length == 0) {
            return {
                rowMinValue: 0,
                rowMaxValue: 0
            };
        }

        if (rowData == data) {
            return minMaxValues;
        }

        var min = columns[0].value;

        var max = min;

        for (var i = 1; i < columns.length; i++) {

            var rowalue = columns[i].value;

            if (min > rowalue) {
                min = rowalue;
            }

            if (max < rowalue) {
                max = rowalue;
            }
        }

        var values = {
            rowMinValue: min,
            rowMaxValue: max
        };

        minMaxValues = values;
        rowData = data;

        return values;
    }

    function colorCellTemplate(data, template) {

        var colorIndex = getColorIndex(data.value, data.maxValue, data.minValue, colors.length-1);
       // var color = colorIndex == 11 ? "#A9A2A2" : data.colorsArray[colorIndex];
       var color = data.colorsArray[colorIndex];
        var percent = getPercentIndex(data.value, data.maxValue, data.minValue, 101);
        data.percent = percent;

        return "<div class='collored-grid-column' style='background:" + color + "'>" + (template == undefined ? data.value : template) + "</div>";

    }

    function simpleColorCellTemplate(data, template) {

      //  var colorIndex = getColorIndex(data.value, data.maxValue, data.minValue, colors.length - 1);
        // var color = data.colorIndex == -1 ? "#A9A2A2" : data.colorsArray[data.colorIndex];
        var color = data.colorsArray[data.colorIndex];
        return "<div class='collored-grid-column' style='background:" + color + ";padding:8px;'>" + (template == undefined ? data.value : template) + "</div>";

    }



    this.additionalData = function (additionalDataGetter) {
        return function (gridName) {
            attachBefore(gridName, function (options) {
                var dataSource = options.dataSource;

                var oldGetFilters = dataSource.GetFilters;

                dataSource.GetFilters = function (item) {
                    var additFilters = additionalDataGetter();

                    var gridData = oldGetFilters.call(dataSource, item);

                    var resultObject = UniqueUnionObject(gridData, additFilters);

                    return resultObject;
                }
            });
        }
    }

    this.parseResponse = function (parseCallback) {
        return function (gridName) {
            attachBefore(gridName, function (options) {
                options.dataSource.parseReponse = parseCallback;
            });
        }
    }

    this.partialRender = function (grid) {
        var kendoGrid2 = grid.data('kendoGrid');
        var kendoProto = kendoGrid2.__proto__;

        //kendo.ExcelExporter.fn.init =
        //  function (n) {

        //      n.columns = this._trimColumns(n.columns || []),
        //          this.allColumns = e.map(this._leafColumns(n.columns || []), this._prepareColumn),
        //          this.columns = e.grep(this.allColumns, function(e) {
        //              return !e.hidden;
        //          }),
        //          this.options = n,
        //          this.dataSource = n.dataSource;

        //  };

        kendo.ExcelExporter.fn.workbook = function () {
            this.dataSource = kendoGrid2.dataSource;
            this.isDetails = kendoGrid2._events.detailInit ? 1 : 0;

            return $.Deferred($.proxy(function(t) {
                
                    var e = {
                        sheets: [
                            {
                                columns: this._columns(),
                                rows: this._rows(),
                               
                                freezePane: this._freezePane(),
                                filter: this._filter()
                            }
                        ]
                    };

                    t.resolve(e, this.dataSource.view());
              
            }, this)).promise();
        };


        kendo.ExcelExporter.fn._rows= function() {
            var headRows = [];

            if (this.columns.length)
                this._prependHeaderRows(headRows);

            var groupCount = this.dataSource._group.length + this.isDetails;

            var dataRows = $('tr:visible', grid)
                .map(
                    function(trInd, tr) {
                        if (trInd <= 1)
                            return;

                        var tds = $(tr).children('td');

                        var tdValues = tds
                            .map(
                                function (tdInd, td) {
                                    var jTd = $(td);

                                    var colspan = jTd.attr('colspan');

                                    var retArray = new Array(parseInt(colspan?(colspan-groupCount) : 1));

                                    var cellText = jTd.text();
                                    retArray[0] = colspan ? cellText : parseFloat(cellText.replace(/[  ]/g, "").replace(",", "."));

                                    return retArray;
                                }).toArray();

                        var cells = tdValues.map(function(el, ind) {

                            return { "value": el || "" };
                        });

                        return {
                            "type": "data",
                            "cells": cells
                        };
                    });

            headRows[0].cells = headRows[0].cells.slice(groupCount - this.isDetails);

            return headRows.concat(dataRows.toArray());
        }


        var oldDataItem = kendoProto.dataItem;

        kendoProto.dataItem = function (row) {

            if ($(row).hasClass('k-grouping-row')) {
                var firstTd = $('td[groupindex]', row).first();

                return KendoPlugins.GetKendoItem(this, firstTd);
            }

            return oldDataItem.call(this, row);
        }

        function n(e) {
            return Array(e + 1).join('<td class="k-group-cell">&nbsp;</td>');
        }

        function P(e, t, i) {
            return '<tr class="k-grouping-row">' + n(t) + '<td colspan="' + e + '" aria-expanded="true"><p class="k-reset"><a class="k-icon k-i-collapse" href="#" tabindex="-1"></a>' + i + "</p></td></tr>";
        }

        function R(e) {
            return '<tr class="k-grouping-row"><td colspan="' + e + '" aria-expanded="true"><p class="k-reset">&nbsp;</p></td></tr>';
        }

       
        kendoProto.partialRender = function (e, t, n, level) {
            var i,
                r,
                o = this,
                s = "",
                l = null != o.lockedContent,
                d = {
                    rowTemplate: o.rowTemplate,
                    altRowTemplate: o.altRowTemplate,
                    groupFooterTemplate: o.groupFooterTemplate
                };
            if (t = l ? t - g(o.columns).length : t,
                n > 0) {

                for (t = l ? t - n : t,
                    o.detailTemplate && t++,
                    o.groupFooterTemplate && (o._groupAggregatesDefaultObject = a(o.dataSource.aggregate())),
                    i = 0,
                    r = e.length; r > i; i++) {
                    s += o._groupRowHtml(e[i], t, level, l ? R : P, d, l);
                }
            } else {
                s += o._rowsHtml(e, d);
            }

            return s;
        };


        kendoProto._partialRender = function (grid, afterTr, item) {
            var groups = grid.dataSource._group;

            var countNotHiddenColumn = 0;
            for (var i = 0; i < grid.columns.length; i++) {
                if (!grid.columns[i].hidden) {
                    countNotHiddenColumn++;
                }
            }

            var firstTd = $('td[groupindex]', afterTr).first();
            var groupIndex = eval("[" + firstTd.attr("groupindex") + "]");

            //  debugger;
            var isElementary = groups.length <= item.level + 1;

            if (isElementary
                && grid.dataSource.parseElementaryItem) {

                grid.dataSource.parseElementaryItem(item.items);
            }

            var addRowsHtml = grid.partialRender(
                item.items,
                groups.length + countNotHiddenColumn,
                !isElementary ? groups.length : 0,
                item.level + 1);

            afterTr.after(addRowsHtml);
            var trContainer = $(afterTr).nextAll("*:lt(" + item.items.length + ")");

            if (!isElementary) {
                KendoPlugins.setGroupHeadToTr(grid, trContainer, groupIndex, item.level + 1);

                KendoPlugins.collapseAllGroupsItItems(trContainer, grid);
                KendoPlugins.SetExpandClickWithLoadChild(grid, $('td[aria-expanded]', trContainer));
            }

            //TODO: сделать опционально. Чтобы в некоторых отчетах детали открывались
            $('td.k-hierarchy-cell a').hide();
        };

        
    };

    function HideShow(eShow, eHide) {
        if (eShow)
            eShow.addClass("k-i-expand").removeClass("k-i-collapse")
                .addClass("k-plus").removeClass("k-minus");

        if (eHide)
            eHide.addClass("k-i-collapse").removeClass("k-i-expand")
                .addClass("k-minus").removeClass("k-plus");
    }

    this.SecondaryHierarchy = function (t) {

        if (t.options.scrollable && t._hasDetails() && p(t.columns).length)
            throw Error("Having both detail template and locked columns is not supported");

        var oldGroupableHandler = t._groupableClickHandler;
        t.table.off("click.kendoGrid", t._groupableClickHandler);
        t._groupableClickHandler = function (n) {

            var i,
                r,
                o = $(this),
                isOpenClick = o.hasClass("k-i-expand"),
                s = o.closest("tr.k-master-row"),
                l = t.detailTemplate,
                d = t._hasDetails(),
                sc = o.hasClass('second') || o.parent().hasClass('second');

            if (o.hasClass('k-i-expand')) {
                t.collapseGroup(o.closest('tr'));
            }
            //TODO: сделать свое открытие по частям
            if (sc || o.hasClass('.k-hierarchy-cell')) {


                var next = s.next();

                if (d && !(next.hasClass("k-detail-row") && next.attr('second') == sc + '')) {

                    if (next.hasClass("k-detail-row")) {
                        next.remove();
                    }

                    r = t.dataItem(s);

                    next = $(l(r)).addClass(s.hasClass("k-alt") ? "k-alt" : "").insertAfter(s);

                    t.trigger('detailInit', {
                        masterRow: s,
                        detailRow: next,
                        data: r,
                        detailCell: next.find(".k-detail-cell"),
                        secondHierarchy: sc
                    });

                    next.attr('second', sc);
                }
                i = next;
                t.trigger(isOpenClick ? 'detailExpand' : 'detailCollapse', {
                    masterRow: s,
                    detailRow: i
                });
                i.toggle(isOpenClick);

                t._current && t._current.attr("aria-expanded", isOpenClick);
                n.preventDefault();
                n.stopPropagation();



                if (o.hasClass('k-i-expand')) {
                    HideShow(o.parent().find(".k-icon.first"), o);
                } else {
                    HideShow(o);
                }

            } else {

                var grid = t;
                var firstTd = $(this).closest('td');

                var item = self.GetKendoItem(grid, firstTd);

                if (item.expand === undefined) {
                    item.expand = true;

                    if ((!item.items2
                            || item.items2.length == 0)
                        && grid.dataSource.GetSubGroups) {

                        var filters = grid.dataSource.GetFilters(item);

                        var items = grid.dataSource.GetSubGroups(filters);

                        item.items2 = items;

                        if (items.length > 0
                            && items[0][grid.dataSource.elementaryKeyField]) {

                            var cicleItem = item;
                            var parentFieldsValues = {};

                            //var groupAttr = item.field.substring(0, item.field.indexOf('.'));
                            do {
                                parentFieldsValues[cicleItem.field] = cicleItem.value;

                                cicleItem = cicleItem.parent;

                            } while (cicleItem);

                            for (var k = 0; k < items.length; k++) {

                                for (var pr in parentFieldsValues)
                                    items[k][pr] = parentFieldsValues[pr];
                            }
                        }
                    }

                    item.items = item.items2;

                    SetNotRenderChild(item.items);
                    KendoPlugins.sortGroupByAggregatesValueDS(grid.dataSource, item.items);

                    if (grid.partialRender) {
                        var afterTr = firstTd.parent('tr');

                        grid._partialRender(grid, afterTr, item);
                    } else {
                        grid.refresh();
                    }
                } else {
                    item.expand = !item.expand;
                }

                oldGroupableHandler.call(this, n);

                o.closest('tr').next().attr('second', sc);

                if (o.hasClass('k-i-collapse')) {
                    HideShow(o.parent().find(".k-icon.second"), o);
                }
            }

            if (grid.options.afterDataBound) {
                grid.options.afterDataBound();
            }
        };

        t._groupable();
    }

    this.CreateSimpleGrid = function (grid, options) {
        grid
            .kendoGrid({
                dataSource:
                    options.dataSource
                        || {
                            type: "json",
                            schema: {
                                data: 'Data',
                                fields: {
                                    Date: { type: 'date' }
                                }
                            },
                            transport: {
                                read: {
                                    url: options.detailsUrl,
                                    type: "POST",
                                    data: options.data
                                }
                            }
                        },
                scrollable: false,
                sortable: true,
                columns: options.detailColumns,
                dataBound: options.dataBound || null

            });
    };

    this.collapseAllGroups = function (grid) {
        var kendoGrid = grid.data('kendoGrid');
        var trs = kendoGrid.table.find(".k-grouping-row");

        this.collapseAllGroupsItItems(trs, kendoGrid);
    }

    this.collapseAllGroupsItItems = function (trs, kendoGrid) {

        trs
            .each(function () {
                var firstTd = $('td[groupindex]', this).first();

                var item = KendoPlugins.GetKendoItem(kendoGrid, firstTd);

                if (item.expand !== true) {
                    kendoGrid.collapseGroup(this);
                }
            });
    }

    this.getGroupLevels = function (groups) {
        var groupLevels = {};
        var i = 0;
        for (; i < groups.length; i++) {
            groupLevels[groups[i].field] = i;
        }

        //TODO: хак на время, обобщить
        // groupLevels["Contact.name"] = i;

        return groupLevels;
    }

    this.setGroupHeadToTr = function (grid, headRows, groupIndex, level) {
        var data = grid;
        var dataSource = data.dataSource;
        var groups = dataSource._group;

        var getNonHidenStaticFields = function() {
            var staticCount = 0;

            for (var j = 0; j < data.columns.length; j++) {
                if (data.columns[j].isDetail
                    && data.columns[j].isDetail == true
                    && (data.columns[j].hidden == undefined
                        || data.columns[j].hidden == false)) {
                    staticCount++;
                }
            }

            return staticCount;
        };

        if (groups[0]) {

            var groupLevels = this.getGroupLevels(groups);

            var mapColToAgr = MapColToAgr(
                data.columns,
                groups[0].aggregates);


            var groupCount = groups.length;

            var colspan = groupCount * 2 - (data._events.detailInit ? 0 : 1) + 1;

            var levelArrays = [dataSource._view];

            levelArrays[-1] = null;

            for (var i = 0; i <= level; i++) {
                var indexByLevel = groupIndex[i];

                var curItems = levelArrays[i];

                if (curItems.length == 0)
                    levelArrays[i + 1] = [];
                else
                    levelArrays[i + 1] = curItems[indexByLevel > 0 ? indexByLevel : 0].items;
            }

            if (groupIndex[groupIndex.length] > 0) {
                groupIndex[groupIndex.length]--;
            }

            var staticColumnCount = getNonHidenStaticFields();

            var footeAndHeadRowsLength = $(headRows).length;

            for (var i = 0; i < footeAndHeadRowsLength; i++) {
                var headerRow = $(headRows[i]);

                var field = $('span', headerRow).attr('field');

                level = groupLevels[field];// - dataSource.parentFilters.level;
                var currentItem = GetNextItem(groupIndex, levelArrays, level);

                currentItem.level = level;

                var prevLevel = levelArrays[level - 1];
                currentItem.parent = prevLevel ? prevLevel[groupIndex[level - 1]] : null;

                var suffixHtml = GetSuffixRowHtml(groupCount + staticColumnCount, mapColToAgr, currentItem);

                var attrs = {
                    colspan: colspan - level + staticColumnCount,
                    groupIndex: groupIndex,
                    level: level
                };

                headerRow.addClass('k-master-row');
                AcceptHtmlAndAttr(headerRow, suffixHtml, attrs, currentItem.expand, grid.firstHierarchy);
            }
        }
    }

    this.setGroupHead = function (grid) {
        var headRows = $('tr.k-grouping-row', grid);
        var groupIndex = [-1];

        this.setGroupHeadToTr($(grid).data("kendoGrid"), headRows, groupIndex, 0);
    }

    function MapColToAgr(columns, aggregates) {
        var mapColToAgr = [];

        var visibleColCount = 0;

        for (var c = 0; c < columns.length; c++) {
            if (!columns[c].hidden) {

                var agrIndex = FindByField(aggregates, columns[c].field);

                if (agrIndex != -1
                    || columns[c].customAggregate) {

                    mapColToAgr[visibleColCount] = {
                        field: columns[c].field,
                        agr: columns[c].customAggregate
                            ? "custom"
                            : aggregates[agrIndex].aggregate,
                    };

                    var fieldTemplate = columns[c].groupFieldTemplate;

                    if (fieldTemplate) {
                        mapColToAgr[visibleColCount].groupFieldTemplate =
                            getTemplateFunction(fieldTemplate);
                    }
                }
                visibleColCount++;
            }
        }

        return mapColToAgr;
    }

    function AcceptHtmlAndAttr(headerRow, suffixHtml, attrs, isExpand, isKendoFirst) {

        var head = headerRow.children('td:has(p)');
        var anchor = $('a', head);

        anchor.addClass(isKendoFirst ? "first" : "second");

        // anchor.after('<a class="k-icon k-plus ' + (!isKendoFirst ? "first" : "second") + '" href="#" tabindex="-1"></a>');
        head.after(suffixHtml);

        head.attr(attrs);

        if (isExpand) {
            head.addClass('expand');
        }
    }

    function GetNextItem(groupIndex, levelArrays, level) {
        groupIndex[level + 1] = -1;

        groupIndex[level]++;
        var indexByLevel = groupIndex[level];

        var curItems = levelArrays[level];
        var currentItem = curItems[indexByLevel];

        levelArrays[level + 1] = currentItem.items;

        return currentItem;
    }

    function GetSuffixRowHtml(groupCount, mapColToAgr, currentItem) {
        var rowHtml = '';
        for (var j = groupCount; j < mapColToAgr.length; j++) {

            var curColumn = mapColToAgr[j];

            if (curColumn) {
                var groupFieldTemplate = curColumn.groupFieldTemplate;

                var newTd = '<td class="right-align">' +
                    //"i= " + i + ",j=" + j + "stackHeads.Length=" + stackHeads.length + ",groupIndex=" + curGroupIndexByLevel +
                    //"sum=" +
                    (groupFieldTemplate
                        ? groupFieldTemplate(currentItem)
                        : currentItem.aggregates[curColumn.field] != undefined
                        ?FormatValue(currentItem.aggregates[curColumn.field][curColumn.agr])
                        :'')
                    +
                    ' </td>';

                rowHtml += newTd;

            } else {
                rowHtml += '<td></td>';
            }
        }

        //  rowHtml += ;

        return rowHtml;
    }

    this.GetKendoItem = function (grid, firstTd) {
        var view = grid.dataSource._view;

        var indexes = eval("[" + $(firstTd).attr("groupindex") + "]");
        var level = parseInt($(firstTd).attr("level"));

        var curArr = view;
        for (var i = 0; i < level; i++) {
            try {
                curArr = curArr[indexes[i]].items;
            } catch (e) {
                console.log("i=" + i + " level=" + level);
                console.log(indexes);
                console.log(curArr);
            }

        }

        var item = curArr[indexes[i]];

        return item;
    };


    this.initGroupHeaderNamesPlugin=function(options) {
        self.initGroupHeaderNames(options.columns);
    }

    this.initGroupHeaderNames = function (columns) {
        var groupHeaderName = function (item) {

            if (item.field == 'Contact_name') {

                return '<a href="' + basePath + 'contact/info/?userName=' + item.value + '" target="_blank"><span field="' + item.field + '"'
                    //+ ' groupid="' + item.aggregates.groupId
                    + ' groupid="' + (item.aggregates.groupId ? item.aggregates.groupId : item.value)
                    + '">'
                    + (item.value ? item.value : "") + '</span></a>';
            }

            return '<span field="' + item.field + '"'
                //+ ' groupid="' + item.aggregates.groupId
                + ' groupid="' + (item.aggregates.groupId ? item.aggregates.groupId : item.value)
                + '">'
                + (item.value ? item.value: "") + '</span>';
        };

        for (var i = 0; i < columns.length; i++) {
            columns[i].groupHeaderTemplate = groupHeaderName;
        }
    }

    function setRedColorToNegativeNumbersPluginWorker(columns) {
        for (var i = 0; i < columns.length; i++) {

            var column = columns[i];

            if (!column.customFormat) {
                continue;
            }

            column.template = setRedColorTemplate(column, column.template);

            var groupFieldTemplate = column.groupFieldTemplate;

            if (groupFieldTemplate) {
                column.groupFieldTemplate = setRedColorTemplate(column, groupFieldTemplate);
            }
        }
    }

    this.setRedColorToNegativeNumbers = function (gridName) {
        attachBefore(gridName, function (options) {
            setRedColorToNegativeNumbersPluginWorker(options.columns);
        });
    }

    this.HiglightIndicator = function (cardType) {
        return function(gridName) {
            attachBefore(
                gridName,
                function(options) {
                    HiglightIndicator.init(options.columns, cardType);

                    options.dataSource._sort = { field: window.cardType, dir: 'desc' };
                });
        };
    }

    function wrapToRedDiv(value) {
        return "<div style='color:Red'>" + value + "</div>";
    }

    var setRedColorTemplate = function (column, template) {

        if (template) {
            return function (data) {
                var templateFunc = getTemplateFunction(template);

                    var value = templateFunc(data);

                return checkNegativeValue(value);
            };
        } else {
            return function (data) {
                var format = column.customFormat == 'currency' ? 'n0' : 'n';

                var value = kendo.toString(data[column.field], format);

                return checkNegativeValue(value);
            }
        }
    };

    function checkNegativeValue(value) {
        return (/^-[0-9]+/.test(value))
            ? wrapToRedDiv(value)
            : value;
    }

    this.callCustomAggregates = function (view, columns) {

        columns.forEach(function (column) {
            if (column.customAggregate) {
                for (var i = 0; i < view.length; i++) {
                    var item = view[i];
                    var aggregates = item.aggregates;

                    aggregates[column.field] = aggregates[column.field] || {};
                    aggregates[column.field].custom = column.customAggregate(aggregates);

                    if (item.hasSubgroups) {
                        callCustomAggregates(item.items, columns);
                    }
                }
            }
        });
    }

    this.showMasterItems = function (grid) {
        var dataSource = $(grid).data("kendoGrid").dataSource;


        if (dataSource._group
            && dataSource._group.length > 0) {

            var view = dataSource._view;

            SetNotRenderChild(view);
        }
    }

    this.SetExpandClickWithLoadChild = function (grid, tds) {
        //tds.children('a.first')
        //    .on('click', function() {


        //    });
    }

    function SetNotRenderChild(view) {
        for (var i = 0; i < view.length; i++) {
            var curItem = view[i];

            if (!curItem.items2) {
                curItem.items2 = curItem.items;
                curItem.items = [];
            }
        }
    }

    this.sortGroupByAggregatesValue = function (grid) {

        var dataSource = $(grid).data("kendoGrid").dataSource;
        this.sortGroupByAggregatesValueDS(dataSource);
    }

    this.sortGroupByAggregatesValueDS = function (dataSource, view) {

        var groups = dataSource._group;

        if (groups
            && groups.length > 0
            && dataSource._sort
            && dataSource._sort.length > 0) {


            var sortInfo = dataSource._sort[0];

            if (!window.isSortWaySaved) {
                window.ReportGridSortField = {
                    field: sortInfo.field,
                    dir: sortInfo.dir,
                    isSorted: false
                };
            }

            console.log('sort '+sortInfo.field + ' ' + sortInfo.dir);

            var groupSortIndex = FindByField(groups, sortInfo.field);

            var getColorValueFunc = null;
            var getValueFunc = null;
            
            if (groupSortIndex >= 0) {//баг kendo dir в группах обратный к dir в столбцах
                var curDir = sortInfo.dir === "desc" ? "asc" : "desc";

                if (groups[groupSortIndex].dir != curDir) {
                    groups[groupSortIndex].dir = curDir;

                    dataSource.group(groups);
                }

                return;
            } else {
                //TODO: искать столбец, определять у него orderField,
                //сортировать по цвету + значение.

                var compareAscDesc = sortInfo.dir === "desc" ? compareDesc : compareAsc;

                getValueFunc = GetAggregateValueFunc(sortInfo.field, dataSource._aggregate);
                var compareFunc = buldCompareFunc(getValueFunc, compareAscDesc);

                var prefix = '';

                if (dataSource.coloredColumns
                    && dataSource.sortByColor) {
                    var findColumn = dataSource.coloredColumns.find(function(el) { return el.field == sortInfo.field; });
                    if (findColumn) {
                        prefix = 'pr';
                    }
                    getColorValueFunc = GetAggregateValueFunc(prefix + sortInfo.field, dataSource._aggregate);

                    var compareColorFunc = buldCompareFunc(getColorValueFunc, compareAscDesc);

                    compareFunc = unionCompare(compareColorFunc, compareFunc);
                }
                
                if (compareFunc) {
                    var curArr = view ? view : dataSource._view;
                    if (curArr
                        && curArr.length > 0
                        && curArr[0].aggregates) {
                            sortGridItems(curArr, compareFunc);
                       
                    }
                }
            }
        }
    }

    
    function GetAggregateValueFunc(field, aggregates) {
        
        var agregateFuncName = GetAggregateOperationName(aggregates, field);

        if (!agregateFuncName || /numerator/.test(field)) {
            agregateFuncName = "custom";
        }

        var getValueFunc = function (gr) {
            if (!gr.aggregates||!gr.aggregates[field]) {
                return null;
            }

            return gr.aggregates[field][agregateFuncName];
        };

        return getValueFunc;
    }

    function GetAggregateOperationName(aggregates, field) {
        var agregateFuncName = null;

        for (var i in aggregates) {
            if (aggregates[i].field == field) {
                agregateFuncName = aggregates[i].aggregate;
                break;
            }
        }

        return agregateFuncName;
    }

    function sortGridItems(curArr, compareFunc) {

        if (!curArr.sort)
            return;
        //  curArr = curArr.toJSON();//TODO: делает ли копию или изменяет, работает ли сортировка в подгрупах?? toJSON Рекурсия из-за parent

        curArr.sort(compareFunc);

        for (var i = 0; i < curArr.length; i++) {
            var item = curArr[i];

            if (item.hasSubgroups) {
                sortGridItems(item.items, compareFunc);
            }
        }
    }

    function compareAsc(a, b) {

        if (a == null || b == null)
            return null;

        if (a < b) {
            return -1;
        }

        if (a > b) {
            return 1;
        }

        return 0;
    }

    function compareDesc(a, b) {

        if (a == null || b == null)
            return null;

        if (a < b) {
            return 1;
        }

        if (a > b) {
            return -1;
        }

        return 0;
    }


    function buldCompareFunc(getValue, compare) {

        return function (a, b) {
            var ca = getValue(a);
            var cb = getValue(b);

            return compare(ca, cb);
        };
    }

    function unionCompare(compare1, compare2) {

        return function (a, b) {
            var result = compare1(a, b);

            if (result == 0)
                return compare2(a, b);

            return result;
        };
    }

}


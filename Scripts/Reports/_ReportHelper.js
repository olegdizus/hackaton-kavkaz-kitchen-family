kendo.culture("ru-RU");
String.prototype.toDenominator = function () {
    return this.replace('numerator', 'denominator');
}

function sendPost(url, data) {
    var result = [];

    $.ajax({
        url: url,
        type: 'post',
        async: false,
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (dataJson) {
            result = dataJson;
        }
    });

    return result;
}

function LoadNomenclatureHierarchy(callback) {
    //includeOnce('SharedReport/GetNomenclature', function () {

    //    kindPacking[0] = 'Без упаковки';

    //    for (var key in nomenclature) {
    //        var row = nomenclature[key];

    //        row.GroupNMK = groupNMK[row.groupNMK_id];
    //        row.subGroupNMK = subGroupNMK[row.subGroupNMK_id];
    //        row.brend = brend[row.brend_id];
    //        row.BKG = bkg[row.bkg_id];
    //        row.kindPacking = kindPacking[row.kindPacking_id];

    //    }

        
    //});
    callback();
}

function LoadContactsHierarchy(callback) {

    callback();
    //includeOnce('SharedReport/GetContacts', function () {
    //    $(function () {
            

            

    //    });
    //});
}

function getGroupFields(columns, gridAggregates) {
    var groupFields = [];

    for (var i = 0; i < columns.length; i++) {

        if (columns[i].isGroup) {
            groupFields.push({
                field: columns[i].field,
                aggregates: gridAggregates
            });
        }
    }

    return groupFields;
}

function GetHierarchyFields(controllerName) {

    $.ajax({
        url: basePath + controllerName + '/GetReportSettings',
        type: 'get',
        async: false,
        dataType: 'json',
        success: function (dataJson) {
            console.log(dataJson);
            result = dataJson;
        }
    });

    return result;
}



//TODO: проверить нет ли дублирования с инит датапикер
$(function () {
    $('.datepicker').datepicker({
        todayHighlight: true,
        autoclose: true,
        language: 'ru'
    });
});

var HiglightIndicator = new function () {

    this.init = function (columns, fieldName) {
        if (fieldName != -1) {
            this.SetHiglightTemplate(columns, fieldName);
        }
    }

    this.SetHiglightTemplate = function (columns, field) {

        var index = FindByField(columns, field);

        if (index >= 0) {
            var column = columns[index];

            column.headerAttributes = this.highlight(column.headerAttributes);
            column.footerAttributes = this.highlight(column.footerAttributes);
        }
    }

    this.highlight = function (curAttr) {
        return setClassAttr(curAttr, 'highlight');
    }
}

function getSumAggregates(fields) {
    var aggregates = [];
    for (var i in fields) {
        aggregates.push({
            field: fields[i],
            aggregate: 'sum'
        });
    }
    return aggregates;
}

function getAggregatesByColumn(columns) {

    var aggregates = [];

    columns.forEach(function (col) {
        if (col.aggregates) {
            col.aggregates.forEach(function (agr) {

                aggregates.push(getAggregate(col.field, agr));
                //TODO:Закоментировал из-за ошибки!!! при работе с динамической подгрузкой в кендо грид
                //if (/numerator/.test(col.field)) {
                //    aggregates
                //        .push(
                //            getAggregate(col.field.toDenominator(), agr)
                //        );
                //}
            });
        }
    });

    function getAggregate(field, agr) {
        return {
            field: field,
            aggregate: agr
        }
    }

    return aggregates;
}

//function initGroupHeaderNames(columns) {

//    var groupHeaderName = function (item) {
//        return '<span field="' + item.field + '">' + (item.value ? item.value : "") + '</span>';
//    };

//    for (var i = 0; i < columns.length; i++) {
//        columns[i].groupHeaderTemplate = groupHeaderName;
//    }
//}


function setAggregateToColumns(columns, aggregates) {
    columns.forEach(function (column) {
        if (!column.customAggregate) {
            if (column.aggregates) {
                column.aggregates = column.aggregates.concat(aggregates);
            } else {
                column.aggregates = aggregates;
            }
        }
    });
}

function setValueColorToColumns(columns) {

    columns.forEach(function (column) {
        column.setRowColor = true;
    });
}

function setColumnFormat(columns) {

    columns.forEach(function (col) {
        if (col.customFormat == 'currency' || col.customFormat == 'simple') {
            //col.footerTemplate = col.footerTemplate || "#=round(sum)#";
            //col.footerTemplate = col.footerTemplate || "#= isNaN(sum) ? 0 : round(sum)#";

            setFormat(col, 'n0');
        } else if (col.customFormat == 'percent')
            setFormat(col, 'n');
    });

    function setFormat(col, format) {
        col.format = '{0:' + format + '}';

        col.groupFieldTemplate =
            col.groupFieldTemplate ||
            function (arg) {
                return kendo.toString(arg.aggregates[col.field].sum, format);
            }

        col.attributes = rightAlign(col.attributes);
        col.footerAttributes = rightAlign(col.footerAttributes);
    }
}

function rightAlign(curAttr) {
    return setClassAttr(curAttr, 'right-align');
}

function setClassAttr(curAttr, className) {
    if (curAttr) {
        curAttr['class'] += (' ' + className);

        return curAttr;
    } else {
        return { 'class': className };
    }
}

function calculateMinMaxInGroup(callback) {

    return function(data) {

        return callback(data);
    }
}

function callCustomAggregates(view, columns) {

    columns.forEach(function (column) {
        if (column.customAggregate) {
            for (var i = 0; i < view.length; i++) {
                var item = view[i];

                item.aggregates[column.field] = item.aggregates[column.field] || {};
                item.aggregates[column.field].custom = column.customAggregate(item.aggregates);

                if (item.hasSubgroups) {
                    callCustomAggregates(item.items, columns);
                }
            }
        }
    });
}

function weightTemplate(data) {

    var field = 'Weight';
    var allSum = 0;

    if (data.parent) {
        allSum = data.parent.aggregates[field].sum;
    } else {

        try {
            allSum = gridDiv.data("kendoGrid").dataSource._aggregateResult[field].sum;
        } catch (e) {
            allSum = 0;
        }
    }

    return barTemplate({ FaktByPlan: data.aggregates[field].sum, Plan: allSum });
}

function FormatValueWithCustom(value, customFormat) {
    if (customFormat == 'percent') {

        return kendo.toString(value, "n2");
    } else if (customFormat == 'currency'
        || customFormat == 'simple') {

        return kendo.toString(value, "n0");
    }

    return FormatValue(value);
}

function FormatValue(value, format) {
    //var number = Math.round(value * 100) / 100;

    return kendo.toString(value, format ? format : "n");
}

function FormatValueWithSpace(value) {

    return FormatValueWithSpaceFormat(value, "n2");
}

function FormatValueWithSpaceFormat(value, format) {

    return value ? kendo.toString(value, format).toString().replace(/[.]/g, "&nbsp;") : "";
}

function sortByIndicator(grid, indicatorIndex) {

    var field = getFieldNameByIndicatorIndex(indicatorIndex);

    if (field != -1) {
        var dataSource = $(grid).data("kendoGrid").dataSource;
        
        //asc
        dataSource.sort({ field: field, dir: "desc" });
    }
}


function GetCustomFormatByIndicatorId(indicatorId) {

    switch(indicatorId) {
        case 17:
        case 23:
        case 28:
        case 30:
        case 32:
        case 35:
        case 47:
        case 49:
        case 50:
        case 51:
            return 'percent';

        default:
            return 'currency';
    }
}

function GetFormatByCustomFormat(customFormat) {
    return customFormat == 'percent' ? 'n2' : 'n0';
}

function GetFormatByIndicatorId(indicatorId) {

    var customFormat = GetCustomFormatByIndicatorId(indicatorId);

    return GetFormatByCustomFormat(customFormat);
}

function getTooltipAjax(instance, origin, attributes) {

    $.ajax({
        url: basePath + "Shared/GetIndicatorDescription",
        type: 'get',
        data: { indicator_id: attributes },
        success: function (response) {
            if (response.success) {
                instance.content(response.indicator);
                origin.data('loaded', true);
            } else {

                if (response.message) {
                    console.log(response.message);
                } else {
                    console.log('Не удалось получить показатель');
                }
            }
        },
        error: function () {
            console.log('При загрузке данных для tooltip произошла ошибка');
        }
    });

}
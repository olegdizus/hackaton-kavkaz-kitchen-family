
function parseDateFromString(string) {
    var dateParts = string.split(' ')[0].split('-');

    return new Date(dateParts[0], (dateParts[1] - 1), dateParts[2]);
    //return new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]);
}

function parseNumber(str) {
    return str ? parseFloat(str.replace(",", ".")) : 0;
}

function ArrayDataSource(getArray, dateFieldName) {
    this.getArray = getArray;
    this.dateFieldName = dateFieldName;
}

ArrayDataSource.prototype = {
    constructor: ArrayDataSource,
    getValue: function (date, fieldName, measureCoof) {
        
        if (measureCoof == undefined) {
            measureCoof = 1;
        }

        function getDate(dateFieldName, arrayRow) {
            return parseDateFromString(arrayRow[dateFieldName]);
        }

        var array = this.getArray();

        if (array)
        {
            for (var i = 0; i < array.length; i++) {
                var currentValue = array[i];
                var currentDate = getDate(this.dateFieldName, currentValue);

                if (currentDate < date) {
                    continue;
                }

                if (currentDate > date) {
                    return 0;
                }

                return parseNumber(currentValue[fieldName]) * measureCoof;

            }
        }

        return 0;
    },
    //getGraphicData: function(ordinateKey, beginDate, endDate, scaleCoef) {

    //    var result = [];
    //    beginDate = beginDate != undefined
    //        ? beginDate : new Date(2000, 0, 1).getTime();

    //    endDate = endDate != undefined
    //        ? endDate : new Date(2200, 0, 1).getTime();

    //    for (var i = 0; i < this.array.length; i++) {
    //        var currentElement = this.array[i];

    //        var date = parseDateFromString(currentElement[this.dateFieldName]).getTime();

    //        if (date < beginDate) {
    //            continue;
    //        }
    //        if (date > endDate) {
    //            break;
    //        }

    //        var value = parseNumber(currentElement[ordinateKey]);

    //        result.push([date, value * scaleCoef]);
    //    }

    //    return result;
    //}
};

function ArrayMonthDataSource() {
    ArrayDataSource.apply(this, arguments);
}

ArrayMonthDataSource.prototype = Object.create(ArrayDataSource.prototype);
ArrayMonthDataSource.prototype.constructor = ArrayMonthDataSource;

ArrayMonthDataSource.prototype.getMonthDate = function (date, isCalendarMonthUse) {
    var monthDate;

    if (isCalendarMonthUse) {
        monthDate = date.getStartOfMonth();
    } else {
        if (window.requestMonthDate
            && window.responseMonthDate
            && window.requestMonthDate == date) {
            monthDate = window.responseMonthDate;
        } else {
            $.ajax({
                url: basePath + "/Date/GetBeginProductionMonth",
                async: false,
                data: { date: date.toServerFormat() },
                type: 'POST',
                success: function(data) {
                    window.responseMonthDate = monthDate = parseDateFromString(data.date);
                    window.requestMonthDate = date;
                },
                error: function(data) {
                    alert('При запросе даты производственного месяца даты произошла ошибка');
                }
            });
        }
    }

    return monthDate;
}

ArrayMonthDataSource.prototype.getValue = function (date, field, isCalendarMonthUse, measureCoof) {

    var monthDate = this.getMonthDate(date, isCalendarMonthUse);
    var result = ArrayDataSource.prototype.getValue.apply(this, [monthDate, field, measureCoof]);

    return result;
}



var plotDataProvider = function (getDataArray, timeField, valueField, scaleCoef, childDataProvider) {

    function parseArrayWithLastValueFromChildDataProvider(endDateRange, dateDiff) {
        var endDatePreviosMonthTimestamp = new Date(endDateRange).setMonth(endDateRange.getMonth() - 1);

        var endDateRangePreviosMonth = new Date(endDatePreviosMonthTimestamp);

        var array = getGraphicData(
            getDataArray(),
            timeField,
            valueField,
            getDateWithDateDayDiff(endDateRangePreviosMonth, dateDiff),
            endDateRangePreviosMonth,
            scaleCoef);

        var lastArrayValue = childDataProvider.getValue(endDateRange) * scaleCoef;

        var lastValueDate = new Date(endDateRange);

        lastValueDate.setDate(1);

        array.push([lastValueDate, lastArrayValue]);

        return array;
    }

    var resultObj = {
        getGraphicData: function (endDateRange, dateDiff) {
            if (childDataProvider === undefined) {
                return getGraphicData(
                        getDataArray(),
                        timeField,
                        valueField,
                        getDateWithDateDayDiff(endDateRange, dateDiff),
                        endDateRange,
                        scaleCoef
                    );
            } else {
                return parseArrayWithLastValueFromChildDataProvider(endDateRange, dateDiff, scaleCoef);
            }
        }
    }

    return resultObj;
}

function getGraphicData(array, abscissaKey, ordinateKey, beginDate, endDate, scaleCoef) {

    var result = [];
    beginDate = beginDate != undefined
        ? beginDate : new Date(2000, 0, 1).getTime();

    endDate = endDate != undefined
        ? endDate : new Date(2200, 0, 1).getTime();

    if (array) {
        for (var i = 0; i < array.length; i++) {
            var currentElement = array[i];

            var date = parseDateFromString(currentElement[abscissaKey]).getTime();

            if (date < beginDate) {
                continue;
            }
            if (date > endDate) {
                break;
            }

            var value = parseNumber(currentElement[ordinateKey]);

            result.push([date, value * scaleCoef]);
        }
    }

    return result;
}

function getDateWithDateDayDiff(date, dateDiff) {
    if (dateDiff.unit === "day") {
        return new Date(date).setDate(date.getDate() + dateDiff.offset);
    } else if (dateDiff.unit === 'month') {
        return new Date(date).setMonth(date.getMonth() + dateDiff.offset);
    } else {
        console.log('Непредвиденная единица изменения: ' + dateDiff.unit, "getDateWithDateDayDiff");
        return 0;
    }
}


var pieChartDataProvider = function (getDataArray, timeField) {

    var resultObj = {
        getPieChartData: function (date) {
            return getPieChartData(getDataArray(), timeField, date.getTime());
        }
    }

    return resultObj;
}

function getPieChartData(array, dateFieldName, currentDate) {
    var totalFieldName = "Total";
    var result = [];
    var percentageSum = 0;

    if (!array)
        return result;

    for (var i = 0; i < array.length; i++) {
        var currentElem = array[i];

        var date = parseDateFromString(currentElem[dateFieldName]).getTime();

        if (date == currentDate) {
            var total = parseNumber(currentElem[totalFieldName].sum);

            for (var prop in currentElem) {

                if (currentElem.hasOwnProperty(prop)
                    && prop !== totalFieldName
                    && prop !== dateFieldName) {

                    var currentPercentage = parseNumber(currentElem[prop].sum) / total * 100;

                    percentageSum += currentPercentage;

                    if (currentPercentage !== 0) {
                        result.push({
                            label: prop,
                            data: currentPercentage,
                            id: currentElem[prop].id
                        });
                    }
                }
            }

            result.push({
                label: "Другие",
                data: 100 - percentageSum,
                id: -1
            });

            break;
        }
    }

    result.sort(function (a, b) {
        if (a.data > b.data) {
            return -1;
        }
        if (a.data < b.data) {
            return 1;
        }

        return 0;
    });

    return result;
}
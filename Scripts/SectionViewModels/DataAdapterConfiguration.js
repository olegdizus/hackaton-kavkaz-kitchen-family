var reports =
    {
        "Наценка":
        {
            getArrayMethod: getReportDaysDataProduction,
            "Дата":
            {
                field: "period"
            },
            "Итого":
            {
                field: "profitPercent"
            },
            "СреднийПроцент":
            {
                field: "profitAverPercent"
            }
        },

        "СравнениеДанныхДЗ":
        {
            getArrayMethod: getTestDataChart,
            "Дата": {
                field: "period"
            },
            "СуммаПродаж": {
                field: "Сумма продаж"
            },
            "ВесПродаж": {
                field: "Вес продаж"
            },
            "ПлановаяСумма": {
                field: "Плановая сумма"
            },
            "КоличествоОтгрузок": {
                field: "Количество отгрузок"
            },
            "КоличествоСработавшихТТ": {
                field: "Количество сработавших ТТ"
            },
        },

        "Продажи":
        {
            getArrayMethod: getReportDaysDataProduction,
            "Дата": {
                field: "period"
            },
            "Отгрузка": {
                field: "delKg"
            },
            "СредняяОтгрузкаКг": {
                field: "delAverKg"
            },
            "СредняяОтгрузкаРуб": {
                field: "delAverRub"
            },
            "КоличествоОтгрузок": {
                field: "delCount"
            },
            "Выручка": {
                field: "delRub"
            },
            "ПроцентВозвратовОтОборота": {
                field: "percentReturnFromDelivery"
            },
            "ПрогнозКг": {
                field: "prognozDeliveryKg"
            },
            "ПрогнозРуб": {
                field: "prognozDeliveryRub"
            },
            "ПланКг": {
                getArrayMethod: getSalesPlansProduction,
                field: "weight"
            },
            "ПланРуб": {
                getArrayMethod: getSalesPlansProduction,
                field: "sum"
            },
            "ВаловаяПрибыль": {
                field: "grossProfitSum"
            },
            "СредняяВаловаяПрибыль": {
                field: "grossProfitSumAver"
            },
            "ПрогнозВаловаяПрибыль": {
                field: "prognozProfitSum"
            },
            "ПрогнозВаловаяПрибыльПлановая": {
                field: "prognozProfitPlanSum"
            }
        },

        "ПродажиЧасть2":
        {
            getArrayMethod: getReportDaysDataProduction2,
            "Дата": {
                field: "period"
            },
            "ФактКг": {
                field: "delAccumFactKg"
            },
            "ФактРуб": {
                field: "delAccumFactRub"
            },
            "НакопительноВаловаяПрибыль": {
                field: "grossProfitSumAccum"
            },
            "НакопительноВаловаяПрибыльПлановая": {
                field: "grossProfitPlanSumAccum"
            }
        },

        "ДЗ":
        {
            getArrayMethod: getDebitoreByDays,
            "Дата": {
                field: "period"
            },
            "ОбщаяЗадолженность": {
                field: "Full Debitore"
            },
            "ОбщаяЗадолженностьСреднееЗначение": {
                field: "AverageFullDebitore"
            },
            "КонечныйОстаток": {
                field: "KoefDebitore"
            },
            "КонечныйОстатокСреднееЗначение": {
                field: "AverageKoefDebitore"
            },
            "ПроцентПросроченнойОтОбщей": {
                field: "PercentOwedDebitore"
            },
            "ПроцентПросроченнойОтОбщейСреднееЗначение": {
                field: "AveragePercentOwedDebitore"
            },
            "СуммаПросроченнойОбщая": {
                field: "Owed Debitore"
            },
            "СуммаПросроченнойОбщаяСреднееЗначение": {
                field: "AverageOwedDebitore"
            },
            "СуммаПросроченнойОт8Дней": {
                field: "Owed Debitore More8 Days"
            }
        },

        "ВозвратыЗаМесяц":
        {
            getArrayMethod: getReturnsByMonthProduction,
            "Дата": {
                field: "period"
            },
            "Продажи": {
                field: "summaKRub"
            },
            "Возврат": {
                field: "back"
            }
        },

        "ПричиныВозвратов":
        {
            getArrayMethod: getReasonOfReturnsProduction,
            "Дата": {
                field: "period"
            }
        },

        "ПродажиЗаМесяц":
        {
            getArrayMethod: getSalesDynamicDataProduction,
            "Дата": {
                field: "period"
            },
            "ВесВТоннах": {
                field: "weightT"
            },
            "СуммаТысячРублей": {
                field: "summaKRub"
            }
        },

        "ПродажиЗаНеделю":
       {
           getArrayMethod: getSalesByWeek,
           "Дата": {
               field: "period"
           },
           "ВесВТоннах": {
               field: "weightT"
           },
           "СуммаТысячРублей": {
               field: "summaKRub"
           },
           "ВаловаяПрибыльТысячРублей": {
               field: "summaGross"
           }
       },

        "ВПЗаМесяц":
        {
            getArrayMethod: getGrossProfitDynamicDataProduction,
            "Дата": {
                field: "period"
            },
            "СуммаРублей": {
                field: "summaGross"
            }
        }
    };

function getDebitoreByDays() {
    return window.faceData.debitoreByDays;
}

function getReportDaysDataProduction() {
    return window.faceData.reportDaysDataProduction;
}
function getReportDaysDataProduction2() {
    return window.faceData.reportDaysDataProductionPart2;
}




function getReturnsByMonthProduction() {
    return window.faceData.returnsByMonthProduction;
}

function getReasonOfReturnsProduction() {
    return window.faceData.reasonOfReturnsProduction;
}

function getSalesDynamicDataProduction() {
    return window.faceData.salesDynamicDataProduction;
}

function getGrossProfitDynamicDataProduction() {
    return window.faceData.grossProfitDynamicDataProduction;
}

function getSalesPlansProduction() {
    return window.faceData.salesPlansProduction;
}

function getSalesByWeek() {
    return window.faceData.salesByWeek;
}

function getTestDataChart() {
    return window.faceData.testDataChart;
}

function GetMonthDataProvider(initOptions) {
    var reportFields = reports[initOptions.reportName];
    var reportField = reportFields[initOptions.fieldName];

    var arrDataSource = GetArrayDataSource(reportFields, reportField, "ArrayMonthDataSource");
    
    var resultObj = {
        getValue: function(date, isCalendarMonthUse) {
            return arrDataSource.getValue(date, reportField.field, isCalendarMonthUse,
            initOptions.measureCoof);
        }
    };

    return resultObj;
}

function GetProperty(reportFields, reportField, prop) {
    var propValue = null;

    if (reportFields[prop]) {
        propValue = reportFields[prop];
    }

    if (reportField[prop]) {
        propValue = reportField[prop];
    }

    return propValue;
}
function GetArrayDataSource(reportFields, reportField, dataSourceName) {

    var arrDataSource = GetProperty(reportFields, reportField, dataSourceName);

    if (!arrDataSource) {

        var getArray = GetProperty(reportFields, reportField, "getArrayMethod");

        if (!getArray) {
            var message = "Не задана функция массива для отчета " + reportFields + " поля " + reportField;
            alert(message);

            throw Exception(message);
        }


        arrDataSource = new window[dataSourceName](
            getArray,
            reportFields["Дата"].field);

        if (reportFields.getArray == getArray) {
            reportFields[dataSourceName] = arrDataSource;
        } else {
            reportField[dataSourceName] = arrDataSource;
        }

    }


    if (!arrDataSource) {
        var message = "Не задана функция массива для отчета " + reportFields + " поля " + reportField;
        console.log(message);
        console.log(reportFields);


        throw Exception(message);
    }


    return arrDataSource;
}

function GetSimpleIndicatorDataProvider(initOptions) {

    var reportFields = reports[initOptions.reportName];
    var reportField = reportFields[initOptions.fieldName];

    var arrDataSource = GetArrayDataSource(reportFields, reportField, "ArrayDataSource");

    var resultObj = {
        getValue: function (date) {
            return arrDataSource.getValue(
                date,
                reportField.field,
                initOptions.measureCoof);
        },
        getSecondValue: function (date, fieldName) {
            return arrDataSource.getValue(
                date,
                fieldName,
                initOptions.measureCoof);
        }
    }

    return resultObj;
}


function GetPlotDataProvider(initOptions) {

    var reportFields = reports[initOptions.reportName];
    var reportField = reportFields[initOptions.fieldName];

    if (initOptions.measureCoof == undefined) {
        initOptions.measureCoof = 1;
    }

    var getArray = GetProperty(reportFields, reportField, "getArrayMethod");

    return plotDataProvider(
        getArray,
        reportFields["Дата"].field,
        reportField.field,
        initOptions.measureCoof,
        initOptions.childDataProvider);

}

function GetPieChartDataProvider(initOptions) {

    var reportFields = reports[initOptions.reportName];
    var reportField = reportFields["Дата"];

    var getArray = GetProperty(reportFields, reportField, "getArrayMethod");

    return pieChartDataProvider(
        getArray,
        reportField.field);

}
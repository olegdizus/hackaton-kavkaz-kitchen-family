var salesIndicatorReportFields = {
    weight: 30,
    weightWithPrevDay: 30,
    weightWithPrevWeek: 30,
    SumPrice: 31,
    deliverySumWithPrevDay: 31,
    deliverySumWithPrevWeek: 31,
    grossProfit: 25,
    deliveryCount: 29,
    sumPriceMovAvg: 61,
    weightMovAvg:60
}

//BCG
var GrowthForMatrix = {
    low: "низкий",
    hight: "высокий",
    Threshold: 0.1
}

var PartForMatrix = {
    low: "низкая",
    hight: "высокая",
    Threshold: 1
}

var salesReportParams = {
    grouping: {
        byDay: 0,
        byWeek: 1,
        byMonth: 2
    },
    indicators: {
        summ: 2,
        weight: 6,
        grossProfit: 25,
        percentreturnfromdelivery: 23,
        grossProfitCoef:67
    }
}

var reportUrls = {
    salesIndicatorReport: basePath + "SalesIndicatorReportOLAP/Contact",
    periodReport: basePath + "ReportByPeriodsOLAP",
    receivableReport: basePath + "DebitoreReport",
    testReportPage: basePath + "Section/ReportTest",

    salesPlansPage: basePath + "SalesPlansKpi",
    kSPlansPage: basePath + "KSPlans",

    createUrlWithParams: function(url, params) {
        return url + "?" + $.param(params);
    }
}

//Перечисление нужно для теста графиков
var graphicTypes = {
    partOfReceivableDynamic: 1,
    receivableDynamicGraphicTotal: 2,
    receivableDynamicGraphicFrom8Days: 3,
    avarageDayRevenueDynamic: 4,
    deliveryByMonth: 5,
    returnsByMonth: 6,
    averageDayDeliveryDynamicGraphic: 7,
    salesDynamicByMoney: 8,
    salesDynamicByWeight: 9,
}
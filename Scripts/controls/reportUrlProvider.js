var getReportUrl = function (reportName, params) {
    params = params || {};

    switch (reportName) {
        case "Показатели продаж":
            return salesIndicatorReportUrlProvider(params);
        case "Отчет по периодам":
            return salesReportUrlProvider(params);
        case "Отчет по ДЗ":
            return receivableReportUrlProvider(params);
        case "Тест":
            return testReportUrlDataProvider(params);
        case "Планы продаж ОП":
            return salesPlansUrlDataProvider(params);
        case "Планы продаж КС":
            return kSPlansUrlDataProvider(params);
        default:
            throw new Error("Не предвиденный reportName для urlProvider" + reportName);
    }
}

var receivableReportUrlProvider = function(params) {
    return {
        getUrl: function (date) {
            var parametrs = {};
            parametrs.date = date.toServerFormat();

            return reportUrls.createUrlWithParams(
                reportUrls.receivableReport,
                parametrs
            );
        }
    }
}

var salesReportUrlProvider = function(params) {
    return {
        getUrl: function (date) {
            var parametrs = {};
            parametrs.beginDate = date.toServerFormat();

            if (params.indicator != undefined) {
                parametrs.indicator = params.indicator;
            }

            if (params.fromSection != undefined) {
                parametrs.fromSection = params.fromSection;
            }

            if (params.grouping != undefined) {
                parametrs.grouping = params.grouping;

                if (params.grouping == salesReportParams.grouping.byMonth) {
                    var endDateTime = new Date(date);

                    endDateTime.setMonth(endDateTime.getMonth() + 1);

                    //чтобы получить последний день текущего месяца
                    endDateTime.setDate(endDateTime.getDate() - 1);

                    parametrs.endDate = endDateTime.toServerFormat();
                }
            }

            var urlWithParams = reportUrls.createUrlWithParams(
                reportUrls.periodReport,
                parametrs
            );

            return urlWithParams;
        }
    }
}

var salesIndicatorReportUrlProvider = function (params) {
    return {
        getUrl: function (date) {
            var parametrs = {};
            parametrs.date = date.toServerFormat();

            if (params.indicator != undefined) {
                parametrs.indicator = params.indicator;
            }

            if (params.periodType != undefined) {
                parametrs.periodType = params.periodType;
            }

            if (params.fromSection != undefined) {
                parametrs.fromSection = params.fromSection;
            }

            return reportUrls.createUrlWithParams(
                reportUrls.salesIndicatorReport,
                parametrs
            );
        }
    }
}

var testReportUrlDataProvider = function (params) {
    return {
        getUrl: function (date, reasonOfReturn) {
            var parametrs = {};
            parametrs.date = date.toServerFormat();

            if (reasonOfReturn) {
                parametrs.type = reasonOfReturn;
            }

            return reportUrls.createUrlWithParams(
                reportUrls.testReportPage,
                parametrs
            );
        }
    }
}

var salesPlansUrlDataProvider = function(params) {

    return {
        getUrl: function(date, reasonOfReturn) {
            var parametrs = {};
            parametrs.date = date.toServerFormat();

            if (reasonOfReturn) {
                parametrs.type = reasonOfReturn;
            }

            return reportUrls.createUrlWithParams(
                reportUrls.salesPlansPage,
                parametrs
            );
        }
    }
}

var kSPlansUrlDataProvider = function(params) {

    return {
        getUrl: function(date, reasonOfReturn) {
            var parametrs = {};
            parametrs.date = date.toServerFormat();

            if (params && params.indicator) {
                parametrs.indicator = params.indicator;
            }

            if (reasonOfReturn) {
                parametrs.type = reasonOfReturn;
            }

            return reportUrls.createUrlWithParams(
                reportUrls.kSPlansPage,
                parametrs
            );
        }
    }
}
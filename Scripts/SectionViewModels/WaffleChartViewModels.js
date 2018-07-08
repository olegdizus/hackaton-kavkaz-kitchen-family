function createWaffleChartViewModels() {

    var redirect = {};

    var getKSPlanUrl= function(params) {
        try {
            if (isCalendarMonthUse) {
                return getReportUrl("Планы продаж КС", params);
            } else {
                return getReportUrl("Планы продаж ОП", params);
            }

        } catch (ex) {
            console.log('Во время выбора адреса редиректа для WaffleChart произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);
        }
    }


    try {

        var planWaffleMoney = waffleChartViewModel({
            planLabel: "план, руб",
            factLabel: "прогноз, руб",
            currentLabel: "текущее, %",
            indicatorName: "Прогноз выполнения плана по сумме",
            planField: GetMonthDataProvider({
                reportName: "Продажи",
                fieldName: "ПланРуб"
            }),
            factField: GetSimpleIndicatorDataProvider({
                reportName: "Продажи",
                fieldName: "ПрогнозРуб"
            }),
            currentField: GetSimpleIndicatorDataProvider({
                reportName: "ПродажиЧасть2",
                fieldName: "ФактРуб"
            }),
            fillRectColor: "#77933C",
            redirect: getKSPlanUrl({ indicator: salesReportParams.indicators.summ }),
            isCalendarMonthUse: isCalendarMonthUse,
        });
    }
    catch (ex) {
        console.log('Во время создания переменной planWaffleMoney произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);
    }

    try {
        var planWaffleWeight = waffleChartViewModel({
            planLabel: "план, кг",
            factLabel: "прогноз, кг",
            currentLabel: "текущее, %",
            indicatorName: "Прогноз выполнения плана по весу",
            planField: GetMonthDataProvider({
                reportName: "Продажи",
                fieldName: "ПланКг"
            }),
            factField: GetSimpleIndicatorDataProvider({
                reportName: "Продажи",
                fieldName: "ПрогнозКг"
            }),
            currentField: GetSimpleIndicatorDataProvider({
                reportName: "ПродажиЧасть2",
                fieldName: "ФактКг"
            }),
            fillRectColor: "#F79646",
            redirect: getKSPlanUrl({ indicator: salesReportParams.indicators.weight }),
            isCalendarMonthUse: isCalendarMonthUse,
        });
    }
    catch (ex) {
        console.log('Во время создания переменной planWaffleWeight произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

    }

    try {
        wigetsViewModels.add('planWaffleMoney', planWaffleMoney);
        wigetsViewModels.add('planWaffleWeight', planWaffleWeight);

    } catch (ex) {
        console.log('При добавлении моделей для WaffleChart произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

    }
}
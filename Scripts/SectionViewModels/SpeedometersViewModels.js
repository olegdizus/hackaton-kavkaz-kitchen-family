function createSpeedometersViewModels() {

    try {

        var markUpAllSpeedometer = speedometerViewModel({
            indicatorName: "Наценка Всего, %",
            footer: "среднее за последние 30 дней = ",
            currentValueField: GetSimpleIndicatorDataProvider({
                reportName: "Наценка",
                fieldName: "Итого"
            }),
            footerField: GetSimpleIndicatorDataProvider({
                reportName: "Наценка",
                fieldName: "СреднийПроцент"
            }),
            measure: "%",
            colorOpt: [
                {
                    procent: 10,
                    color: "rgb(255, 0, 0)"

                },
                {
                    procent: 10,
                    color: "rgb(255, 255, 0)"
                },
                {
                    procent: 30,
                    color: "rgb(82, 240, 55)"
                }
            ],
            redirect: getReportUrl("Показатели продаж", {
                indicator: salesReportParams.indicators.grossProfitCoef,
                grouping: salesReportParams.grouping.byMonth,
                fromSection: true
            })
        });
    } catch (ex) {
        console.log('Во время создания переменной markUpAllSpeedometer произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);
    }
    
    try {
        var returnsSpeedometer = speedometerViewModel({
            indicatorName: "Возврат, % от оборота за посл.30 дн.",
            footer: "",
            currentValueField: GetSimpleIndicatorDataProvider({
                reportName: "Продажи",
                fieldName: "ПроцентВозвратовОтОборота"
            }),
            footerField: GetSimpleIndicatorDataProvider({
                reportName: "Продажи",
                fieldName: "ПроцентВозвратовОтОборота"
            }),
            measure: "%",
            colorOpt: [
                {
                    procent: 0.5,
                    color: "rgb(82, 240, 55)"
                },
                {
                    procent: 0.5,
                    color: "rgb(255, 255, 0)"
                },
                {
                    procent: 3,
                    color: "rgb(255, 0, 0)"
                }
            ],
            redirect: getReportUrl("Отчет по периодам", {
                indicator: salesReportParams.indicators.summ,
                grouping: salesReportParams.grouping.byMonth
            })
        });
        
    } catch (ex) {
        console.log('Во время создания переменной returnsSpeedometer произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);
    }
    
    try {
        var dzSpeedometer = speedometerViewModel({
            indicatorName: "Просроченная ДЗ, %",
            footer: "ср. знач. за 30 дн. = ",
            currentValueField: GetSimpleIndicatorDataProvider({
                reportName: "ДЗ",
                fieldName: "ПроцентПросроченнойОтОбщей"
            }),
            footerField: GetSimpleIndicatorDataProvider({
                reportName: "ДЗ",
                fieldName: "ПроцентПросроченнойОтОбщейСреднееЗначение"
            }),
            measure: "%",
            colorOpt: [
                {
                    procent: 10,
                    color: "rgb(82, 240, 55)"
                },
                {
                    procent: 10,
                    color: "rgb(255, 255, 0)"
                },
                {
                    procent: 30,
                    color: "rgb(255, 0, 0)"
                }
            ],
            redirect: getReportUrl("Отчет по ДЗ")
        });
    } catch (ex) {
        console.log('Во время создания переменной dzSpeedometer произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);
    }
    
    wigetsViewModels.add('markUpAllSpeedometer', markUpAllSpeedometer);
    wigetsViewModels.add('returnsSpeedometer', returnsSpeedometer);
    wigetsViewModels.add('dzSpeedometer', dzSpeedometer);
}
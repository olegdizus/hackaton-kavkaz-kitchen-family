function createGraphicsViewModels() {
    try {
        var partOfReceivableDynamic = graphicViewModel({
            mainHeader: "Динамика доли просроченной ДЗ",
            dateOffset: {
                offset: -60,
                unit: 'day'
            },
            dataSet: [
                {
                    label: "Динамика доли просроченной ДЗ",
                    dataProvider: GetPlotDataProvider({
                        reportName: "ДЗ",
                        fieldName: "ПроцентПросроченнойОтОбщей",
                        measureCoof: 0.01
                    }),
                    redirect: getReportUrl("Отчет по ДЗ"),
                    color: "#2237D9"
                }
            ],
            rotateXaxesLabels: true,
            dateTickSize: [3, "day"],
            dateTimeFormat: "%d %b",
            yaxesFormat: "%"
        });
    } catch (ex) {
        console.log('Во время создания переменной partOfReceivableDynamic произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);
    }
    
    wigetsViewModels.add('partOfReceivableDynamic', partOfReceivableDynamic);

    try {
        var receivableDynamicGraphic = graphicViewModel({
            mainHeader: "Динамика просроченной ДЗ, т.руб",
            dateOffset: {
                offset: -60,
                unit: 'day'
            },
            dataSet: [
                {
                    label: "Просрочка сумма (общая)",
                    dataProvider: GetPlotDataProvider({
                        reportName: "ДЗ",
                        fieldName: "СуммаПросроченнойОбщая",
                        measureCoof: 0.001
                    }),
                    redirect: getReportUrl("Отчет по ДЗ"),
                    color: "#2237D9",
                },
                {
                    label: "Просрочка сумма (от 8 дней)",
                    dataProvider: GetPlotDataProvider({
                        reportName: "ДЗ",
                        fieldName: "СуммаПросроченнойОт8Дней",
                        measureCoof: 0.001
                    }),
                    redirect: getReportUrl("Отчет по ДЗ"),
                    color: "#000",
                }
            ],
            rotateXaxesLabels: true,
            dateTickSize: [3, "day"],
            dateTimeFormat: "%d %b"
        });
    } catch (ex) {
        console.log('Во время создания переменной receivableDynamicGraphic произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);
    }
    
    wigetsViewModels.add('receivableDynamicGraphic', receivableDynamicGraphic);

    try {
        var averageDayDeliveryDynamicGraphic = graphicViewModel({
            mainHeader: "Динамика среднеднего чека, руб",
            dateOffset: {
                offset: -41,
                unit: 'day'
            },
            dataSet: [
                {
                    label: "Динамика среднего чека, руб",
                    dataProvider: GetPlotDataProvider({
                        reportName: "Продажи",
                        fieldName: "Отгрузка",
                        measureCoof: 0.001
                    }),
                    redirect: getReportUrl("Отчет по периодам",
                        {
                            indicator: salesReportParams.indicators.weight,
                            fromSection: true
                        }),
                    color: "#2237D9"
                }
            ],
            rotateXaxesLabels: true,
            dateTickSize: [2, "day"],
            dateTimeFormat: "%d.%m.%y",
            showTrendline: true,
            showLegend: false,
            addHeight: 35
        });
    } catch (ex) {
        console.log('Во время создания переменной averageDayDeliveryDynamicGraphic произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);
    }
    
    wigetsViewModels.add('averageDayDeliveryDynamicGraphic', averageDayDeliveryDynamicGraphic);

    try {
        var avarageDayRevenueDynamic = graphicViewModel({
            mainHeader: "Динамика среднедневной выручки, руб",
            dateOffset: {
                offset: -41,
                unit: 'day'
            },
            dataSet: [
                {
                    label: "Динамика суммы заказов, руб",
                    dataProvider: GetPlotDataProvider({
                        reportName: "Продажи",
                        fieldName: "Выручка",
                        measureCoof: 0.001
                    }),
                    redirect: getReportUrl("Отчет по периодам",
                        {
                            indicator: salesReportParams.indicators.summ,
                            fromSection: true
                        }),
                    color: "#2237D9"
                }
            ],
            rotateXaxesLabels: true,
            dateTickSize: [2, "day"],
            dateTimeFormat: "%d.%m.%y",
            showTrendline: true,
            showLegend: false,
            addHeight: 35
        });
    } catch (ex) {
        console.log('Во время создания переменной avarageDayRevenueDynamic произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);
    }
    
    wigetsViewModels.add('avarageDayRevenueDynamic', avarageDayRevenueDynamic);

    try {
        var avarageDayGrossProfitDynamic = graphicViewModel({
            mainHeader: "Динамика количества заказов, шт",
            dateOffset: {
                offset: -41,
                unit: 'day'
            },
            dataSet: [
                {
                    label: "Динамика среднедневной ВП, руб",
                    dataProvider: GetPlotDataProvider({
                        reportName: "Продажи",
                        fieldName: "КоличествоОтгрузок"
                    }),
                    redirect: getReportUrl("Отчет по периодам",
                        {
                            indicator: salesReportParams.indicators.grossProfit,
                            fromSection: true
                        }),
                    color: "#2237D9"
                }
            ],
            rotateXaxesLabels: true,
            dateTickSize: [2, "day"],
            dateTimeFormat: "%d.%m.%y",
            showTrendline: true,
            showLegend: false,
            addHeight: 35
        });
    } catch (ex) {
        console.log('Во время создания переменной avarageDayGrossProfitDynamic произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);
    }
    
    wigetsViewModels.add('avarageDayGrossProfitDynamic', avarageDayGrossProfitDynamic);

    try {
        var weekSumDeliveryDynamicGraphic = graphicViewModel({
            mainHeader: "Динамика средненедельной отгрузки, тонн",
            dateOffset: {
                offset: -200,
                unit: 'day'
            },
            dataSet: [
                {
                    label: "Динамика средненедельной отгрузки, тонн",
                    dataProvider: GetPlotDataProvider({
                        reportName: "ПродажиЗаНеделю",
                        fieldName: "ВесВТоннах"
                    }),
                    redirect: getReportUrl("Отчет по периодам", {
                        indicator: salesReportParams.indicators.weight,
                        periodType: 1,
                        fromSection: true
                    }),
                    color: "#2237D9"
                }
            ],
            rotateXaxesLabels: true,
            dateTickSize: [7, "day"],
            dateTimeFormat: "%d.%m.%y",
            showTrendline: true,
            showLegend: false,
            addHeight: 35
        });
    } catch (ex) {
        console.log('Во время создания переменной weekSumDeliveryDynamicGraphic произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);
    }
    
    wigetsViewModels.add('weekSumDeliveryDynamicGraphic', weekSumDeliveryDynamicGraphic);

    try {
        var weekSumRevenueDynamic = graphicViewModel({
            mainHeader: "Динамика средненед. выручки, тыс.руб",
            dateOffset: {
                offset: -200,
                unit: 'day'
            },
            dataSet: [
                {
                    label: "Динамика средненедельной выручки, тыс.руб",
                    dataProvider: GetPlotDataProvider({
                        reportName: "ПродажиЗаНеделю",
                        fieldName: "СуммаТысячРублей"
                    }),
                    redirect: getReportUrl("Отчет по периодам", {
                        indicator: salesReportParams.indicators.summ,
                        periodType: 1,
                        fromSection: true
                    }),
                    color: "#2237D9"
                }
            ],
            rotateXaxesLabels: true,
            dateTickSize: [7, "day"],
            dateTimeFormat: "%d.%m.%y",
            showTrendline: true,
            showLegend: false,
            addHeight: 35
        }); 
    } catch (ex) {
        console.log('Во время создания переменной weekSumRevenueDynamic произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);
    }
    
    wigetsViewModels.add('weekSumRevenueDynamic', weekSumRevenueDynamic);

    try {
        var weekSumGrossProfitDynamic = graphicViewModel({
            mainHeader: "Динамика средненедельной ВП, тыс.руб",
            dateOffset: {
                offset: -200,
                unit: 'day'
            },
            dataSet: [
                {
                    label: "Динамика средненедельной ВП, тыс.руб",
                    dataProvider: GetPlotDataProvider({
                        reportName: "ПродажиЗаНеделю",
                        fieldName: "ВаловаяПрибыльТысячРублей"
                    }),
                    redirect: getReportUrl("Отчет по периодам", {
                        indicator: salesReportParams.indicators.grossProfit,
                        periodType: 1,
                        fromSection: true
                    }),
                    color: "#2237D9"
                }
            ],
            rotateXaxesLabels: true,
            dateTickSize: [7, "day"],
            dateTimeFormat: "%d.%m.%y",
            showTrendline: true,
            showLegend: false,
            addHeight: 35
        });
    } catch (ex) {
        console.log('Во время создания переменной weekSumGrossProfitDynamic произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);
    }
    
    wigetsViewModels.add('weekSumGrossProfitDynamic', weekSumGrossProfitDynamic);

    try {
        var returnsByMonthssGraphic = graphicViewModel({
            mainHeader: "",
            dateOffset: {
                offset: -9,
                unit: 'month'
            },
            dataSet: [
                {
                    label: "Отгрузки, тыс. руб",
                    dataProvider: GetPlotDataProvider({
                        reportName: "ВозвратыЗаМесяц",
                        fieldName: "Продажи"
                    }),
                    color: "#2237D9",
                    redirect: getReportUrl("Показатели продаж", {
                        indicator: salesReportParams.indicators.summ,
                        grouping: salesReportParams.grouping.byMonth,
                        fromSection: true
                    }),
                    yaxis: 1,
                },
                {
                    label: "Возвраты, тыс. руб",
                    dataProvider: GetPlotDataProvider({
                        reportName: "ВозвратыЗаМесяц",
                        fieldName: "Возврат"
                    }),
                    color: "#000",
                    redirect: getReportUrl("Показатели продаж", {
                        indicator: salesReportParams.indicators.summ,
                        grouping: salesReportParams.grouping.byMonth,
                        fromSection: true
                    }),
                    yaxis: 2,
                }
            ],
            rotateXaxesLabels: true,
            dateTickSize: [1, "month"],
            dateTimeFormat: "%b.%y",
            displayYAsixLabel: true,
        });
    } catch (ex) {
        console.log('Во время создания переменной returnsByMonthssGraphic произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);
    }
    
    wigetsViewModels.add('returnsByMonthssGraphic', returnsByMonthssGraphic);

    try {
        var grossProfitByMonthssGraphic = graphicViewModel({
            mainHeader: "Динамика ВП по месяцам*, тыс. руб",
            dateOffset: {
                offset: -9,
                unit: 'month'
            },
            dataSet: [
                {
                    dataProvider: GetPlotDataProvider({
                        reportName: "ВПЗаМесяц",
                        fieldName: "СуммаРублей"
                    }),
                    color: "#2237D9",
                    redirect: getReportUrl("Отчет по периодам", {
                        indicator: salesReportParams.indicators.grossProfit,
                        fromSection: true,
                        grouping: salesReportParams.grouping.byMonth,
                        
                    }),
                }
            ],
            rotateXaxesLabels: true,
            dateTickSize: [1, "month"],
            dateTimeFormat: "%b.%y",
        });
    } catch (ex) {
        console.log('Во время создания переменной grossProfitByMonthssGraphic произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);
    }
    
    wigetsViewModels.add('grossProfitByMonthssGraphic', grossProfitByMonthssGraphic);

    try {
        var salesDynamic = graphicViewModel({
            mainHeader: "Динамика продаж по месяцам (текущий месяц ожидаемо)",
            dateOffset: {
                offset: -15,
                unit: 'month'
            },
            dataSet: [
            {
                label: "Вес т.",
                dataProvider: GetPlotDataProvider({
                    reportName: "ПродажиЗаМесяц",
                    fieldName: "ВесВТоннах",
                    childDataProvider: GetSimpleIndicatorDataProvider({
                        reportName: "Продажи",
                        fieldName: "ПрогнозКг",
                        measureCoof: 0.001
                    })
                }),
                redirect: getReportUrl("Показатели продаж", {
                    indicator: salesReportParams.indicators.weight,
                    grouping: salesReportParams.grouping.byMonth,
                    fromSection: true
                }),
                color: "#2237D9",
                yaxis: 1,
            },
            {
                label: "Сумма т.р",
                dataProvider: GetPlotDataProvider({
                    reportName: "ПродажиЗаМесяц",
                    fieldName: "СуммаТысячРублей",
                    childDataProvider: GetSimpleIndicatorDataProvider({
                        reportName: "Продажи",
                        fieldName: "ПрогнозРуб",
                        measureCoof: 0.001
                    })
                }),
                redirect: getReportUrl("Показатели продаж", {
                    indicator: salesReportParams.indicators.summ,
                    grouping: salesReportParams.grouping.byMonth,
                    fromSection: true
                }),
                color: "#000",
                yaxis: 2,
            }
            ],
            rotateXaxesLabels: true,
            dateTickSize: [1, "month"],
            dateTimeFormat: "%b.%y",
            displayYAsixLabel: true,
        });
    } catch (ex) {
        console.log('Во время создания переменной salesDynamic произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);
    }
    

    wigetsViewModels.add('salesDynamic', salesDynamic);
    
}
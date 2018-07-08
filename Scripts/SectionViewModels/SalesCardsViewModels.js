function createSalesCardsViewModels() {
    try {
        function wrapperDateOffset(options) {
            return {
                getOffset: function (date) {
                    try {
                        var dateOffset = new Date(date).setDate(date.getDate() + options.dateOffset);

                        var dateOffsetDate = new Date(dateOffset);

                        dataLoader.checkDataAndLoad(dateOffsetDate, date);


                        return options.provider.getValue(dateOffset);
                    } catch (ex) {
                        console.log('Во вызова функции getOffset объекта wrapperDateOffset произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

                    }

                }
            }
        }

        var salesDataProvider = GetSimpleIndicatorDataProvider({
            reportName: "Продажи",
            fieldName: "Отгрузка"
        });

        var salesIndicator = salesCardViewModel({

            dataProvider: salesDataProvider,
            mainIndicatorName: "Средний чек",
            colorIndicator: "#66334B",
            indicatorTableNameUnitOfMeasurement: "руб",
            secondIndicators: [
                {
                    indicatorName: "рост к пред. дню",
                    dateOffsetFunc: wrapperDateOffset({
                        provider: salesDataProvider,
                        dateOffset: -1
                    }),
                    redirect: getReportUrl("Показатели продаж", {
                        indicator: salesIndicatorReportFields.weightWithPrevDay,
                    })
                },
                {
                    indicatorName: "к аналог. дню пред нед.",
                    dateOffsetFunc: wrapperDateOffset({
                        provider: salesDataProvider,
                        dateOffset: -7
                    }),
                    redirect: getReportUrl("Показатели продаж", {
                        indicator: salesIndicatorReportFields.weightWithPrevWeek,
                    })
                }
            ],
            redirect: getReportUrl("Показатели продаж", {
                indicator: salesIndicatorReportFields.weight,
                fromSection:true
            })
        });

        var deliveryCountDataProvider = GetSimpleIndicatorDataProvider({
            reportName: "Продажи",
            fieldName: "КоличествоОтгрузок"
        });

        var deliveryCountIndicator = salesCardViewModel({
            dataProvider: deliveryCountDataProvider,
            colorIndicator: "#66334B",
            mainIndicatorName: "Кол-во заказов",
            indicatorTableNameUnitOfMeasurement: "кол-во",
            secondIndicators: [
                {
                    indicatorName: "рост к пред. дню",
                    dateOffsetFunc: wrapperDateOffset({
                        provider: deliveryCountDataProvider,
                        dateOffset: -1
                    }),
                    redirect: getReportUrl("Показатели продаж")
                },
                {
                    indicatorName: "к аналог. дню пред нед.",
                    dateOffsetFunc: wrapperDateOffset({
                        provider: deliveryCountDataProvider,
                        dateOffset: -7
                    }),
                    redirect: getReportUrl("Показатели продаж")
                }
            ],
            redirect: getReportUrl("Показатели продаж",
                {
                    indicator: salesIndicatorReportFields.deliveryCount,
                    fromSection:true
                })
        });



        var totalMoneyDataProvider = GetSimpleIndicatorDataProvider({
            reportName: "Продажи",
            fieldName: "Выручка"
        });

        var totalMoneyIndicator = salesCardViewModel({
            colorIndicator: "#66334B",
            dataProvider: totalMoneyDataProvider,
            mainIndicatorName: "Сумма заказов",
            indicatorTableNameUnitOfMeasurement: "руб",
            secondIndicators: [
                {
                    indicatorName: "рост к пред. дню",
                    dateOffsetFunc: wrapperDateOffset({
                        provider: totalMoneyDataProvider,
                        dateOffset: -1
                    }),
                    redirect: getReportUrl("Показатели продаж", {
                        indicator: salesIndicatorReportFields.deliverySumWithPrevDay,
                    })
                },
                {
                    indicatorName: "к аналог. дню пред нед.",
                    dateOffsetFunc: wrapperDateOffset({
                        provider: totalMoneyDataProvider,
                        dateOffset: -7
                    }),
                    redirect: getReportUrl("Показатели продаж", {
                        indicator: salesIndicatorReportFields.deliverySumWithPrevWeek,
                    })
                }
            ],
            redirect: getReportUrl("Показатели продаж", {
                indicator: salesIndicatorReportFields.SumPrice,
                fromSection:true
            })
        });

      




       

        wigetsViewModels.add('salesIndicator', salesIndicator);
        wigetsViewModels.add('deliveryCountIndicator', deliveryCountIndicator);
        wigetsViewModels.add('totalMoneyIndicator', totalMoneyIndicator);

    } catch (ex) {
        console.log('Во вызова функции createSalesCardsViewModels произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

    }
}

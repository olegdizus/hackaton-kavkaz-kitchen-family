function createReceivableCardsViewModels() {
    try {
        var allReceivableIndicator = receivableCardViewModel({
            dataProvider: GetSimpleIndicatorDataProvider({
                reportName: "ДЗ",
                fieldName: "ОбщаяЗадолженность"
            }),
            secondDataProvider: GetSimpleIndicatorDataProvider({
                reportName: "ДЗ",
                fieldName: "ОбщаяЗадолженностьСреднееЗначение"
            }),
            mainIndicatorName: "ДЗ, руб",
            secondInicatorName: "Ср.знач за 30 дн",
            valuesFormat: "numericText",
            mainIndicatorRedirect: getReportUrl("Отчет по ДЗ"),
            secondIndicatorRedirect: getReportUrl("Отчет по ДЗ")
        });
    } catch (ex) {
        console.log('Во создания переменной allReceivableIndicator произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

    }

    try {
        var delayReceivableIndicator = receivableCardViewModel({
            dataProvider: GetSimpleIndicatorDataProvider({
                reportName: "ДЗ",
                fieldName: "СуммаПросроченнойОбщая"
            }),
            secondDataProvider: GetSimpleIndicatorDataProvider({
                reportName: "ДЗ",
                fieldName: "СуммаПросроченнойОбщаяСреднееЗначение"
            }),
            mainIndicatorName: "Просроч. ДЗ, руб",
            secondInicatorName: "Ср.знач за 30 дн",
            valuesFormat: "numericText",
            mainIndicatorRedirect: getReportUrl("Отчет по ДЗ"),
            secondIndicatorRedirect: getReportUrl("Отчет по ДЗ")
        });
    } catch (ex) {
        console.log('Во создания переменной delayReceivableIndicator произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

    }

    try {
        var coefficientReceivableIndicator = receivableCardViewModel({
            dataProvider: GetSimpleIndicatorDataProvider({
                reportName: "ДЗ",
                fieldName: "КонечныйОстаток"
            }),
            secondDataProvider: GetSimpleIndicatorDataProvider({
                reportName: "ДЗ",
                fieldName: "КонечныйОстатокСреднееЗначение"
            }),
            mainIndicatorName: "Коэф. ДЗ",
            secondInicatorName: "Ср.знач за 30 дн",
            valuesFormat: "numericText",
            formatPrecision: 2,
            mainIndicatorRedirect: getReportUrl("Отчет по ДЗ"),
            secondIndicatorRedirect: getReportUrl("Отчет по ДЗ")
        });
    } catch (ex) {
        console.log('Во создания переменной coefficientReceivableIndicator произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

    }

    try {
        var delayReceivablePercentageIndicator = receivableCardViewModel({
            dataProvider: GetSimpleIndicatorDataProvider({
                reportName: "ДЗ",
                fieldName: "ПроцентПросроченнойОтОбщей"
            }),
            secondDataProvider: GetSimpleIndicatorDataProvider({
                reportName: "ДЗ",
                fieldName: "ПроцентПросроченнойОтОбщейСреднееЗначение"
            }),
            mainIndicatorName: "% просроч. ДЗ",
            secondInicatorName: "Ср.знач за 30 дн",
            secondIndictorFieldName: "debitAverPercentOverdueToOverall",
            valuesFormat: "percentageDiv100",
            formatPrecision: 1,
            mainIndicatorRedirect: getReportUrl("Отчет по ДЗ"),
            secondIndicatorRedirect: getReportUrl("Отчет по ДЗ")
        });
    } catch (ex) {
        console.log('Во создания переменной delayReceivablePercentageIndicator произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

    }

    try {
        wigetsViewModels.add('allReceivableIndicator', allReceivableIndicator);
        wigetsViewModels.add('delayReceivableIndicator', delayReceivableIndicator);
        wigetsViewModels.add('coefficientReceivableIndicator', coefficientReceivableIndicator);
        wigetsViewModels.add('delayReceivablePercentageIndicator', delayReceivablePercentageIndicator);
    }
    catch (ex) {
        console.log('В функции createReceivableCardsViewModels при добавлении моделей произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

    }


}
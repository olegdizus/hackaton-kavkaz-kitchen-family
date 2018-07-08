function createPieCharts() {

    try {
        var reasonsOfReturnsPieChart = pieChartViewModel({
            dataProvider: GetPieChartDataProvider({
                reportName: "ПричиныВозвратов"
            }),
            redirect: getReportUrl("Тест"),
            title: "Структура возвратов за посл. 30 дн."
        });

    
    } catch (ex) {
        console.log('Во создания переменной reasonsOfReturnsPieChart произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

    }

    try {
        wigetsViewModels.add("reasonsOfReturnsPieChart", reasonsOfReturnsPieChart);
    } catch (ex) {
        console.log('При добавлении моделей PieCharts произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

    }
}
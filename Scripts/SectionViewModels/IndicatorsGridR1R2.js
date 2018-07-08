function CreateIndicatorsGrid(indicatorsTableUrl, user) {

    var fields = {
        name: { type: "string" },
        Manager: { type: "string" },
        r1: { type: "number", format: "{0:n3}" },
        r2: { type: "number", format: "{0:n3}" },
        planWeight: { type: "number", aggregate: "sum" },
        planDeliveryCount: { type: "number", aggregate: "sum" },
        deliveryCount: { type: "number", aggregate: "sum" },
        deliveryEffectiveCount: { type: "number", aggregate: "sum" }
    };

    var dataSource = new kendo.data.DataSource({
        type: "json",
        transport: {
            read: {
                url: indicatorsTableUrl,
                dataType: "json",
                type: 'post',
                data: {
                    datarange_id: $('#datarange_id').attr('value'),
                    User: user
                },
            },
        },
        schema: {
            model: {
                fields: fields
            }
        },
        aggregate: [
            { field: "planWeight", aggregate: "sum" },
            { field: "planDeliveryCount", aggregate: "sum" },
            { field: "deliveryCount", aggregate: "sum" },
            { field: "deliveryEffectiveCount", aggregate: "sum" },
            { field: "r1", aggregate: "average" },
            { field: "r2", aggregate: "average" },
            { field: "r3", aggregate: "average" }
        ],
        pageSize: 20
    });

    var height = $(window).height();

    $("#indicatorsGrid").kendoGrid({
        dataSource: dataSource,
        height: height,
        scrollable: true,
        sortable: true,
        pageable: true,
        filterable: kendo.LocalizeFilters(),
        columns: [
            { field: "name", title: "<div><div onclick='GetIndicatorsExcel()' id='excelReport'></div>Контакт</div>", footerTemplate: "Итого" },
            { field: "Manager", title: "Менеджер" },
            {
                field: "planDeliveryCount", title: "Количество <br> плановых отгрузок", width: "10%",
                aggregates: ["sum"],
                footerTemplate: "#=sum#"
            },
            {
                field: "planWeight", title: "Плановый <br> вес", width: "10%",
                agregates: ["sum"],
                footerTemplate: "#=sum#"
            },
            {
                field: "deliveryCount", title: "Количество <br> отгрузок", width: "10%",
                agregates: ["sum"],
                footerTemplate: "#=sum#"
            },
            {
                field: "deliveryEffectiveCount", title: "Количество <br> эффективных <br> отгрузок", width: "10%",
                agregates: ["sum"],
                footerTemplate: "#=sum#"
            },
            {
                field: "r1", title: "R1", width: "10%",
                agregates: ["average"],
                footerTemplate: "#=parseFloat(Math.round(average * 100) / 100).toFixed(2)#"
            },
            {
                field: "r2", title: "R2", width: "10%",
                agregates: ["average"],
                footerTemplate: "#=parseFloat(Math.round(average * 100) / 100).toFixed(2)#"
            },
            {
                field: "r3", title: "R3", width: "10%",
                agregates: ["average"],
                footerTemplate: "#=parseFloat(Math.round(average * 100) / 100).toFixed(2)#"
            },
            {
                field: "PlanDaysCount", title: "Плановая кратность отгрузки", width: "10%",
                agregates: ["sum"],
                footerTemplate: "#=sum#"
            },
            {
                field: "PercentReturnFromDelivery", title: "% возвратов от оборота", width: "10%",
                agregates: ["average"],
                footerTemplate: "#=parseFloat(Math.round(average * 100) / 100).toFixed(2)#"
            },
            {
                field: "Profitability", title: "Рентабельность", width: "10%",
                agregates: ["average"],
                footerTemplate: "#=parseFloat(Math.round(average * 100) / 100).toFixed(2)#"
            },
            {
                field: "ProfitabilityPlan", title: "Рентабельность по плановой цене", width: "10%",
                agregates: ["average"],
                footerTemplate: "#=parseFloat(Math.round(average * 100) / 100).toFixed(2)#"
            },
            {
                field: "ReturnLimit", title: "Лимит возвратов, руб", width: "10%",
                agregates: ["average"],
                footerTemplate: "#=parseFloat(Math.round(average * 100) / 100).toFixed(2)#"
            },
            {
                field: "ExceedingReturnLimit", title: "Превышение лимита возвратов, руб", width: "10%",
                agregates: ["average"],
                footerTemplate: "#=parseFloat(Math.round(average * 100) / 100).toFixed(2)#"
            },
            {
                field: "ContactSalarySales", title: "Зарплата отдела продаж (на точку), руб", width: "10%",
                agregates: ["average"],
                footerTemplate: "#=parseFloat(Math.round(average * 100) / 100).toFixed(2)#"
            },
            {
                field: "ContactCruiseCost", title: "Стоимость доставки (на точку), руб", width: "10%",
                agregates: ["average"],
                footerTemplate: "#=parseFloat(Math.round(average * 100) / 100).toFixed(2)#"
            },
            {
                field: "ContactExpenses", title: "Расходы (на точку), руб", width: "10%",
                agregates: ["average"],
                footerTemplate: "#=parseFloat(Math.round(average * 100) / 100).toFixed(2)#"
            },
            {
                field: "Earnings", title: "Доходы (на точку), руб", width: "10%",
                agregates: ["average"],
                footerTemplate: "#=parseFloat(Math.round(average * 100) / 100).toFixed(2)#"
            }


        ]
    });
}
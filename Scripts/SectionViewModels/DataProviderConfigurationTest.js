
function GetDataAdapter(reportName, fieldName, childDataProvider) {

    var reportConfigDemo =
    {
        "Наценка":
        {
            "Дата":
            {
                ar: nacenka,
                field: "month"
            },
            "Итого":
            {
                ar: nacenka,
                field: "itog"
            },
            "СреднийПроцент":
            {
                ar: nacenka,
                field: "proc"
            }
        },

        "Продажи":
        {
            "Дата": {
                ar: salesData,
                field: "Day"
            },
            "Отгрузка": {
                ar: salesData,
                field: "Delivery"
            },
            "СредняяОтгрузкаКг": {
                ar: salesData,
                field: "AvDelKg"
            },
            "СредняяОтгрузкаРуб": {
                ar: salesData,
                field: "AvDelRub"
            },
            "КоличествоОтгрузок": {
                ar: salesData,
                field: "DelCount"
            },
            "Выручка": {
                ar: salesData,
                field: "money"
            },
            "ПрогнозКг": {
                ar: salesData,
                field: "prognozKg"
            },
            "ПрогнозРуб": {
                ar: salesData,
                field: "prognozRub"
            },
            "ПланКг": {
                ar: salesData,
                field: "planKg"
            },
            "ФактКг": {
                ar: salesData,
                field: "nakopitelnoFactKg"
            },
            "ПланРуб": {
                ar: salesData,
                field: "planRub"
            },
            "ФактРуб": {
                ar: salesData,
                field: "nakopitelnoFactRub"
            }
        },

        "ДЗ":
        {
            "Дата": {
                ar: receivable,
                field: "day"
            },
            "ОбщаяЗадолженность": {
                ar: receivable,
                field: "dolgKonec"
            },
            "КонечныйОстаток": {
                ar: receivable,
                field: "ostatocDelKonec"
            },
            "ПроцентПросроченнойОтОбщей": {
                ar: receivable,
                field: "procProsrochOtObsch"
            },
            "СуммаПросроченнойОбщая": {
                ar: receivable,
                field: "summaProsroch"
            },
            "СуммаПросроченнойОт8Дней": {
                ar: receivable,
                field: "summaProsroch8Days"
            }
        },

        "ВозвратыЗаМесяц":
        {
            "Дата": {
                ar: returnsByMonth,
                field: "month"
            },
            "Продажи": {
                ar: returnsByMonth,
                field: "sell"
            },
            "Возврат": {
                ar: returnsByMonth,
                field: "back"
            }
        },

        "ПричиныВозвратов":
        {
            "Дата": {
                ar: reasonOfReturns,
                field: "day"
            }
        },

        "ПродажиЗаМесяц":
        {
            "Дата": {
                ar: salesDynamicData,
                field: "month"
            },
            "ВесВТоннах": {
                ar: salesDynamicData,
                field: "weightT"
            },
            "СуммаТысячРублей": {
                ar: salesDynamicData,
                field: "summaKRub"
            }
        }
    };

    var reportFields = reportConfigDemo[reportName];

    if (fieldName == undefined) {
        return dataProvider(
            reportFields["Дата"].ar,
            reportFields["Дата"].field);
    } else {
        return dataProvider(
            reportFields[fieldName].ar,
            reportFields["Дата"].field,
            reportFields[fieldName].field,
            childDataProvider);
    }

}
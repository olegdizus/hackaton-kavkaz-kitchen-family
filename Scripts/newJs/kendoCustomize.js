kendo.LocalizeFilters = function() {
    return {
        messages: {
            info: "Фильтрация:", // sets the text on top of the filter menu
            filter: "Ок", // sets the text for the "Filter" button
            clear: "Очистить", // sets the text for the "Clear" button

            // when filtering boolean numbers
            isTrue: "Да", // sets the text for "isTrue" radio button
            isFalse: "Нет", // sets the text for "isFalse" radio button

            //changes the text of the "And" and "Or" of the filter menu
            and: "И",
            or: "Или"
        },
        operators: {
            //filter menu for "string" type columns
            string: {
                eq: "Равно",
                neq: "Не равно",
                startswith: "Начинается с",
                contains: "Содержит",
                endswith: "Заканчивается на"
            },
            //filter menu for "number" type columns
            number: {
                eq: "Равно",
                neq: "Не равно",
                gte: "Больше или равно",
                gt: "Больше",
                lte: "Меньше или равно",
                lt: "Меньше"
            },
            //filter menu for "date" type columns
            date: {
                eq: "Равно",
                neq: "Не равно",
                gte: "Больше или равно",
                gt: "Больше",
                lte: "Меньше или равно",
                lt: "Меньше"
            },
            //filter menu for foreign key values
            enums: {
                eq: "Равно",
                neq: "Не равно"
            }
        }
    };
};


kendo.valueToString = function(value) {
    return value ? kendo.toString(value, "n0") : "";
};

kendo.valueToFooterString = function (value) {
    return value ? kendo.toString(value, "n0") : "0";
};

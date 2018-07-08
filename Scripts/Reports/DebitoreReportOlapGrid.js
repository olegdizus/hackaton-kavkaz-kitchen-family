function CreateDebitoreReportGridOlap(grid, options) {

    $(".datepicker").datepicker({
        language: 'ru',
        autoclose: true,
        todayHighlight: true
    });

    var gridColumnsAndGroups = {
        get: function() {
            var valueCols = [
                {
                    field: 'groupId',
                    title: 'Номер документа',
                    aggregates: ['sum'],
                    groupingField: true,
                    hidden: true,
                    SelectAble: false
                },
                {
                    field: 'FullDebitore',
                    title: 'Общий долг, руб',
                    customFormat: 'currency',
                    aggregates: ['sum'],
                    groupingField: false
                },
                {
                    field: 'LimitDebitore',
                    title: 'Лимит сумма, руб',
                    customFormat: 'currency',
                    aggregates: ['sum'],
                    groupingField: false
                },
                {
                    field: 'DebitoreOwed',
                    title: 'Просроченный долг, руб',
                    customFormat: 'currency',
                    aggregates: ['sum'],
                    groupingField: false
                },
                {
                    field: 'Debitore7Days',
                    title: 'До 7 дней, руб',
                    customFormat: 'currency',
                    aggregates: ['sum'],
                    groupingField: false
                },
                {
                    field: 'Debitore14Days',
                    title: 'От 8 до 14 дней, руб',
                    customFormat: 'currency',
                    aggregates: ['sum'],
                    groupingField: false
                },
                {
                    field: 'Debitore21Days',
                    title: 'От 15 до 21 дней, руб',
                    customFormat: 'currency',
                    aggregates: ['sum'],
                    groupingField: false
                },
                {
                    field: 'Debitore28Days',
                    title: 'От 22 до 28 дней, руб',
                    customFormat: 'currency',
                    aggregates: ['sum'],
                    //footerTemplate: "#=round(sum)#",
                    groupingField: false
                },
                {
                    field: 'DebitoreMoreThen28Days',
                    title: 'От 29 дней, руб',
                    customFormat: 'currency',
                    aggregates: ['sum'],
                    groupingField: false
                }
            ];

            setColumnFormat(valueCols);

            var hierarchyCols = GetDebitoreHierarchyFields();

            var columns = [
                {
                    field: 'Contact_Document',
                    title: 'Документ',
                    Detail: true
                }
            ];
            columns = columns.concat(
                    hierarchyCols
                    .concat(valueCols));

            var sumAggregates =
                getAggregatesByColumn(columns);

            var groupFields = getGroupFields(hierarchyCols, sumAggregates);

            return {
                groupFields: groupFields,
                columns: columns,
                sumAggregates: sumAggregates
            }
        }
    }

    var gridBuider = new KendoGridBuider(getGridOption());
    gridBuider.buid();

    function getGridOption() {

        var fields = {};

        return {
            gridDiv: grid,
            getDataSource: function (contacts) {
                var AddContactAttributesToElementaryItem = function (items) {
                }

                return KendoDebitoreDataSource.GetDataSource
                (
                    
                    options.contactGridUrl,
                    options.agreementAndDocumentUrl,
                    fields,
                    gridColumnsAndGroups.get().groupFields,
                    gridColumnsAndGroups.get().sumAggregates,
                    AddContactAttributesToElementaryItem,
                    options.elementaryKeyField,
                    options.filters,
                    null,
                    null,
                    grid
                );
            },
            columns: gridColumnsAndGroups.get().columns,
            loadHierarchyAndBuid: LoadContactsHierarchy,
            onBuilding: options.onBuilding,
            onBuilded: options.onBuilded
        }

    }

    return {
        getGridOption: getGridOption
    };
}
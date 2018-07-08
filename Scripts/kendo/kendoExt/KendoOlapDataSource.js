var KendoOlapDataSource = {};

KendoOlapDataSource.GetDataSource = function (
    url,
    fields,
    groupFields,
    sumAggregates,
    parseElementaryItem,
    elementaryKeyField,
    filters,
    measures,
    sortField
)
{
    var getFilters = function (groups, elementaryKeyField, filters, item) {

        var rfilters = UniqueUnionObject(getDates(), filters);

        KendoOlapDataSource.AddGroupsFilters(rfilters, groups, elementaryKeyField, item, measures, sortField);


        return rfilters;
    };

    filters = getFilters(groupFields, elementaryKeyField, filters);

    var dataSource = new kendo.data.DataSource({
        type: "aspnetmvc-ajax",
        schema: {
            model: {
                fields: fields
            },
            groups: function (data) {
                data = ReduceInputDataToMaxRowCount(data);

                return data;
            },
            parse: function (data) {
                //dataBind и dataBound вызываются 2 раза. До запроса данных с сервера и после
                dataSource.oldData = false;

                if (dataSource.parseReponse) {
                    dataSource.parseReponse(data);
                }

                for (var i = 0; i < data.length; i++) {
                    if (data[i].value == "All") {
                        dataSource.All = data[i];

                        data.splice(i, 1);
                    }
                }

                data = ReduceInputDataToMaxRowCount(data);

                KendoPlugins.sortGroupByAggregatesValueDS(dataSource, data);

                return data;
            }
        },
        transport: {
            read: {
                url: url,
                dataType: "json",
                type: "POST",
                data: function () {
                    //dataBind и dataBound вызываются 2 раза. До запроса данных с сервера и после
                    dataSource.oldData = true;

                    return dataSource.GetFilters();
                }
            }
        },
        serverSorting: true,//Костыль, чтобы стандартная сортировка на клиенте не выполнялась. Сортировка выполняется на клиенте методом sortGroupByAggregatesValueDS.
        serverGrouping: true,
        group: groupFields,
        aggregate: sumAggregates,
        sort: sortField
    });

    function A(e, t) {
        return new A.fn.init(e, t);
    }



    dataSource.__proto__.query =
        function (n) {
            var t;

            var i, r = this.options.serverSorting || this.options.serverPaging || this.options.serverFiltering || this.options.serverGrouping || this.options.serverAggregates;
            r = n.sort == this._sort;

            if (r || (this._data === t || 0 === this._data.length) && !this._destroyed.length) {
                return this.read(this._mergeState(n));
            } else {
                if (!this.trigger("requestStart", { type: "read" })) {
                    this.trigger("progress");
                    i = this._queryProcess(this._data, this._mergeState(n));
                    this.options.serverFiltering || (this._total = i.total !== t ? i.total : this._data.length);
                    this._aggregateResult = this._calculateAggregates(this._data, n);
                    //this.view(i.data);

                    KendoPlugins.sortGroupByAggregatesValueDS(this);

                    this.trigger("requestEnd", {});
                    this.trigger("change", {
                        items: i.data
                    });
                }

                return window.kendo.jQuery.Deferred().resolve().promise();
            }
        };


    dataSource.elementaryKeyField = elementaryKeyField;
    dataSource.parentFilters = filters;

    dataSource._allGroup = groupFields;

    dataSource.GetFilters = function (item) {
        return getFilters(this._group, this.elementaryKeyField, this.parentFilters, item);
    }; 

    dataSource.parseElementaryItem = parseElementaryItem;

    dataSource.GetSubGroups = function (filters) {

        var groupItems = [];

        $.ajax({
            url: url,
            type: 'POST',
            async: false,
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(filters),
            success: function (data) {

                data = ReduceInputDataToMaxRowCount(data);

                if (dataSource.parseReponse) {
                    dataSource.parseReponse(data);
                }



                groupItems = data;
            },
            error: function (e, e2, e3) {
                console.log("Error!!!");
                console.log(e);
                console.log(e2);
                console.log(e3);
            }
        });

        return groupItems;
    };

    return dataSource;

};

KendoOlapDataSource.AddGroupsFilters = function (filters, groups, elementaryKeyField, item, measures, sortField) {

    var defaultLevel = 0;

    var nextLevel = item ? (item.level + 1) : defaultLevel;

    filters.selectGroup = nextLevel < groups.length
        ? { field: groups[nextLevel].field, dir: groups[nextLevel].dir }
        : { field: elementaryKeyField };

    if (measures && measures.length > 0) {
        filters.measures = measures;
    }

    var groupIds = [];

    if (item) {

        if (item.field) {
            var parentItem = item;
            do {
                groupIds.push({
                    field: parentItem.field,
                    value: parentItem.value,
                    id: item.aggregates.groupId
                });
                parentItem = parentItem.parent;

            } while (parentItem);

            groupIds = groupIds.reverse();


        } else {
            groupIds.push({
                field: elementaryKeyField,
                value: item[elementaryKeyField],
                id: item.aggregates.groupId
            });
        }

        filters.groupIds = filters.groupIds ? filters.groupIds.concat(groupIds) : groupIds;

        filters.sortBy = sortField == undefined ? "" : sortField;
    }
};

function ReduceInputDataToMaxRowCount(data) {
    var rowsCount = 0;

    for (var i = 0; i < data.length; i++) {
        if (data[i].value == "RowCount") {
            rowsCount = data[i].valueValue;

            data.splice(i, 1);
        }
    }
    var maxRowCount = 4000;

    if (data.length > maxRowCount) {

        data = data.splice(0, maxRowCount);

        console.log('В результате запроса пришло ' + rowsCount + ' строк. Сократили количество записей до ' + maxRowCount);
    }

    return data;
}

//function UniqueUnionArray(a, b) {
//
//    if (!a)
//        return b;
//    if (!b)
//        return a;
//
//    var c = a.concat(b.filter(function (item) {
//        return a.indexOf(item) < 0;
//    }));
//
//    return c;
//}

//function GroupsNotInFilters(groups, ids) {
//    var groupsInFilters = [];
//
//    if (ids) {
//
//        for (var j = 0; j < groups.length; j++) {
//
//            var groupField = groups[j].field;
//            var isAdd = true;
//            for (var i = 0; i < ids.length; i++) {
//
//                if (groupField == ids[i].field) {
//                    isAdd = false;
//                    break;
//                }
//            }
//
//            if (isAdd)
//                groupsInFilters.push(groups[j]);
//        }
//    }
//
//    return groupsInFilters;
//}
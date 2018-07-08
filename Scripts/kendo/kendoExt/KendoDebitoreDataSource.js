
var KendoDebitoreDataSource = {
    KendoOlapDataSource: KendoOlapDataSource,
    localContragent: null,
    kendoGridName: "#Grid",
    currentData: null,
    mdxHierarhyAlias: {
        Contact_FirstLevel: "FirstLevel",
        Contact_SecondLevel: "SecondLevel",
        Contact_ThirdLevel: "ThirdLevel",
        Contact_MainManager: "MainManager",
        Contact_Manager: "Manager",
        Contact_Region: "Region",
        Contact_name: "ContragentName",
        Contact_Agreement: "DocumentName",
    },
    filterAlias: {
        InTime: "LimitDebitore",
        Less7Days: "Debitore7Days",
        for8to14Days: "Debitore14Days",
        for15to21Days: "Debitore21Days",
        for22to28Days: "Debitore28Days",
        More29Days: "DebitoreMoreThen28Days"
    },

    aggregateColumnNames: ["FullDebitore", "LimitDebitore", "DebitoreOwed", "Debitore7Days", "Debitore14Days", "Debitore21Days", "Debitore28Days", "DebitoreMoreThen28Days"],

    

    expiredPeriods: [],

    

    isInValidContragentByHierarhy: function (contragent, groupIds) {

        if (groupIds) {
            for (var idxn in groupIds) {
                var groupId = groupIds[idxn];
                var groupField = groupId.field;

                var groupAlias = this.mdxHierarhyAlias[groupField];

                if (contragent[groupAlias] != groupId.value) {
                    return true;
                }
            }
        }
        return false;
    },

    findDocumentGroup: function (documentsGroups, contragent, levelGroupingFieldName) {

        var findFieldContragent = contragent[levelGroupingFieldName];

        var targetRecord = null;

        for (var j in documentsGroups) {
            
            if (documentsGroups[j].name == findFieldContragent) {
                targetRecord = documentsGroups[j];
                break;
            }
        }

        return targetRecord;
    },

    addDocumentToGroup: function (targetRecord, contragent) {

        targetRecord.groupId = contragent.groupId;
        var aggregatesSource = targetRecord.aggregates;

        for (var field in aggregatesSource) {
            aggregatesSource[field].sum += contragent[field];
        }
    },

    

    createDocumentGroup: function (contragent, levelGroupingFieldName) {
        var documentGroup = {
            name: contragent[levelGroupingFieldName],
            groupId: contragent.groupId,
            aggregates:{}
        };
        

        var aggregatesSource = documentGroup.aggregates;

        for (var index in this.aggregateColumnNames) {
            var field = this.aggregateColumnNames[index];

            aggregatesSource[field] = { sum: contragent[field] };
        }

        return documentGroup;
    },

    filterValuesByExpiriedPeriods: function (record, expiredPeriods) {

        var newRecord = jQuery.extend(true, {}, record);

        var aggregatesRecord = newRecord.aggregates;

        var localExpiredPeriods = expiredPeriods.slice();

        for (var expiredName in this.filterAlias) {

            var filterAliaName = this.filterAlias[expiredName];

            if (localExpiredPeriods.indexOf(expiredName) == -1) {

                aggregatesRecord.FullDebitore.sum -= aggregatesRecord[filterAliaName].sum;

                if (expiredName != "InTime") {
                    aggregatesRecord.DebitoreOwed.sum -= aggregatesRecord[filterAliaName].sum;
                }
                aggregatesRecord[filterAliaName].sum = 0;
            }
        }
        
        if (aggregatesRecord.FullDebitore.sum <= 2) 
        {
            return null;
        }

        return newRecord;
    },

    formattingDocumentGroups: function(documents, selectedGroupName, isAddSummary) {
        var aggregateDocuments = [];


        for (var ind in documents) {
            var document = documents[ind];

            var recordSource = this.filterValuesByExpiriedPeriods(document, this.expiredPeriods);
                    

            if (recordSource)
            {
                var aggregatesSource = recordSource.aggregates;

                var newAggregateGroup = {
                    field: selectedGroupName,
                    items: [],
                    hasSubgroups: true,
                    value: document.name,
                    aggregates: {
                        groupId: recordSource.groupId,
                    }
                };

                for (var idx in this.aggregateColumnNames) {
                    var aggregateName = this.aggregateColumnNames[idx];

                    newAggregateGroup.aggregates[aggregateName] = aggregatesSource[aggregateName];
                }

                aggregateDocuments.push(newAggregateGroup);
            }
        }

        if (isAddSummary)
        {
            var totalRecord = {
                field: selectedGroupName,
                items: [],
                hasSubgroups: true,
                value: "All",
                aggregates: {
                    groupId: -1,
                    FullDebitore: { sum: 0 },
                    LimitDebitore: { sum: 0 },
                    DebitoreOwed: { sum: 0 },
                    Debitore7Days: { sum: 0 },
                    Debitore14Days: { sum: 0 },
                    Debitore21Days: { sum: 0 },
                    Debitore28Days: { sum: 0 },
                    DebitoreMoreThen28Days: { sum: 0 }
                }

            };

            for (var idx in aggregateDocuments) {
                var aggregateAgreement = aggregateDocuments[idx].aggregates;
                
                for (var aggIdx in this.aggregateColumnNames) {
                    var aggregateAlia = this.aggregateColumnNames[aggIdx];

                    totalRecord.aggregates[aggregateAlia].sum += aggregateAgreement[aggregateAlia].sum;
                }
            }

            aggregateDocuments.push(totalRecord);
        }

        return aggregateDocuments;
    },

    getAggregateLevelValues: function (selectedGroupName, groupIds, expiredPeriods) {

        this.expiredPeriods = expiredPeriods;

        var levelGroupingFieldName = this.mdxHierarhyAlias[selectedGroupName];
        var documentsGroups = [];
        var localContragents = this.localContragent;

        if (levelGroupingFieldName
            && localContragents
            && localContragents.length != 0) {

            for (var index in localContragents) {
                
                var document = localContragents[index];

                var isNoAddingData = this.isInValidContragentByHierarhy(document, groupIds);

                if (isNoAddingData && groupIds)
                {
                    continue;
                }

                var findDocumentGroup = this.findDocumentGroup(documentsGroups, document, levelGroupingFieldName);

                if (findDocumentGroup)
                {
                    this.addDocumentToGroup(findDocumentGroup, document);
                } 
                else
                {
                    documentsGroups.push(this.createDocumentGroup(document, levelGroupingFieldName));
                }
            }
        }

        return this.formattingDocumentGroups(documentsGroups, selectedGroupName, groupIds == null || groupIds.length==0);
    }
};

KendoDebitoreDataSource.GetDataSource = function (
    url,
    agreementUrl,
    fields,
    groupFields,
    sumAggregates,
    parseElementaryItem,
    elementaryKeyField,
    filters,
    measures,
    sortField,
    gridSelector
    
)
{
    var getFilters = function (groups, elementaryKeyField, filters, item) {

        var rfilters = UniqueUnionObject(getDates(), filters);

        KendoOlapDataSource.AddGroupsFilters(rfilters, groups, elementaryKeyField, item, measures, sortField);


        return rfilters;
    };


    var dataSource = new kendo.data.DataSource({
        schema: {
            model: {
                fields: fields
            },
            groups: function (data) {
                data = ReduceInputDataToMaxRowCount(data);

                return data;
            },
            parse: function (data) {
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
        transport:
        {
            read: function (options) {

                dataSource.oldData = true;

                var data = dataSource.GetFilters();

                
                var expiredPeriods = debitoreExpiredManager.getActiveFilters();

                var kendoGrid = gridSelector.data("kendoGrid");
                var firstColumnName = kendoGrid.columns[0].field;

                for (var idx in kendoGrid.columns) {
                    var column = kendoGrid.columns[idx];

                    if (!column.hidden) {
                        firstColumnName = column.field;
                        break;
                    }

                }

                if (KendoDebitoreDataSource.localContragent == null) {


                    $.ajax({
                        url: url,
                        type: 'POST',
                        dataType: "json",
                        data: data,
                        success: function(result) {

                            KendoDebitoreDataSource.localContragent = result;

                            var aggregateDocuments = KendoDebitoreDataSource.getAggregateLevelValues(
                                firstColumnName,
                                data.groupIds,
                                expiredPeriods);

                            options.success(aggregateDocuments);
                        },
                        error: function(result) {
                            options.error(result);
                        }
                    });
                }
                else {
                    var resultic = KendoDebitoreDataSource.getAggregateLevelValues(
                                firstColumnName,
                                null,
                                expiredPeriods);

                    options.success(resultic);
                }

            }
        },
        
        serverSorting: true,//Костыль, чтобы стандартная сортировка на клиенте не выполнялась. Сортировка выполняется на клиенте методом sortGroupByAggregatesValueDS.
        serverGrouping: true,
        group: groupFields,
        aggregate: sumAggregates,
        sort: sortField
    });


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

    dataSource.GetSubGroups = function (filters)
    {
        var groupItems = [];

        var expiredFlters = debitoreExpiredManager.getActiveFilters();

        if (filters
            && filters.selectGroup
            && KendoDebitoreDataSource.mdxHierarhyAlias[filters.selectGroup.field])
        {
            

            groupItems = KendoDebitoreDataSource.getAggregateLevelValues(
                filters.selectGroup.field,
                filters.groupIds,
                expiredFlters);
        }
        else
        {
            var dataValues = {
                beginDate:filters.beginDate,
                groupIds: filters.groupIds,
                expiredPeriods: { ExpiriedTypes: expiredFlters }
            };

            

            $.ajax(
            {
                url: agreementUrl,
                type: 'POST',
                async: false,
                dataType: "json",
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(dataValues),
                success: function (data)
                {
                    data = ReduceInputDataToMaxRowCount(data);

                    if (dataSource.parseReponse) {
                        dataSource.parseReponse(data);
                    }

                    groupItems = data;
                },
                error: function (e, e2, e3)
                {
                    console.log("Error!!!");
                    console.log(e);
                    console.log(e2);
                    console.log(e3);
                }
            });
        }

        return groupItems;
    };

    return dataSource;


};

KendoDebitoreDataSource.AddGroupsFilters = function (filters, groups, elementaryKeyField, item, measures, sortField) {

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


var getGridColumnsManager = function (settingManager, grid, isNoUpdateFromServer, readOnlyColumnFields) {

    function getColumnGroup(gridColumn) {
        var columnGroup;

        if (gridColumn.isGroup) {
            columnGroup = 'GroupingField';
        } else if (gridColumn.isFolder) {
            columnGroup = 'FolderField';
        } else if (gridColumn.customFormat == undefined) {
            columnGroup = 'StaticField';
        } else {
            columnGroup = 'ValueField';
        }

        return columnGroup;
    }

    function getGridColumns() {
        return grid.data('kendoGrid').options.columns;
    }

    function getColumnGroupAlias(columnGroup) {
        var alias;

        if (columnGroup == 'GroupingField') {
            alias = 'Группировочные';
        }
        else if (columnGroup == 'StaticField') {
            alias = 'Детальные';
        }
        else if (columnGroup == 'FolderField') {
            alias = 'Папка контрагента';
        }

        else {
            alias = 'Значений';
        }

        return alias;
    }

    function getColumnGroupOrderedArray() {
        return ['FolderField', 'GroupingField', 'StaticField', 'ValueField'];
    }

    function getActiveColumns(gridColumns) {

        var selectedColumns = settingManager.getSetting('activeColumns');

        if (typeof selectedColumns == 'string'
            && selectedColumns.length > 0) {
            selectedColumns = JSON.parse(selectedColumns);
        } else {
            selectedColumns = {};
        }

        if (jQuery.isEmptyObject(selectedColumns)) {
            selectedColumns = setAllGridColumnsToSelectedColumns(selectedColumns, gridColumns);
        }

        return selectedColumns;
    }

    function setAllGridColumnsToSelectedColumns(settingValue, gridColumns) {
        for (var i = 0; i < gridColumns.length; i++) {
            var columnGroup = getColumnGroup(gridColumns[i]);

            if (!settingValue[columnGroup]) {
                settingValue[columnGroup] = {};
            }

            settingValue[columnGroup][gridColumns[i].field] =
                createColumnAttributes(Object.keys(settingValue[columnGroup]).length, true);
        }

        return settingValue;
    }

    function createColumnAttributes(index, isActive) {
        return {
            orderIndex: index,
            isActive: isActive
        };
    }

    function updateActiveColumnSetting(fieldsGroups) {
        settingManager.setSetting('activeColumns', updateActiveColumnsSetting(fieldsGroups));
    }

    function updateActiveColumnsSetting(fieldsGroups) {

        var result=getColumnsOptionGroups(fieldsGroups);
       
        return JSON.stringify(result);
    }

    function getColumnsOptionGroups(fieldsGroups) {

        var columnsGroups = {}

        for (var i = 0; i < fieldsGroups.length; i++) {

            var fieldsGroup = fieldsGroups[i];
            
            var groupName = fieldsGroup.groupName;
            var columnsGroup = columnsGroups[groupName];

            if (!columnsGroup) {
                columnsGroup = columnsGroups[groupName] = {};
            }

            var fields = fieldsGroup.fields;
            for (var j = 0; j < fields.length; j++) {

                var fieldInfo = fields[j];

                var isAcitveColumn = false;
                if (window.cardType) {
                    isAcitveColumn=  groupName === "ValueField" 
                        ? fieldInfo.field == cardType
                        : fieldInfo.isActive;
                } else {
                    isAcitveColumn = fieldInfo.isActive;
                }
               

                columnsGroup[fieldInfo.field] = createColumnAttributes(j, isAcitveColumn);
            }
        }

        window.cardType = 0;

        return columnsGroups;
    }

    function changeActiveColumns(kendoGrid) {
        var columns = kendoGrid.columns;

        var setting = getActiveColumns(columns);

        columns.forEach(function (column) {
            var columnGroup = getColumnGroup(column);

            if (column.SelectAble !== false) {
                if (setting[columnGroup][column.field].isActive
                        && (column.isGroup || !column.groupingField)
                ) {
                    kendoGrid.showColumn(column.field);
                } else {
                    kendoGrid.hideColumn(column.field);
                }
            }
        });
    }

    function orderColumn(kendoGrid) {
        var groupFields = getActiveColumns(kendoGrid.columns);

        var counter = 0;
        var groupKeys = getColumnGroupOrderedArray();

        for (var i = 0; i < groupKeys.length; i++){

            var group = groupKeys[i];

            if (!groupFields.hasOwnProperty(group))
                continue;

            var fields = groupFields[group];

            var k = 0;
            for (var field in fields) {
                if (!fields.hasOwnProperty(field))
                    continue;

                var gridColumns = kendoGrid.columns;

                var column = gridColumns.find(function (el) { return el.field == field; });

                if (column) {
                    kendoGrid.reorderColumn(fields[field].orderIndex + counter, column);
                    k++;
                }
            }

            counter += k;
        }
    }

    function getGroupField(columns, groupFields) {

        var setting = getActiveColumns(columns);

        var resultField = [];

        setting = setting["GroupingField"];

        var groupFieldsFromSettings = [];
        for (var field in setting) {
            if (!setting.hasOwnProperty(field)) continue;

            groupFieldsFromSettings.push({
                orderIndex: setting[field].orderIndex,
                field: field,
                isActive: setting[field].isActive
            });
        }

        groupFieldsFromSettings.sort(function (a, b) {
            if (a.orderIndex < b.orderIndex)
                return -1;
            if (a.orderIndex > b.orderIndex)
                return 1;

            return 0;
        });

        for (var i = 0; i < groupFieldsFromSettings.length; i++) {
            for (var j = 0; j < groupFields.length; j++) {
                if (groupFieldsFromSettings[i].field == groupFields[j].field
                    && groupFieldsFromSettings[i].isActive) {
                    resultField.push(groupFields[j]);
                }
            }
        }

        return resultField;
    }

    function updateActiveColumnAndGroup() {
        var kendoGrid = grid.data('kendoGrid');

        changeActiveColumns(kendoGrid);
        orderColumn(kendoGrid);

        var dataSource = kendoGrid.dataSource;

        var groupField = getGroupField(kendoGrid.columns, dataSource._allGroup);

        if (!isNoUpdateFromServer)
        {
            dataSource.group(groupField);
        }
    }

    function getViewModelForUserSettingModal() {
        var columns = getGridColumns();

        var setting = getActiveColumns(columns);

        var model = {};

        for (var i = 0; i < columns.length; i++) {

            var column = columns[i];
            if (column.SelectAble != false) {
                var columnGroup = getColumnGroup(column);

                if (!setting[columnGroup]) {
                    setting[columnGroup] = [];
                }

                var userSettingGroup = setting[columnGroup];

                if (!userSettingGroup[column.field]) {
                    userSettingGroup[column.field] = createColumnAttributes(Object.keys(userSettingGroup).length, true);
                }

                var settingColumn = userSettingGroup[column.field];

                if (!model[columnGroup]) {
                    model[columnGroup] = [];
                }

                var readOnly = true;

                if (readOnlyColumnFields) {
                    for (var idx in readOnlyColumnFields) {
                        if (column.field == readOnlyColumnFields[idx]) {
                            readOnly = false;
                            break;
                        }
                    }
                }

                if (readOnly) {
                    model[columnGroup].push({
                        field: column.field,
                        title: column.title,
                        isActive: settingColumn.isActive,
                        index: settingColumn.orderIndex,
                        readOnly: true
                    });
                } else {
                    model[columnGroup].push({
                        field: column.field,
                        title: column.title,
                        isActive: settingColumn.isActive,
                        index: settingColumn.orderIndex,
                        readOnly: false,
                    });
                }
            }
        }

        var result = [];

        for (var group in model) {
            if (model.hasOwnProperty(group)) {
                result.push({
                    groupAlias: getColumnGroupAlias(group),
                    groupName: group,
                    fields: model[group]
                });
            }
        }

        for (var i = 0; i < result.length; i++) {
            var fields = result[i].fields;

            fields.sort(function sortFunction(a, b) {
                if (a.index < b.index) {
                    return -1;
                }

                if (a.index > b.index) {
                    return 1;
                }

                return 0;
            });
        }

        return result;
    }

    function saveSettingsAndUpdateColumns(groupFields) {
        updateActiveColumnSetting(groupFields);

        updateActiveColumnAndGroup(grid);
    }

    function clearValueFields() {
        console.log('clearValueFields');

        var setting = getActiveColumns(getGridColumns());

        setting['ValueField'] = {};

        settingManager.setSetting('activeColumns', JSON.stringify(setting));
    }

    return {
        saveSettingsColumns: updateActiveColumnSetting,
        saveSettingsAndUpdateColumns: saveSettingsAndUpdateColumns,
        getViewModelForUserSettingModal: getViewModelForUserSettingModal,
        clearValueFields: clearValueFields
    }
};
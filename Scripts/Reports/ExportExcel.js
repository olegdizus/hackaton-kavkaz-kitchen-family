class ExportExcel {
    constructor(url, sendElement, usrSettings) {
        this._url = url;
        this._usrSettings = usrSettings;
        this._sendElement = $(sendElement);

        this._sendElement.click({ee: this},this._clickFunction);
    }

    _clickFunction(e)
    {
        var updateUserSettingsPath = exportExcelUrl;

        var userSettingManager = new UserSettingManager(e.data.ee._usrSettings);

        var dates = userSettingManager.getDateRange();

        var beginDate = e.data.ee._convertDateString(dates.beginDate);

        var endDate = e.data.ee._convertDateString(dates.endDate);

        var activeColumnsJson = e.data.ee._usrSettings.userSettingValues.activeColumns.settingValue;

        var activeColumns = JSON.parse(activeColumnsJson);

        var jsonFilters = e.data.ee._usrSettings.userSettingValues.selectedFilters.settingValue;

        var selGroupNames = e.data.ee._getActiveValues(activeColumns.GroupingField);

        var staticFields = activeColumns.StaticField;

        var key;
        for (key in staticFields) {
            if (staticFields[key].isActive)
                selGroupNames.push(key);
        };

        var selValsNames = e.data.ee._getActiveValues(activeColumns.ValueField);

        var outData = {
            groups: selGroupNames,
            measures: selValsNames,
            beginDate: beginDate,
            endDate: endDate,
            jsonFilters: jsonFilters
        };

        $.ajax({
            url: updateUserSettingsPath,
            method: 'POST',
            data: outData,
            success: function(response) {
                if (response.success) {
                    notification.info(response.sucsessMsg);
                    
                } else {
                    if (response.errMsg == "") {
                        notification.warning(
                            "Не удалось произвести выгрузку в Excel. Попробуйте уменьшить количество данных.");
                    } else {
                        notification.error(response.errMsg);
                    }
                }
            },
            error: function() {

                notification.error("Ошибка запроса выгрузки Excel документа!");
            }
        });
    }

    _getActiveValues(inVal) {

        var selValues = [];
        var key;
        for (key in inVal) {
            if (inVal[key].isActive)
                selValues.push({ name: key, order: inVal[key].orderIndex });
        };

        selValues.sort(
            function(a, b) {
                if (a.order < b.order)
                    return -1;
                if (a.order > b.order)
                    return 1;
                return 0;
            });

        var selValsNames = [];

        selValues.forEach(function(item, i, arr) {
            selValsNames.push(item.name);
        });

        return selValsNames;
    }

    _convertDateString(date)
    {
        var array = date.split('.');

        array.reverse();

        return array.join('-');
    }
}
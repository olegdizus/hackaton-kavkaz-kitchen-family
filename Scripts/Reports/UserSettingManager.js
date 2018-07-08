function UserSettingManager(userSettings) {
    if (typeof (userSettings) == "string") {
        userSettings = JSON.parse(userSettings);
    }

    var userSettingValues = userSettings.userSettingValues;
    var userSettingGroupId = userSettings.userSettingGroupId;

    this.UpdateByFilters = function(filters) {

        userSettingsManager.setSetting('selectedFilters', JSON.stringify(filters));
        userSettingsManager.updateSettings();
    }

    this.getDateRange = function () {

        var dateRangeSetting = userSettingValues.dateRange.settingValue;

        if (dateRangeSetting == null) {
            throw new Error("Не удалось получить диапазон дат");
        } else {
            return {
                beginDate: dateRangeSetting.match(/beginDate=(.+)&/)[1],
                endDate: dateRangeSetting.match(/endDate=(.+)$/)[1]
            }
        }
    }

    this.getReportDate = function () {

        var dateRangeSetting = "reportDate=" + userSettingValues.singleDate.settingValue;

        if (dateRangeSetting == null) {
            throw new Error("Не удалось получить дату отчета");
        } else {
            return {
                reportDate: dateRangeSetting.match(/reportDate=(.+)/)[1]
            }
        }
    }

    this.updateDateRangeSetting = function (beginDate, endDate) {
        userSettingValues.dateRange.settingValue = "beginDate=" + beginDate + "&endDate=" + endDate;
    }


    this.setNewSetting = function (settingName, settingId, value) {

        if (!userSettingValues[settingName]) {
            userSettingValues[settingName] = {};

            userSettingValues[settingName].userSetting_id = settingId;
        }
       
        userSettingValues[settingName].settingValue = value;
    }

    this.setSetting = function (settingName, value) {

        if (userSettingValues[settingName]) {
            userSettingValues[settingName].settingValue = value;
        }
    }

    this.updateSettings = function (onSuccess, onError) {

        var updateUserSettingsPath = basePath + 'UserSetting/UpdateUserSettings';

        $.ajax({
            url: updateUserSettingsPath,
            method: 'POST',
            data: {
                userSettingValuesByGroup: JSON.stringify({
                    userSettingValues: userSettingValues,
                    userSettingGroupId: userSettingGroupId
                })
            },
            success: onSuccess,
            error: onError
        });
    }

    //this.exportExcel = function (onSuccess, onError) {

    //    var updateUserSettingsPath = basePath + 'ReportByPeriodsOLAP/ExportExcel';

    //    $.ajax({
    //        url: updateUserSettingsPath,
    //        method: 'POST',
    //        data: getData(),
    //        success: function (response) {
    //            if (response.success) {
    //                showInfoModal("Задание на выгрузку в Excel принято");
    //            } else {
    //                showInfoModal("Задание на выгрузку в Excel не принято");
    //            }
    //        },
    //        error: onError
    //    });
    //}

    // onSuccess - копирование ссылки в буфер
    // onError - предупреждение
    this.saveSettingsLink = function (onSuccess, onError) {

        var updateUserSettingsPath = basePath + 'UserSetting/SaveUserSettingsLink';

        $.ajax({
            url: updateUserSettingsPath,
            method: 'POST',
            async: false,
            data: {
                userSettingValuesByGroup: JSON.stringify({
                    userSettingValues: userSettingValues,
                    userSettingGroupId: userSettingGroupId
                })
            },
            success: function (response) {

                var host = "http://" + window.location.hostname;

                var link = host + basePath + controllerName + '/' + actionName + '?guid=' + response.guid;

                copyToClipboard(link);

                if (showInfoModal) {
                    showInfoModal("Ссылка на отчет скопирована в буфер обмена");
                } else {

                    console.warning("Не удалось открыть окно уведомления");
                }

                //alert("Ссылка на отчет:\n" + link + "\nскопирована в буффер");

            },
            error: onError
        });

    }


    function copyToClipboard(text) {

        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val(text).select();

        document.execCommand("copy");

        $temp.remove();
    }

    this.getSetting = function (settingName) {
        if (userSettingValues[settingName]) {
            return userSettingValues[settingName].settingValue;
        }

        return undefined;
    }
}

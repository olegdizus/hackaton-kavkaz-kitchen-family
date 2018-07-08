var getDebitoreExpiredManager = function (settingManager, filterContainer, refreshClickCallback) {

    function getActiveFilters() {
        var expiredDays = [];

        $.each(filterContainer.find(".delayFilter.active"), function (idx, elem) {
            var categoryCurrent = $(elem).attr("category");
            expiredDays.push(categoryCurrent);
        });

        return expiredDays;
    }

    function getExpires() {

        var selectedExpired = settingManager.getSetting('debitoreExpiredPeriod');

        return JSON.parse(selectedExpired);
    }

    var setExpiredControl = function (datasourceCallBack) {

        var expires = getExpires();

        $.each(filterContainer.find(".delayFilter"), function (idx, element) {

            var $element = $(element);
            var category = $element.attr("category");

            if (category) {
                if (expires.indexOf(category) != -1) {
                    $element.addClass("active");
                } else {
                    $element.removeClass("active");
                }
            }
            $element.off();
            $element.click(function () {

                $(this).toggleClass("active");

                var newExpires = getActiveFilters();

                saveExpires();

                settingManager.updateSettings(onSuccess, onError);

                if (refreshClickCallback) {
                    refreshClickCallback(newExpires);
                }
            });
        });
    }

    function onSuccess() {
        console.log("Настройки фильтров периодов просрочки обновлены");
    }

    function onError() {
        console.log("Оштбка при сохранении настроек фильтров периодов просрочки");
    }

    function saveExpires() {
        settingManager.setSetting('debitoreExpiredPeriod',
            JSON.stringify(getActiveFilters()));
    }

    return {
        activeFilters: getActiveFilters,
        setExpiredControl: setExpiredControl,
        saveExpires: saveExpires
    };

}
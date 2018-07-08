    function DebitoreExpiredManager(settingManager, debitoreExpiredMngr, filterContainer) {
    this.initExpires = function () {

        debitoreExpiredMngr.setExpiredControl();



    }

    this.getActiveFilters=function() {
        return debitoreExpiredMngr.activeFilters();
    }
   
}

DebitoreExpiredManager.createInstance = function (
    userSettings,
    filterContainer,
    refreshClickCallback)
{
    var settingManager = new UserSettingManager(userSettings);

    this.expiredDays = JSON.parse(settingManager.getSetting('debitoreExpiredPeriod'));

    var debitoreExpiredMngr = getDebitoreExpiredManager(settingManager, filterContainer, refreshClickCallback);

    return new DebitoreExpiredManager(settingManager, debitoreExpiredMngr, filterContainer);
}
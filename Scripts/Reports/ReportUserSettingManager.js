function ReportUserSettingManager(
    settingManager,
    gridColumnsManager,
    grid,
    refreshClickCallback,
    saveCallBack,
    isNoOnRefreshUpdate)
{
    var viewModel = {
        fieldGroups: ko.observableArray(null),
        beginDate: ko.observable(),
        endDate: ko.observable(),
        errors: ko.observable(""),
        reportDate: ko.observable("")
    };

    this.viewModel = viewModel;

    initHandlers();


    this.settingManager = settingManager;

    this.setSetting = function(settingName, value) {
        this.settingManager.setSetting(settingName, value);
    }

    this.updateSettings = function() {
        this.settingManager.updateSettings();
    }
    this.saveSettingsLink = function () {
        this.settingManager.saveSettingsLink();
    }

    function onSuccess(data) {
        //viewModel.errors(data);
    }

    function onError(data) {
        viewModel.errors(data);
    }

    this.initColumns = function () {
        //todo: функция должна вызываться для конкретного грида. Значение получает в параметрах
        var model = gridColumnsManager.getViewModelForUserSettingModal();

        viewModel.fieldGroups(model);


        var fieldGroups = viewModel.fieldGroups();
        gridColumnsManager.saveSettingsAndUpdateColumns(fieldGroups);

        $('#selectAllActiveColumnButton').on('click', selectAllActiveColumn);

        $('#unSelectAllActiveColumnButton').on('click', unSelectAllActiveColumn);

        function selectAllActiveColumn() {
            setAllViewModelFieldsActive(true);
        }

        function unSelectAllActiveColumn() {
            setAllViewModelFieldsActive(false);
        }

        function setAllViewModelFieldsActive(active) {
            var groups = viewModel.fieldGroups();

            viewModel.fieldGroups([]);

            for (var i = 0; i < groups.length; i++) {
                var fields = groups[i].fields;

                for (var j = 0; j < fields.length; j++) {
                    fields[j].isActive = active;
                }
            }

            viewModel.fieldGroups(groups);
        }


        ShowOnlyForPrMonthAlert();
        
        
    }

    this.initDateRange = function () {
        var dateRangeSetting = settingManager.getDateRange();

        viewModel.beginDate(dateRangeSetting.beginDate);
        viewModel.endDate(dateRangeSetting.endDate);

        ko.applyBindings(viewModel);
    }
    
    this.initReportDate = function () {
        var dateRangeSetting = settingManager.getReportDate();

        viewModel.reportDate(dateRangeSetting.reportDate);


        ko.applyBindings(viewModel);
    }

    function initHandlers() {

        $('#saveSettingsButton').on('click', function () {

                var fieldGroups = viewModel.fieldGroups();
                
                gridColumnsManager.saveSettingsColumns(fieldGroups);

                settingManager.updateSettings(onSuccess, onError);
                $('#userSettingsModal').modal('hide');

                ShowOnlyForPrMonthAlert();

                if (saveCallBack) {
                    gridColumnsManager.saveSettingsAndUpdateColumns(fieldGroups);
                    saveCallBack(fieldGroups);
                }


            });
        if (!isNoOnRefreshUpdate) {
            $('#refresh').on('click', function() {
                refreshClickCallback(settingManager, gridColumnsManager);

                settingManager.updateSettings(onSuccess, onError);
            });
        }
        $('#SaveUserSettingsLink').click(
            function () {

                refreshClickCallback(settingManager, gridColumnsManager); // чтобы сохранялись только "обновленные" значения - закомментировать

                //сохраняем открытие иерархии
                settingManager.setNewSetting("openHierarchy", 18, JSON.stringify(GetExpandedGridGroups('groupid')));

                settingManager.saveSettingsLink(onSuccess, onError);
            }
        );


        $("#openSettingsModalButton").click(function() {
            $('#userSettingsModal').modal('show');

            $(document).ready(
                $(function() {
                    $("ul.userSettingList")
                        .sortable(
                            {
                                onDrop:
                                    function($item, container, _super) {

                                        var newIndexItem = $item.index();
                                        _super($item, container);

                                        var fieldName = $item.find('div[field]').attr('field');
                                        var groups = viewModel.fieldGroups();

                                        for (var i = 0; i < groups.length; i++) {

                                            var fieldsGroup = groups[i].fields;
                                            var fieldId = _.findIndex(fieldsGroup,
                                                function(el) {
                                                    return el.field == fieldName;
                                                });


                                            if (fieldId >= 0) {
                                                var temp = fieldsGroup[fieldId];
                                                fieldsGroup.splice(fieldId, 1);
                                                fieldsGroup.splice(newIndexItem, 0, temp);
                                            }

                                        }

                                        viewModel.fieldGroups(groups);

                                        $item.removeClass(container.group.options.draggedClass).removeAttr("style");
                                        $("body").removeClass(container.group.options.bodyClass);
                                    }

                            }
                        );

                }));

            $('div.settingValue.tooltip').tooltipster({
                theme: 'tooltipster-noir',
                functionBefore: function(instance, helper) {

                    var $origin = $(helper.origin);
                    var fieldName = $(helper.origin).find("[class = arrows]").attr("field");

                    getTooltipAjax(instance, $origin, fieldName);
                }
            });

        });
    }


    function iterationShowOnlyForPrMonthAlert(valueFields) {

        for (var i = 0, len = valueFields.length; i < len; i++) {

            var fieldvalue = valueFields[i].field;

            if (fieldvalue == "R1"
                || fieldvalue == "R2"
                || fieldvalue == "R3"
                || fieldvalue == "PlanDaysCount"
                ) {
                if (valueFields[i].isActive) {

                    $('#OnlyForPrMonthAlert').show();
                    break;
                }
            }
        }
    }

    function ShowOnlyForPrMonthAlert() {

        var fieldGroups = viewModel.fieldGroups();

        $('#OnlyForPrMonthAlert').hide();

        for (var i = 0; i < fieldGroups.length; i++) {

            if (!fieldGroups[i].hasOwnProperty('fields')) {
                continue;
            }

            iterationShowOnlyForPrMonthAlert(fieldGroups[i].fields);
        }
    }
}

ReportUserSettingManager.createInstance = function (
    userSettings,
    grid,
    refreshClickCallback,
    isNoUpdateGridFromServer,
    saveCallBack,
    isNoOnRefreshUpdate,
    readOnlyColumnFields) {
    var settingManager = new UserSettingManager(userSettings);

    if (window.cardType) {
        var fieldName = window.cardType;

        var activeColumns = JSON.parse(settingManager.getSetting('activeColumns'));

        if (activeColumns["ValueField"]) {
            if (activeColumns["ValueField"][fieldName]) {
                activeColumns["ValueField"][fieldName].isActive = true;
            }
        }


        settingManager.setSetting('activeColumns', JSON.stringify(activeColumns));
        settingManager.updateSettings(function() {}, function() {});
    }

    var gridColumnsManager = getGridColumnsManager(settingManager, grid, isNoUpdateGridFromServer, readOnlyColumnFields);

    return new ReportUserSettingManager(
        settingManager,
        gridColumnsManager,
        grid,
        refreshClickCallback,
        saveCallBack,
        isNoOnRefreshUpdate)
    ;
}


function GetExpandedGridGroups(groupId) {
    var colapsedGroups = $(gridName)
        .find("a.k-i-collapse")
        .next('span')
        .get();

    var groupIds = [];

    $(colapsedGroups)
    .each(
        function (ind, el) {
            groupIds.push(el.getAttribute(groupId));
        });

    return groupIds;
}




var isFistExpand = true;

function ExpandItems(grid, expandItems) {

    setTimeout(function () {
        ExpandItemsByTimeout(grid, expandItems);
    }, 1000);
}

function ExpandItemsByTimeout(grid, expandItems) {

    if (isFistExpand) {

        isFistExpand = false;

        for (var i = 0; i < expandItems.length; i++) {

            var expandGroup = grid.find("span[groupid='" + expandItems[i] + "']");
            var anchor = expandGroup.closest('td').find('.k-icon.k-i-expand');

            anchor.trigger('click');
        }
    }
}


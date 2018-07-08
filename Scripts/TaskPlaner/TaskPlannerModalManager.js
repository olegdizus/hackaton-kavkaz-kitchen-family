function TaskPlannerModalManager() {
    var animationSpeed = 300;

    this.bindOkButtonClickHandler = function (buttonId, handler) {
        $('#' + buttonId).unbind('click');
        $('#' + buttonId).click(handler);
    }

    this.clearFormValues = function(formId, filters) {
        clearValidationErrorSpans(formId);

        var form = $('#' + formId);

        resetFormValues(form);

        if (filters != null) {
            $('#employeeTo_id').val(filters.EmployeeTo);
            $('#taskContact').val(filters.Contact);
            $('#taskContact_hidden').val(filters.ContactId);
        }    
    }

    function resetFormValues(form) {
        $('input[type="text"],input[type="datetime"],textarea', form).val('');
        $('select', form).each(function () { this.selectedIndex = 0; });
    }

    function clearValidationErrorSpans(formId) {
        $('#' + formId).find('.text-danger').html('');
    }

    this.serializeForm = function (formId) {
        var values = $('#' + formId).serialize();

        return values;
    }

    this.sendAjax = function (params) {
        $.ajax({
            url: params.url,
            data: params.data,
            type: 'POST',
            contentType: false,
            processData: false,
            success: function (data) {
                if (resultIsSuccess(data)) {
                    params.onSuccessCallback(data.additionalData);
                } else {
                    var formDiv = $('#' + params.formId);

                    formDiv.html('');
                    formDiv.html(data);

                    if (params.bindHanlersAfterAjax) {
                        params.bindHanlersAfterAjax(formDiv);
                    }
                }
            },
            error: function () {
                goToErrorPage();
            }
        });
    }

    function resultIsSuccess(data) {
        return data.success;
    }

    function goToErrorPage() {
        window.location.replace(basePath + 'Shared/Error');
    }

    this.showPlannedDate = function (form) {
        showPlannedDateControl(form);
    }

    this.bindTaskStateSelectedListOnChange = function (form) {
        var taskStateSelectedList = $('#taskState_id', form);

        var onClosingStateId = 5;
        var onRemovalStateId = 6;

        taskStateSelectedList.on('change', function () {
            var currentTaskStateId = taskStateSelectedList.val();
            if (currentTaskStateId == onClosingStateId || currentTaskStateId == onRemovalStateId) {
                hidePlannedDateAndSetDefaultValue(form);
            } else {
                showPlannedDateControl(form);
            }
        });
    }

    function showPlannedDateControl(form) {
        var plannedDateInput = $('#PlannedDate', form);
        plannedDateInput.val('');

        $('#plannedDateDiv', form).slideDown(animationSpeed);
    }

    function hidePlannedDateAndSetDefaultValue(form) {
        var plannedDateInput = $('#PlannedDate', form);

        var validDate = getValidDateToSendForServer();

        plannedDateInput.val(validDate);

        $('#plannedDateDiv', form).slideUp(animationSpeed);
    }

    function getValidDateToSendForServer() {
        var options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        };
        var currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() + 1);

        var validDate = currentDate.toLocaleDateString('ru', options).replace(',', '');

        return validDate;
    }

    this.bindDatetimepicker = function (form) {
        var dateInput = $('#PlannedDate', form);

        //кофигурция datetimepicker взята из jQuery
        //dateInput.datetimepicker({ isRTL: !1, format: "dd.mm.yyyy hh:ii", autoclose: !0, language: "ru" });
    }
}

TaskPlannerModalManager.getInstance = function () {
    if (!TaskPlannerModalManager.instance) {
        TaskPlannerModalManager.instance = new TaskPlannerModalManager();
    }

    return TaskPlannerModalManager.instance;
}
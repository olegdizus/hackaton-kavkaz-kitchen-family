InitAllPickers();

function InitAllPickers() {
    $(".datepicker").datepicker({
        isRTL: false,
        format: 'dd.mm.yyyy',
        autoclose: true,
        language: 'ru',
        toggleActive: false
    });

    $(".datetimepicker").datetimepicker({
        isRTL: false,
        format: 'dd.mm.yyyy hh:ii',
        autoclose: true,
        language: 'ru'
    });

    $(".timepicker").timepicker({
        minuteStep: 1,
        template: 'modal',
        appendWidgetTo: 'body',
        showSeconds: true,
        showMeridian: false,
        defaultTime: false,
        isRTL: false,
        autoclose: true,
        language: 'ru'
    });
}


function InitAllPickers(parentNode) {
    $(".datepicker", parentNode).datepicker({
        isRTL: false,
        format: 'dd.mm.yyyy',
        autoclose: true,
        language: 'ru',
        toggleActive: false
    });

    $(".datetimepicker", parentNode).datetimepicker({
        isRTL: false,
        format: 'dd.mm.yyyy hh:ii',
        autoclose: true,
        language: 'ru'
    });

    $(".timepicker", parentNode).timepicker({
        minuteStep: 1,
        template: 'modal',
        appendWidgetTo: 'body',
        showSeconds: true,
        showMeridian: false,
        defaultTime: false,
        isRTL: false,
        autoclose: true,
        language: 'ru'
    });
}
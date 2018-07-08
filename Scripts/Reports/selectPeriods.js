function getDates() {
    var beginDate = $('#beginDatepicker').val();
    var endDate = $('#endDatepicker').val();
    

    return {
        beginDate: beginDate.replace(/(\d+)\.(\d+)\.(\d+)/, '$3-$2-$1'),
        endDate: endDate ? endDate.replace(/(\d+)\.(\d+)\.(\d+)/, '$3-$2-$1') : null
    };
}

function setDates(beginDate, endDate) {
    $('#beginDatepicker').val(beginDate);
    $('#endDatepicker').val(endDate);
};

function disableDates() {
    $('#beginDatepicker').attr('disabled', 'disabled');
    $('#endDatepicker').attr('disabled', 'disabled');
};

function getAnalizeData() {
    return {
        dateValue: selectedDate
    };
}


function MenuItemClicked(menuId) {
    var date = getProductionMonthDate();

    var cbViewAllIndicator = getStatecbViewAllIndicator();

    MatrixKPIGrid("#grid", menuId, date, cbViewAllIndicator);
}

function MonthChanged(date) {
    var position_id = getPositionId();

    if (position_id == '') {
        return;
    }

    var cbViewAllIndicator = getStatecbViewAllIndicator();

    MatrixKPIGrid("#grid", position_id, date, cbViewAllIndicator);
}

function getProductionMonthDate() {
    return $('#currDate').data('date');
}

function getPositionId() {
    return $("#menuId").val();
}

function getStatecbViewAllIndicator() {
    return $('#cbViewAllIndicator').prop('checked');
}

$('#cbViewAllIndicator[type=checkbox]').on('click', ViewAllIndicator);

function ViewAllIndicator() {
    var position_id = getPositionId();
    var date = getProductionMonthDate();
    var cbViewAllIndicator = getStatecbViewAllIndicator();

    if (date && position_id)
        MatrixKPIGrid("#grid", position_id, date, cbViewAllIndicator);
}
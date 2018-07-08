function MenuItemClicked(menuId) {
    var date = getProductionMonthDate();

    BuildGrid(menuId, date);
}

function MonthChanged(date) {
    var emploeeId = getEmploeeId();

    if (emploeeId == '') {
        return;
    }

    BuildGrid(emploeeId, date);
}

function updateApprovePlanControl(plan) {

    clearApprovePlanControl();

    setApproveButtonActive(plan.allowSendForApprove, plan);

    $('#approveStatus').text(STATUS_NAMES[plan.status]);

    if (plan.comment) {
        $('#approvedComment').text(plan.comment);
        $('#approvedCommentAlert').show();
    } else {
        $('#approvedCommentAlert').hide();
    }
}

function clearApprovePlanControl() {
    $('#approveStatus').text('');

    $('#approvedCommentAlert').hide();
    $('#sendForApprove').hide();
    $('#ApproveVariant').hide();
    $('#NotApproveVariant').hide();
    $('#approveComment').show();
}

function setApproveButtonActive(isActive, plan) {

    var currentGrid = $('#grid').data('kendoGrid');

    if (plan.status != APPROVE_STATUSES.NotSent) {
        $('#approvedCommentAlert').show();
    }

    switch (plan.status) {
        case APPROVE_STATUSES.ForApproval:
            if (plan.allowApprove) {
                $('#ApproveVariant').show();
                $('#NotApproveVariant').show();
            }
            break;

        case APPROVE_STATUSES.Approved:
            currentGrid.hideColumn('command');
            $('#changeVariantBtn').hide();
            break;

        default:
            if (plan.allowSendForApprove) {
                $('#sendForApprove').show();
            }
            currentGrid.showColumn('command');
            break;
    }

    if (plan.allowEdit) {
        currentGrid.showColumn('command');

        if (plan.allowSendForApprove) {
            $('#sendForApprove').show();
        }

        $('#changeVariantBtn').show();
    }
}

function OnSubmitApproveResult(result) {
    if (!result) {
        alert('При отправке на согласование произошла ошибка');
    }

    var employeeId = getEmploeeId();
    var date = getProductionMonthDate();

    BuildGrid(employeeId, date);
}

function submitForApprove(forApprove, approved) {

    var variantId = getVariantId();
    var month = getProductionMonthDate();
    var comment = $('#approveComment').val();
    var employeeId = getEmploeeId();

    $('#approveComment').val('');

    var data = {
        variant_id: variantId,
        comment: comment,
        date: month,
        employee_id: employeeId
    };

    if (!forApprove) {
        data.approved = approved;
    }

    $.ajax({
        type: 'POST',
        async: false,
        url: basePath + "SalesPlansKpi/" + (forApprove ? "SendVariantToApprove" : "ApproveVariant"),
        data: data,
        success: function (response) {
            OnSubmitApproveResult(response.success);
        },
        error: function(response) {
            OnSubmitApproveResult(false);
        }
    });
}

var sendForApprove = true;

function showModalDialog(approve) {

    sendForApprove = approve;

    var approveConfirmModal = $('#approveConfirmModal');

    approveConfirmModal.modal('show');
}

$(function () {

    $("#sendForApprove").click(function () {

        showModalDialog(true);
    });

    $("#ApproveVariant").click(function () {
        submitForApprove(false, true);
    });

    $("#NotApproveVariant").click(function () {

        showModalDialog(false);
    });

    $("#sendApproveConfirm").click(function () {

        submitForApprove(sendForApprove, false);

        $("#approveConfirmModal").modal("toggle");
    });
});

function BuildGrid() {

    if (!getFiltes().Validate()) {
        $('#grid').text("Выберите сотрудника");

        return;
    }

    $.ajax({
        type: 'GET',
        async: false,
        url: basePath + "SalesPlansKpi/GetVariantsList",
        data: {
            employee_id: getEmploeeId(),
            date: getProductionMonthDate()
        },
        success: function (response) {
            $('#VariantsDiv').replaceWith(response);
        }
    });

    SalesPlansKPIGrid("#grid", getFiltes());
}

function getFiltes() {
    var employeeId = getEmploeeId();
    var date = getProductionMonthDate();
    var variantId = getVariantId();
    var dispAllparameters = getDisplayAllValue();

    return {
        date: date,
        employee_id: employeeId,
        variant_id: variantId,
        dispAllparameters: dispAllparameters,
        Validate:function() {
            return this.employee_id && this.date;
        }
    };
}

function getProductionMonthDate() {
    return $('#currDate').data('date');
}

function getEmploeeId() {
    return Number($("#menuId").val());
}

function getVariantId() {
    return $("#KpiVariants").val();
}

function getDisplayAllValue() {
   return $('#DisplayAllValue').prop('checked');
}

$('#DisplayAllValue[type=checkbox]').on('click', DisplayAll);

function DisplayAll() {
    BuildGrid();
}
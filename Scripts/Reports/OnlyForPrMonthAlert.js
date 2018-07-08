var indicatorsForAlert =
[
 
];

jQuery(document).ready(function () {
    $("#Indexes").change();
});

$("#Indexes").change(function () {

    var indicator = $('#Indexes').val();
    ShowOnlyForPrMonthAlert(indicator);
});

function ShowOnlyForPrMonthAlert(indicator) {

    if (indicatorsForAlert.includes(parseInt(indicator))) {
        $('#OnlyForPrMonthAlertForCombobox').show();
    } else {
        $('#OnlyForPrMonthAlertForCombobox').hide();
    }
}
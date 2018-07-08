$(function() {


    var settingManager = new UserSettingManager(userSetting);

    var viewModel = {
        date: ko.observable(settingManager.getSetting('singleDate')),
    }

    console.log("ko.applyBindings(viewModel);");
    ko.applyBindings(viewModel);

    $(".datepicker").datepicker({
        language: 'ru'
    });

    $('#byDateDatepicker').change(
        function() {
            settingManager.setSetting('date', viewModel.date());
            settingManager.updateSettings(function() {
                $("#Grid").data("kendoGrid").dataSource.read();

            });
        });

    $(".delayFilter").click(
        function() {
            $(this).toggleClass('active');

            $("#Grid").data("kendoGrid").dataSource.read();
        });

    CreateDebitoreGrid(
        $('#Grid'),
        '@Url.Action("GetReportTable")',
        '@Url.Action("GetDeliveries")',
        grenceColor,
        '@User.Identity.Name.Replace("\\", "\\\\")');
});




$(function () {

    var reportId = $('#reportId').val();

    if (reportId) {

        $.ajax({
            url: basePath + "BCG/GetReportData",
            data: { reportId: reportId },
            success: function (response) {

                $('#difficultChildrenComment').val(response.childrenComment);
                $('#starsComment').val(response.starsComment);
                $('#dogsComment').val(response.dogsComment);
                $('#cowsComment').val(response.cowsComment);
                $('#indicatorsList').val(response.indicatorId);
                $('#classificationList').val(response.classificationId);
                setDates(response.beginDate, response.endDate);

                Init();
            }
        });

        var showHideSelectors = GetShowHideSelectors();
        for (var i = 0; i < showHideSelectors.length; i++) {
            $(showHideSelectors[i]).hide();
        }

        if ($('#editOnOpen').val() == '') {

            $('#buttonsDiv').hide();

            var disableSelectors = GetCommentSelectors();

            for (i = 0; i < disableSelectors.length; i++) {
                $(disableSelectors[i]).attr('disabled', 'disabled');
            }
        }
        $('#indicatorsList').attr('disabled', 'disabled');
        $('#classificationList').attr('disabled', 'disabled');
        $('#previousPeriodsList').attr('disabled', 'disabled');

        disableDates();
    } else {
        $('#updateButtonDiv').hide();

        Init();
    }




















});


function Init() {
    if (reportIsReadOnly()) {
        $('#bcgReport').show();
    } else {
        $('#emptyBcgReportMessage').show();
    }

    function updateSelectedPeriods() {
        var periodType = $("#periodTypeList option:selected").val();
        var dates = getDates();

        var data = {
            periodType: periodType,
            beginDate: dates.beginDate,
            endDate: dates.endDate
        }

        var period = sendPost(basePath + 'SharedReport/GetPeriods', data);

        $('#beginDatepicker').datepicker('setDate', period.beginDate);
        $('#endDatepicker').datepicker('setDate', period.endDate);
    }

    updateSelectedPeriods();

    $("#periodTypeList").change(function () {
        updateSelectedPeriods();
    });

    function additionalDataCalculator(items) {
        for (var i = 0; i < items.length; i++) {
            var curItem = items[i];

            relativeMarketPartCalculate(curItem);
            averageTempoCalculate(curItem);
            growthForMatrixCalculate(curItem);
            partForMatrixCalculate(curItem);
        }

        function relativeMarketPartCalculate(item) {
            if (item.MainConcurentMarketPart
                && item.MainConcurentMarketPart != 0
                && item.MainConcurentMarketPart != '') {
                item.RelativeMarketPart = item.PartInSegment / item.MainConcurentMarketPart;
            } else {
                item.RelativeMarketPart = null;
            }
        }

        function averageTempoCalculate(item) {
            if (item.MarketVolume
                && item.GrowthTempo
                && grid.dataSource.aggregates().MarketVolume.sum
                && grid.dataSource.aggregates().MarketVolume.sum != 0) {
                item.AverageTempo = item.GrowthTempo * item.MarketVolume / grid.dataSource.aggregates().MarketVolume.sum;
            } else {
                item.AverageTempo = null;
            }
        }

        function growthForMatrixCalculate(item) {
            if (item.AverageTempo) {
                item.GrowthForMatrix = item.AverageTempo > GrowthForMatrix.Threshold ? GrowthForMatrix.hight : GrowthForMatrix.low;
            } else {
                item.GrowthForMatrix = null;
            }
        }

        function partForMatrixCalculate(item) {
            if (item.RelativeMarketPart) {
                item.PartForMatrix = item.RelativeMarketPart > PartForMatrix.Threshold ? PartForMatrix.hight : PartForMatrix.low;
            } else {
                item.PartForMatrix = null;
            }
        }
    }

    var grid = BCGInitialDataGrid("#grid", reportIsReadOnly(), additionalDataCalculator);


    $('#refresh').click(function () {
        var oldData = getDataFromGrid();

        grid.copyEditableAttributes = function (data) {
            for (var i = 0; i < data.length; i++) {
                var kendoItem = data[i];

                var item = oldData.find(
                    function (el) {
                        return el.classificationType == kendoItem.classificationType;
                    });

                if (item) {
                    kendoItem.Checked = item.Checked;
                    kendoItem.MarketVolume = item.MarketVolume;
                    kendoItem.PartInSegment = item.PartInSegment;
                    kendoItem.MainConcurentMarketPart = item.MainConcurentMarketPart;
                }
            }
        }

        grid.dataSource.read();

        $('#bcgReport').show();
        $('#emptyBcgReportMessage').hide();

        updateSelectedPeriods();
    });

    $('#analysisTab').click(function () {
        recalculateBcgMatrix(getDataFromGrid());
    });

    function setReadonlyMode() {
        var disableSelectors = GetCommentSelectors();

        for (var i = 0; i < disableSelectors.length; i++) {
            $(disableSelectors[i]).attr('disabled', 'disabled');
        }

        $('#buttonsDiv').hide();
        $('#updateButtonDiv').show();
    }

    $('#cancelInitialData').click(function () {
        if (!reportIsReadOnly()) {
            window.location.replace(basePath + 'BCG/Index');
        } else {

            grid = BCGInitialDataGrid("#grid", true, additionalDataCalculator);
            grid.dataSource.read();

            setReadonlyMode();
        }
    });

    $('#copyInitialData').click(function () {
        window.location.replace(basePath + 'BCG/BCGInitialDataView?fromReportId=' + $('#reportId').val());
    });

    $('#updateInitialData').click(function () {
        setEditModeGrid();
    });

    function setEditModeGrid() {
        grid = BCGInitialDataGrid("#grid", false, additionalDataCalculator);
        grid.dataSource.read();

        var disableSelectors = GetCommentSelectors();

        for (var i = 0; i < disableSelectors.length; i++) {
            $(disableSelectors[i]).removeAttr('disabled');
        }

        $('#buttonsDiv').show();
        $('#updateButtonDiv').hide();
    }

    function getDataFromGrid() {
        return grid.dataSource.data().toJSON();
    }

    $('#saveInitialData').click(function () {
        var dates = getDates();

        var command = reportIsReadOnly() ? "Update" : "Create";

        var report = {

            beginDate: dates.beginDate,
            endDate: dates.endDate,
            indicatorId: $('#indicatorsList').val(),
            growthForMatrixThreshold: GrowthForMatrix.Threshold,
            partForMatrixThreshold: PartForMatrix.Threshold,
            initialDataDetails: JSON.stringify(getDataFromGrid()),
            difficultChildrenComment: $('#difficultChildrenComment').val(),
            starsComment: $('#starsComment').val(),
            cowsComment: $('#cowsComment').val(),
            dogsComment: $('#dogsComment').val(),
            reportId: $('#reportId').val(),
            classificationId: $('#classificationList').val(),
        }

        $.ajax({
            url: basePath + "BCG/" + command,
            type: 'post',
            data: report,
            success: function (response) {
                if (response.success === true) {
                    if (reportIsReadOnly()) {
                        grid = BCGInitialDataGrid("#grid", true, additionalDataCalculator);
                        grid.dataSource.read();

                        setReadonlyMode();
                    } else {
                        window.location.replace(basePath + 'BCG/Index');
                    }
                } else {
                    showErrorAlert();
                }
            },
            error: function () {
                showErrorAlert();
            }
        });
    });

    if ($('#editOnOpen').val() == 1) {
        setEditModeGrid();
    }

    function showErrorAlert() {
        alert('При сохранении данных произошла ошибка');
    }

    if (reportIsReadOnly()) {
        grid.dataSource.read();
    }

    if ($('#editOnOpen').val() == 1 || !reportIsReadOnly()) {
        $('#initialData').addClass("active in");
        $('#liInitialDataTab').addClass("active");
    } else if (reportIsReadOnly()) {
        $('#analysis').addClass("active in");
        $('#liAnalysisTab').addClass("active");

        function recaclMatrixWithDataFromGrid() {
            recalculateBcgMatrix(getDataFromGrid());

            grid.unbind("dataBinding", recaclMatrixWithDataFromGrid);
        }

        grid.bind("dataBinding", recaclMatrixWithDataFromGrid);
    }
}


function GetShowHideSelectors() {
    return [
        '#periodTypeList',
        '#periodTypeListLabel',
        '#refresh'
    ];
}

function GetCommentSelectors() {
    return [
        '#difficultChildrenComment',
        '#starsComment',
        '#dogsComment',
        '#cowsComment'
    ];
}

function reportIsReadOnly() {
    return $('#reportId').val() != '';
}
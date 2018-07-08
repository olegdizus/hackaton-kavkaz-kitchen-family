function getInputParameters() {
    var arr = {}

    var dates = getDates();

    arr["periodType"] = $("#periodTypeList option:selected").val();
    arr["begin"] = dates.beginDate;
    arr["end"] = dates.endDate;
    arr["x"] = $("#xDimensionsList option:selected").val();
    arr["y"] = $("#yDimensionsList option:selected").val();
    arr["z"] = $("#zDimensionsList option:selected").val();
    arr["label"] = $("#labelsList option:selected").val();
    arr["lastYear"] = $("#periodsList option:selected").val() === "1";
    arr["withCompare"] = $('#isLastPeriod').prop('checked');

    return arr;
}

var radiusCoef = 1;

var data = [];
var ndx = updatingCrossfilter(data);

var radiusDiff = 1;

function updateDataForBubbleChart() {
    var parameters = getInputParameters();
    parameters["filter"] = filterControl.getFilterValues();

    var dataJson = sendPost(basePath + 'Bubble/GetBubbleRegions', parameters);

    data = [];

    for (var i = 0; i < dataJson.length; i++) {

        if (dataJson[i].xValue + dataJson[i].yValue + dataJson[i].zValue == 0
            || dataJson[i].label === "Unknown") {
            continue;
        }

        var newData = {
            id: i,
            isChecked: true,
            label: dataJson[i].label,
            x: dataJson[i].xValue,
            y: dataJson[i].yValue,
            bubble: Math.abs(dataJson[i].zValue)
        };

        data.push(newData);
    }

    var max = Math.max.apply(Math, data.map(function (o) { return o.bubble; }));
    var min = Math.min.apply(Math, data.map(function (o) { return o.bubble; }));

    if (max == min) {
        radiusDiff = max * 10;
    } else {
        radiusDiff = max - min;
    }

    ndx = updatingCrossfilter(data);
}

var bubbleChart = {};
var dateGroup = undefined;
var idDim;

function redrawChart() {
    dc.redrawAll();
}

function InitBubbleChart(refresh) {

    if (refresh) {
        idDim = ndx.dimension(function (d) { return d.id; });

        dateGroup = idDim.group().reduce(
        function (p, v) {
            ++p.count;
            p.label = v.label;
            p.bubble = v.bubble;
            p.x = v.x;
            p.y = v.y;

            return p;
        },
        function (p, v) {
            --p.count;
            p.bubble = 0;
            p.label = "";
            p.x = 0;
            p.y = 0;

            return p;
        }, function () {
            return { count: 0, x: 0, y: 0, label: "" };
        });
    }

    function rangeValue(x, bubble, isAdditional, percent, shift) {

        if (bubble === 0) {
            return x;
        }

        var result, val;

        if (isAdditional) {
            val = x + ((bubble / radiusDiff) * shift);
            result = val + (val * percent);
        } else {
            val = x - ((bubble / radiusDiff) * shift);
            result = val - (val * percent);
        }

        return result;
    }

    var xRange = [d3.min(dateGroup.all(), function (d) {
        return rangeValue(d.value.x, d.value.bubble, false, 0.20, 10);
    }), d3.max(dateGroup.all(), function (d) {
        return rangeValue(d.value.x, d.value.bubble, true, 0.10, 10);
    })],

    yRange = [d3.min(dateGroup.all(), function (d) {
        return rangeValue(d.value.y, d.value.bubble, false, 0.20, 5);
    }), d3.max(dateGroup.all(), function (d) {
        return rangeValue(d.value.y, d.value.bubble, true, 0.10, 5);
    })];

    bubbleChart = dc.bubbleChart("#bubble-chart");
    bubbleChart.filter = function () { };

    bubbleChart
        .dimension(idDim)
        .group(dateGroup)

        .x(d3.scale.linear().domain(xRange))
        .y(d3.scale.linear().domain(yRange))

        .width($('#bubbleParentDiv').width())
        .height($('#bubbleParentDiv').height())
        .yAxisPadding(50)
        .xAxisPadding(50)
        .xAxisLabel($("#xDimensionsList option:selected").text())
        .yAxisLabel(($('#isLastPeriod').prop('checked') ? "Рост (" : "") + $("#yDimensionsList option:selected").text() + ($('#isLastPeriod').prop('checked') ? ") %" : ""))
        .label(function (p) {
            return p.value.label + " " + p.value.bubble;
        })
        .renderLabel(true)
        .title(function (p) {

            return [
                    p.value.label
            ]
                .join("\n");
        })
        .renderTitle(true)
        .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)
        .mouseZoomable(true)
        .zoomOutRestrict(false)
        .transitionDuration(0)
        .mouseZoomable(true)
        .on("preRender", function (chart) {
            chart.rescale();
        })
        .on("preRedraw", function (chart) {
            chart.rescale();
        })
        .on('renderlet', function (chart, filter) {
            chart.svg().select(".chart-body").attr("clip-path", null);

            var svg = bubbleChart.svg();

            if (svg !== undefined) {
                svg.selectAll('g.chart-body g text').each(insertLinebreaks);
            }
        })
        .elasticY(true)
        .keyAccessor(function (p) {
            return p.value.x;
        })
        .valueAccessor(function (p) {
            return p.value.y;
        })
        .radiusValueAccessor(function (p) {
            return (p.value.bubble / radiusDiff) * 10 * radiusCoef;
        });

    bubbleChart.xAxis().tickFormat(function (h) { return h.toLocaleString(); });
    bubbleChart.yAxis().tickFormat(function (h) { return h.toLocaleString(); });
    bubbleChart.margins().left = 70;

    dc.renderAll();
}

function updateAllComponents(initKendoGrid) {
    updatePeriods();
    updateDataForBubbleChart();
    InitBubbleChart(true);

    if (initKendoGrid) {
        InitKendoGrid();
    }

    updateKendoGrid();
    redrawChart();
}

function TogglePeriodList(status) {
    $('#periodsList').prop("disabled", !status);
}

var slider = new Slider("#ex6");
slider.on("slide", function (slideEvt) {
    radiusCoef = slideEvt;
    redrawChart();
});


function updatePeriodList(periods) {
    var selectedPeriod = $("#periodsList").val() || 0;
    $("#periodsList option").remove();

    for (var i = 0; i < periods.length; i++) {
        $("#periodsList").append('<option ' + (i === 0 ? 'selected="selected "' : '') + 'value="' + periods[i].value + '">' + periods[i].name + '</option>');
    }

    $("#periodsList").val(selectedPeriod);
}

function updatePeriods() {
    var periodType = $("#periodTypeList option:selected").val();
    var dates = getDates();

    var data = {
        periodType: periodType,
        beginDate: dates.beginDate,
        endDate: dates.endDate
    }

    var periods = sendPost(basePath + 'Bubble/GetPeriods', data);

    updatePeriodList(periods);

    $('#beginDatepicker').datepicker('setDate', periods[0].begin);
    $('#endDatepicker').datepicker('setDate', periods[0].end);
}

function parseDate(input) {
    var parts = input.split('.');

    return new Date(parts[2], parts[1] - 1, parts[0]);
}